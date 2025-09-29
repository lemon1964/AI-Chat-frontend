// src/components/features/mermind/MermindContainer.tsx
"use client";

/**
 * MermindContainer
 * — умный контейнер для страницы диаграмм.
 * Держит состояние формы, связь с redux-моделями, мермейд-превью и библиотеку.
 * Вьюха/разметка — в MermindViews.
 */

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Notification from "@features/common/Notification";
import MermindView from "./MermindViews/MermindView";
import ChatSkeleton from "@ui/common/Preloader";

import { useModels } from "@/hooks/useModels";
import { useMermaidRender } from "@/hooks/useMermaidRender";
import { useMermindLibrary } from "@/hooks/useMermindLibrary";
import { useMermindActions } from "@/hooks/useMermindActions";
import { useRateLimit } from "@/hooks/useRateLimit";

import { AppDispatch, RootState } from "@/store/store";
import { modelActions } from "@/reducers/modelReducer";
import { showNotification } from "@/reducers/notificationReducer";
import apiClient from "@/services/authClientService";
import { audioService } from "@/services/audioService";

import { TYPES, TYPE_LABEL } from "@/data/mermindTypes";

import MermindZoomModal from "./MermindViews/MermindZoomModal";

export default function MermindContainer() {
  // ── Redux / models
  const dispatch = useDispatch<AppDispatch>();
  const { isLoadingModels } = useModels();
  const availableModels = useSelector((s: RootState) => s.availableModels);
  const selectedModel = useSelector((s: RootState) => s.model.selectedModel);

  // ── Form state
  const [text, setText] = useState("");
  const [type, setType] = useState<DiagramType>("auto");
  const [code, setCode] = useState("flowchart TD\nA-->B");
  const [error, setError] = useState<string | null>(null);
  const [instruction, setInstruction] = useState("");

  // ── Actions (генерация/уточнение/сохранение) — единая точка
  const {
    isGenerating,
    isSaving,
    isAdjusting,
    detectedType,
    setDetectedType,
    usedModel,
    generate,
    adjust,
    save,
  } = useMermindActions(selectedModel);

  // Какая модель отображается пользователю рядом с превью
  const [docUsedModel, setDocUsedModel] = useState<string>("");
  const displayModel = docUsedModel || usedModel || selectedModel || "—";

  // ── Показать диаграмму в модалке
  const [isZoomOpen, setZoomOpen] = useState(false);
  const openZoom = () => setZoomOpen(true);
  const closeZoom = () => setZoomOpen(false);

  // ── Preview (SVG host)
  const svgHostRef = useRef<HTMLDivElement>(null);
  const depsKey = `${isLoadingModels}-${isZoomOpen}`; // или JSON.stringify(...)
  useMermaidRender(code, svgHostRef, depsKey);
  // useMermaidRender(code, svgHostRef, [isLoadingModels, isZoomOpen]);

  // ── Модель по умолчанию (если стор ещё пуст)
  const allModels = useMemo(
    () => [...(availableModels.text || []), ...(availableModels.code || [])],
    [availableModels.text, availableModels.code]
  );

  // ── Проверка авторизации
  const isAuthed = useSelector((s: RootState) => s.flags.isAuthenticated);

  // ── Rate limit по платной подписке
  const flags = useSelector((s: RootState) => s.flags);
  const isReady = flags.loaded;
  const { isAllowed, mark } = useRateLimit(flags.limits || undefined);

  useEffect(() => {
    audioService.playMusic("/music/track.mp3");
    return () => audioService.stopMusic();
  }, []);

  useEffect(() => {
    if (!selectedModel && allModels.length) {
      dispatch(modelActions.setModel(allModels[0].id));
    }
  }, [selectedModel, allModels, dispatch]);

  // ── Авто-ретрай при ошибке парсинга: просим бэк перегенерить соседней моделью
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
          setDocUsedModel("");
          setError(null);
        }
      } catch {
        /* no-op */
      }
    })();
  }, [error, selectedModel, setDetectedType, text, type]);

  // ── Model select handler
  const handleModelChange = (id: string) => dispatch(modelActions.setModel(id));

  // ── Обёртки над actions: подгоняем сигнатуры под «тупую» вьюху
  const handleGenerate = async () => {
    if (!text.trim()) return;
    const { ok, retryAfter } = isAllowed("diagram");
    // if (process.env.NODE_ENV !== "production") {
    //   console.log("[mermind] check diagram:", { ok, retryAfter });
    // }
    if (!ok) {
      const when = retryAfter!.toLocaleString();
      dispatch(
        showNotification(
          `Лимит диаграмм исчерпан. Следующий доступ: ${when}. 
          Оплатите подписку — получите 3 диаграммы/день.`,
          "error",
          5
        )
      );
      return;
    }
    const newCode = await generate(text, type, "ru");
    if (newCode) {
      setCode(newCode);
      setDocUsedModel("");
      setError(null);
      mark("diagram"); // ← списываем попытку по факту успеха
    }
  };

  const handleAdjust = async () => {
    if (!instruction.trim()) return;
    const { ok, retryAfter } = isAllowed("diagram");
    if (!ok) {
      const when = retryAfter!.toLocaleString();
      dispatch(
        showNotification(
          `Лимит диаграмм исчерпан. Следующий доступ: ${when}. 
          Оплатите подписку — получите 3 диаграммы/день.`,
          "error",
          6
        )
      );
      return;
    }
    const newCode = await adjust(code, type, instruction, "ru");
    if (newCode) {
      setCode(newCode);
      setDocUsedModel("");
      setInstruction(""); // подчистим поле
      setError(null);
      mark("diagram"); // ← списываем попытку по факту успеха
    }
  };

  const handleSave = async () => {
    await save({
      title: "",
      source_text: text,
      type: type === "auto" ? detectedType : type,
      code,
      language: "ru",
    });
  };

  // ── Библиотека (хук инкапсулирует весь CRUD и фильтры)
  const lib = useMermindLibrary();

  // Открыть диаграмму из библиотеки → подставить в редактор
  const handleOpenFromLibrary = async (id: number) => {
    const data = await lib.loadOne(id);
    if (!data) return;

    setText(data.source_text || "");
    setCode(data.code || "");
    setDetectedType(data.type || "flowchart");
    if (type !== "auto" && data.type) setType(data.type); // если юзер зафиксировал тип — синхронизируем
    setDocUsedModel(data.model_used || "");
    lib.close();
  };

  // ── SVG export
  const downloadSvg = () => {
    const host = svgHostRef.current;
    const svg = host?.innerHTML || "";
    if (!svg.trim()) return;

    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "diagram.svg";
    a.click();

    URL.revokeObjectURL(url);
  };

  // ── Сплэш, пока ждём модели
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

      {/* Крошка навигации — единый стиль, как в чате */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-6">
        <Link
          href="/"
          className="text-base sm:text-lg text-white bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition"
        >
          На главную
        </Link>
      </div>

      <MermindView
        // данные формы
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
        allModels={[...(availableModels.text || []), ...(availableModels.code || [])]}
        selectedModel={selectedModel}
        onModelChange={handleModelChange}
        displayModel={displayModel}
        usedModelBadgeSource={usedModel || selectedModel || "—"}
        // busy
        isGenerating={isGenerating}
        isSaving={isSaving}
        isAdjusting={isAdjusting}
        isAuthed={isAuthed}
        isReady={isReady}
        // действия
        onGenerate={handleGenerate}
        onSave={handleSave}
        onDownloadSvg={downloadSvg}
        // уточнение
        instruction={instruction}
        setInstruction={setInstruction}
        onAdjust={handleAdjust}
        // библиотека
        isLibOpen={lib.isOpen}
        openLibrary={lib.open}
        closeLibrary={lib.close}
        library={lib.items}
        loadingLib={lib.loading}
        loadDiagram={handleOpenFromLibrary}
        renameDiagram={lib.renameOne}
        deleteDiagram={lib.deleteOne}
        // фильтры
        setLibQuery={lib.setQ}
        libQuery={lib.q}
        setLibType={lib.setType}
        libType={lib.type}
        libTags={lib.tags}
        setLibLimit={lib.setLimit}
        libLimit={lib.limit}
        // теги
        availableTags={lib.availableTags}
        toggleTag={lib.toggleTag}
        clearTags={lib.clearTags}
        // SVG в модалке
        onOpenZoom={openZoom}
      />
      {isZoomOpen && <MermindZoomModal code={code} onClose={closeZoom} />}
    </>
  );
}
