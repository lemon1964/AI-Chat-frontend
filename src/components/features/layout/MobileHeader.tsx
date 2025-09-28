// src/components/features/layout/MobileHeader.tsx
"use client";

import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { showNotification } from "@/reducers/notificationReducer";
import { languageActions } from "@/reducers/languageReducer";
import { modelActions } from "@/reducers/modelReducer";
import { localizationService } from "@/services/localizationService";
import { useUserSession } from "@/hooks/useUserSession";
import { MobileHeaderView } from "./Views/MobileHeaderView";

export interface MobileHeaderProps {
  onMenuToggle(): void;
  modelType: ModelType;
  selectedModel: string;
}

export const MobileHeader: FC<MobileHeaderProps> = ({ onMenuToggle, modelType, selectedModel }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { session, status, isLoading } = useUserSession();
  const [, setIsRefreshing] = useState(false);
  const availableModels = useSelector((state: RootState) => state.availableModels);

  useEffect(() => {
    if (session) return;
    if (window.innerWidth < 768) {
      dispatch(showNotification(localizationService.get("MobileLoginOnly"), "info", 5));
    }
  }, [session, dispatch]);

  const handleLanguageChange = (lang: "ru" | "en") => {
    dispatch(languageActions.setLanguage(lang));
  };

  const handleModelTypeChange = (type: ModelType) => {
    dispatch(modelActions.setModelType(type));
  };

  const handleModelChange = (modelId: string) => {
    dispatch(modelActions.setModel(modelId));
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    window.location.reload();
  };

  if (isLoading || status === "loading") {
    return (
      <header className="hidden md:flex items-center justify-between p-4 bg-gray-800 text-white">
        <div className="animate-pulse">Загрузка...</div>
      </header>
    );
  }

  return (
    <MobileHeaderView
      onMenuToggle={onMenuToggle}
      modelType={modelType}
      selectedModel={selectedModel}
      onLanguageChange={handleLanguageChange}
      onModelTypeChange={handleModelTypeChange}
      onModelChange={handleModelChange}
      session={session}
      status={status}
      handleRefresh={handleRefresh}
      availableModels={availableModels}
    />
  );
};
