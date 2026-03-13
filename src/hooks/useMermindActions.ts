// src/hooks/useMermindActions.ts
"use client";
import { useState } from "react";
import * as api from "@services/mermindClient";
import { useDispatch } from "react-redux";
import { showNotification } from "@/reducers/notificationReducer";
import { AppDispatch } from "@/store/store";

export function useMermindActions(selectedModel?: string | null) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdjusting, setIsAdjusting] = useState(false);
  const [detectedType, setDetectedType] = useState<string>("flowchart");
  const [usedModel, setUsedModel] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();

  const generate = async (text: string, type: string, lang = "ru") => {
    if (!text.trim()) return null;
    setIsGenerating(true);
    try {
      const data = await api.generate({
        text,
        type: type === "auto" ? "" : type,
        language: lang,
        model_id: selectedModel || undefined,
      });
      if (data?.type) setDetectedType(data.type);
      if (data?.used_model) setUsedModel(data.used_model);
      return data?.code as string | null;
    } finally { setIsGenerating(false); }
  };

  const adjust = async (code: string, type: string, instruction: string, lang = "ru") => {
    if (!instruction.trim()) return null;
    setIsAdjusting(true);
    try {
      const data = await api.adjust({
        code,
        type: type === "auto" ? detectedType : type,
        instruction,
        model_id: selectedModel || undefined,
        language: lang,
      });
      if (data?.used_model) setUsedModel(data.used_model);
      if (data?.code) dispatch(showNotification("Обновлено", "success", 2));
      else dispatch(showNotification("Не удалось применить уточнение", "error", 3));
      return data?.code as string | null;
    } finally { setIsAdjusting(false); }
  };

  const save = async (payload: {
    title?: string; source_text: string; type: string; code: string; language?: string;
  }) => {
    setIsSaving(true);
    try {
      await api.save({
        ...payload,
        model_used: usedModel || selectedModel || "",
        language: payload.language || "ru",
        tags: "demo",
      });
      dispatch(showNotification("Сохранено", "success", 3));
    } catch {
      dispatch(showNotification("Ошибка при сохранении", "error", 3));
    } finally { setIsSaving(false); }
  };

  return {
    isGenerating, isSaving, isAdjusting,
    detectedType, setDetectedType,
    usedModel,
    generate, adjust, save,
  };
}
