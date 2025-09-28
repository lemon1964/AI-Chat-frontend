// src/components/features/layout/DesktopHeader.tsx
"use client";

import { FC, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { signOut } from "next-auth/react";
import { useUserSession } from "@/hooks/useUserSession";
import { languageActions } from "@/reducers/languageReducer";
import { modelActions } from "@/reducers/modelReducer";
import { DesktopHeaderView } from "./Views/DesktopHeaderView";

export interface DesktopHeaderProps {
  modelType: ModelType;
  selectedModel: string;
}

export const DesktopHeader: FC<DesktopHeaderProps> = ({ modelType, selectedModel }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { session, userName, status, isLoading } = useUserSession();
  const loginRef = useRef<{ toggleVisibility(): void }>(null);
  const registerRef = useRef<{ toggleVisibility(): void }>(null);
  const availableModels = useSelector((state: RootState) => state.availableModels);

  const handleLanguageChange = (lang: "ru" | "en") => {
    dispatch(languageActions.setLanguage(lang));
  };

  const handleModelTypeChange = (type: ModelType) => {
    dispatch(modelActions.setModelType(type));
  };

  const handleModelChange = (modelId: string) => {
    dispatch(modelActions.setModel(modelId));
  };

  const handleLogout = () => {
    localStorage.removeItem("auto-guest-login");
    sessionStorage.setItem("justSignedOutAt", Date.now().toString());
    signOut();
  };

  if (isLoading || status === "loading") {
    return (
      <header className="hidden md:flex items-center justify-between p-4 bg-gray-800 text-white">
        <div className="animate-pulse">Загрузка...</div>
      </header>
    );
  }

  return (
    <DesktopHeaderView
      modelType={modelType}
      selectedModel={selectedModel}
      session={session}
      userName={userName}
      onLanguageChange={handleLanguageChange}
      onModelTypeChange={handleModelTypeChange}
      onModelChange={handleModelChange}
      onLogout={handleLogout}
      loginRef={loginRef}
      registerRef={registerRef}
      availableModels={availableModels}
    />
  );
};
