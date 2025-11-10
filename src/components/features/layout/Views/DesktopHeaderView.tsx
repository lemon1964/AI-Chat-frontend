// src/components/features/layout/Views/DesktopHeaderView.tsx
"use client";

import { FC, RefObject } from "react";
import Link from "next/link";
import { localizationService } from "@/services/localizationService";
import Modal from "@ui/common/Modal";
import ModalTogglable from "@features/common/ModalTogglable";
import BaseForm from "@features/users/BaseForm";
import { Session } from "next-auth";

interface Props {
  modelType: ModelType;
  selectedModel: string;
  session: Session | null;
  userName: string;
  onLanguageChange: (lang: "ru" | "en") => void;
  onModelTypeChange: (type: ModelType) => void;
  onModelChange: (id: string) => void;
  loginRef: RefObject<{ toggleVisibility(): void } | null>;
  registerRef: RefObject<{ toggleVisibility(): void } | null>;
  onLogout: () => void;
  availableModels: ModelOptions;
}

export const DesktopHeaderView: FC<Props> = ({
  modelType,
  selectedModel,
  session,
  userName,
  onLanguageChange,
  onModelTypeChange,
  onModelChange,
  loginRef,
  registerRef,
  onLogout,
  availableModels,
}) => {
  return (
    <header className="hidden md:flex sticky top-0 z-40 bg-gray-800 px-4 py-3 items-center justify-between">
      {/* Блок языка */}
      <div className="flex gap-2">
        <button
          onClick={() => onLanguageChange("en")}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          EN
        </button>
        <button
          onClick={() => onLanguageChange("ru")}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          RU
        </button>
      </div>

      {/* Блок моделей */}
      <div className="flex items-center space-x-4">
        <select
          value={modelType}
          onChange={e => onModelTypeChange(e.target.value as ModelType)}
          className="border px-2 py-1 rounded bg-gray-500 text-white hover:bg-gray-600"
        >
          <option value="text">{localizationService.get("Texts")}</option>
          <option value="code">{localizationService.get("Codes")}</option>
          <option value="image">{localizationService.get("Images")}</option>
        </select>

        <select
          value={selectedModel}
          onChange={e => onModelChange(e.target.value)}
          className="border px-2 py-1 rounded bg-gray-500 text-white hover:bg-gray-600"
        >
          {availableModels[modelType].map(m => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      {/* Блок мермеид */}
      <div className="flex items-center gap-2">
        <Link
          href="/mermind"
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-purple-600 text-white hover:bg-purple-500 transition"
          title={localizationService.get("MerMind")}
        >
          🧜‍♀️ {localizationService.get("MerMind")}
        </Link>
      </div>
      
      {/* Блок авторизации */}
      <div className="flex items-center gap-4">
        {session ? (
          <>
            <p className="text-gray-200">
              <span className="font-medium">📍</span>{" "}
              <Link href="/user" className="underline hover:text-blue-400">
                {userName}
              </Link>
            </p>
            <button
              onClick={onLogout}
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              {localizationService.get("Logout")}
            </button>
          </>
        ) : (
          <>
            <ModalTogglable 
              buttonLabel={localizationService.get("LogIn")} 
              ref={loginRef}
            >
              <Modal onClose={() => loginRef.current?.toggleVisibility()}>
                <BaseForm 
                  type="login" 
                  onClose={() => loginRef.current?.toggleVisibility()} 
                />
              </Modal>
            </ModalTogglable>
            <ModalTogglable 
              buttonLabel={localizationService.get("Register")} 
              ref={registerRef}
            >
              <Modal onClose={() => registerRef.current?.toggleVisibility()}>
                <BaseForm 
                  type="register" 
                  onClose={() => registerRef.current?.toggleVisibility()} 
                />
              </Modal>
            </ModalTogglable>
          </>
        )}
      </div>
    </header>
  );
};
