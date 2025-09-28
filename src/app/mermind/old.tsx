

// src/components/features/mermind/MermindContainer.tsx
"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import mermaid from "mermaid";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { useModels } from "@/hooks/useModels";
import ChatSkeleton from "@ui/common/Preloader";
import apiClient from "@/services/authClientService";
import { modelActions } from "@/reducers/modelReducer";
import Notification from "@features/common/Notification";
import { showNotification } from "@/reducers/notificationReducer";
import MermindView from "@/components/features/mermind/MermindViews/MermindView";
import { TYPES, TYPE_LABEL } from "@/data/mermindTypes";
import { useDebouncedEffect } from "@/hooks/useDebouncedEffect";
import { parseTagsCSV, toTagsCSV, uniqSorted } from "@/utils/tags";

mermaid.initialize({ startOnLoad: false, securityLevel: "loose" });

export default function MermindContainer() {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoadingModels } = useModels();
  const availableModels = useSelector((s: RootState) => s.availableModels);
  const selectedModel = useSelector((s: RootState) => s.model.selectedModel);

  // form state
  const [text, setText] = useState("");
  const [type, setType] = useState<DiagramType>("auto");
  const [code, setCode] = useState("flowchart TD\nA-->B");
  const [detectedType, setDetectedType] = useState<string>("flowchart");
  const [error, setError] = useState<string | null>(null);

  // busy flags
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdjusting, setIsAdjusting] = useState(false);

  // models
  const [usedModel, setUsedModel] = useState<string>(""); // кто реально сгенерил последнюю версию
  const [docUsedModel, setDocUsedModel] = useState<string>(""); // кто указан у загруженной из БД диаграммы
  const displayModel = docUsedModel || usedModel || selectedModel || "—";

  // preview
  const svgHostRef = useRef<HTMLDivElement>(null);
  const svgIdRef = useRef(`mmd-${Math.random().toString(36).slice(2)}`);

  // library
  const [isLibOpen, setLibOpen] = useState(false);
  const [library, setLibrary] = useState<DiagramListItem[]>([]);
  const [loadingLib, setLoadingLib] = useState(false);

  // фильтры
  const [libQuery, setLibQuery] = useState("");
  const [libType, setLibType] = useState<string>("");
  const [libTags, setLibTags] = useState("");
  const [libLimit, setLibLimit] = useState(50);

  // adjust
  const [instruction, setInstruction] = useState("");

  const allModels = useMemo(
    () => [...(availableModels.text || []), ...(availableModels.code || [])],
    [availableModels.code, availableModels.text]
  );

  // первичная модель (если вдруг пусто в сторе)
  useEffect(() => {
    if (!selectedModel && allModels.length) {
      dispatch(modelActions.setModel(allModels[0].id));
    }
  }, [selectedModel, allModels, dispatch]);

  // мермейд-рендер (зависит от code и факта загрузки моделей — иначе иногда был пустой preview при F5)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { svg } = await mermaid.render(svgIdRef.current, code);
        if (!cancelled && svgHostRef.current) {
          svgHostRef.current.innerHTML = svg;
        }
        setError(null);
      } catch (e) {
        if (e instanceof Error) setError(e.message || "Parse error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [code, isLoadingModels]);

  // авто-ретрай при ошибке парсинга: сразу же просим бэк перегенерить соседней моделью
  useEffect(() => {
    if (!error) return;
    (async () => {
      try {
        const { data } = await apiClient({
          url: "/api/mermaid/generate/",
          method: "POST",
          data: {
            text,
            type: type === "auto" ? "" : type,
            language: "ru",
            model_id: selectedModel || undefined,
            retry_next: true,
          },
        });
        if (data?.code) {
          setCode(data.code);
          setDetectedType(data.type);
          setUsedModel(data.used_model);
          setDocUsedModel("");
          setError(null);
        }
      } catch {
        /* no-op */
      }
    })();
  }, [error, selectedModel, text, type]);

  // actions
  const handleModelChange = (id: string) => dispatch(modelActions.setModel(id));

  const generate = async () => {
    if (!text.trim()) return;
    setError(null);
    setIsGenerating(true);
    try {
      const { data } = await apiClient({
        url: "/api/mermaid/generate/",
        method: "POST",
        data: {
          text,
          type: type === "auto" ? "" : type,
          language: "ru",
          model_id: selectedModel || undefined,
        },
      });
      if (data?.code) setCode(data.code);
      if (data?.type) setDetectedType(data.type);
      if (data?.used_model) {
        setUsedModel(data.used_model);
        setDocUsedModel(""); // сбрасываем “модель из документа”
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message || "Сервис генерации временно недоступен. Попробуйте позже.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const save = async () => {
    setIsSaving(true);
    try {
      await apiClient({
        url: "/api/mermaid/save/",
        method: "POST",
        data: {
          title: "",
          source_text: text,
          type: type === "auto" ? detectedType : type,
          code,
          model_used: usedModel || selectedModel,
          language: "ru",
          tags: "demo",
        },
      });
      dispatch(showNotification("Сохранено", "success", 3));
    } catch {
      dispatch(showNotification("Ошибка при сохранении", "error", 3));
    } finally {
      setIsSaving(false);
    }
  };

  const adjust = async () => {
    if (!instruction.trim()) return;
    setIsAdjusting(true);
    try {
      const { data } = await apiClient({
        url: "/api/mermaid/adjust/",
        method: "POST",
        data: {
          code,
          type: type === "auto" ? detectedType : type,
          instruction,
          model_id: selectedModel || undefined,
        },
      });
      if (data?.code) {
        setCode(data.code);
        setUsedModel(data.used_model || selectedModel);
        setDocUsedModel(""); // сброс
        dispatch(showNotification("Обновлено", "success", 2));
      } else {
        dispatch(showNotification("Не удалось применить уточнение", "error", 3));
      }
    } finally {
      setIsAdjusting(false);
    }
  };

  const fetchLibrary = useCallback(async () => {
    setLoadingLib(true);
    try {
      const { data } = await apiClient({
        url: "/api/mermaid/list/",
        method: "GET",
        params: {
          q: libQuery || undefined,
          type: libType || undefined,
          tags: libTags || undefined,
          limit: libLimit || undefined,
        },
      });
      setLibrary(data || []);
    } finally {
      setLoadingLib(false);
    }
    // важно: зависимости — сами фильтры
  }, [libQuery, libType, libTags, libLimit]);

  // открыть модалку как раньше
  const openLibrary = async () => {
    setLibOpen(true);
    await fetchLibrary();
  };

  // автопоиск при изменении фильтров (пока модалка открыта)
  useDebouncedEffect(
    () => {
      if (isLibOpen) fetchLibrary();
    },
    [isLibOpen, libQuery, libType, libTags, libLimit],
    350
  );

  // доступные теги берём из текущих items
  const availableTags = useMemo(() => {
    const raw = new Set<string>();
    // собрать из элементов
    library.forEach(it => {
      parseTagsCSV(it.tags || "").forEach(t => raw.add(t));
    });
    // гарантировать видимость выбранных
    parseTagsCSV(libTags).forEach(t => raw.add(t));

    return uniqSorted(Array.from(raw));
  }, [library, libTags]);

  // текущее выбранное множество
  const selected = useMemo(() => new Set(parseTagsCSV(libTags)), [libTags]);

  const toggleTag = (tag: string) => {
    const next = new Set(selected);
    if (next.has(tag)) next.delete(tag);
    else next.add(tag);
    setLibTags(toTagsCSV(Array.from(next)));
  };

  const clearTags = () => setLibTags("");

  const loadDiagram = async (id: number) => {
    const { data } = await apiClient({ url: `/api/mermaid/${id}/`, method: "GET" });
    setText(data.source_text || "");
    setCode(data.code || "");
    setDetectedType(data.type || "flowchart");
    if (type !== "auto" && data.type) setType(data.type);
    setDocUsedModel(data.model_used || "");
    setLibOpen(false);
  };

  const renameDiagram = async (id: number, title: string, tags?: string) => {
    await apiClient({ url: `/api/mermaid/${id}/`, method: "PATCH", data: { title, tags } });
    // локально обновим список
    setLibrary(list => list.map(d => (d.id === id ? { ...d, title, tags } : d)));
  };

  const deleteDiagram = async (id: number) => {
    await apiClient({ url: `/api/mermaid/${id}/`, method: "DELETE" });
    setLibrary(list => list.filter(d => d.id !== id));
  };

  const downloadSvg = () => {
    if (!svgHostRef.current) return;
    const svg = svgHostRef.current.innerHTML;
    if (!svg?.trim()) return;
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "diagram.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoadingModels) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <ChatSkeleton />
        <span className="ml-2 text-gray-600">Загружаем модели…</span>
      </div>
    );
  }

  return (
    <>
      <Notification />
      <div className="w-full max-w-2xl flex justify-between items-center mb-6">
        <Link
          href="/"
          className="text-base sm:text-lg text-white bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition"
        >
          На главную
        </Link>
      </div>

      <MermindView
        // данные
        text={text}
        setText={setText}
        type={type}
        setType={setType}
        code={code}
        setCode={setCode}
        types={TYPES}
        typeLabels={TYPE_LABEL}
        svgHostRef={svgHostRef}
        detectedType={detectedType}
        error={error}
        // модели
        allModels={allModels}
        selectedModel={selectedModel}
        onModelChange={handleModelChange}
        displayModel={displayModel}
        usedModelBadgeSource={usedModel || selectedModel || "—"}
        // флаги
        isGenerating={isGenerating}
        isSaving={isSaving}
        isAdjusting={isAdjusting}
        // действия
        onGenerate={generate}
        onSave={save}
        onDownloadSvg={downloadSvg}
        // уточнение
        instruction={instruction}
        setInstruction={setInstruction}
        onAdjust={adjust}
        // библиотека
        isLibOpen={isLibOpen}
        openLibrary={openLibrary}
        closeLibrary={() => setLibOpen(false)}
        library={library}
        loadingLib={loadingLib}
        loadDiagram={loadDiagram}
        renameDiagram={renameDiagram}
        deleteDiagram={deleteDiagram}
        // фильтры
        setLibQuery={setLibQuery}
        libQuery={libQuery}
        setLibType={setLibType}
        libType={libType}
        libTags={libTags}
        setLibLimit={setLibLimit}
        libLimit={libLimit}
        // теги
        availableTags={availableTags}
        toggleTag={toggleTag}
        clearTags={clearTags}
      />
    </>
  );
}