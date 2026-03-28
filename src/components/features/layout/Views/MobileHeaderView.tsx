// src/components/features/layout/Views/MobileHeaderView.tsx
"use client";

import { FC } from "react";
import Link from "next/link";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { localizationService } from "@/services/localizationService";
import { track } from "@/utils/track";

interface MobileHeaderViewProps {
  onMenuToggle(): void;
  modelType: ModelType;
  selectedModel: string;
  onLanguageChange(lang: "ru" | "en"): void;
  onModelTypeChange: (type: ModelType) => void;
  onModelChange: (id: string) => void;
  session: Session | null;
  status: "authenticated" | "unauthenticated" | "loading";
  handleRefresh: () => void;
  availableModels: ModelOptions;
}

export const MobileHeaderView: FC<MobileHeaderViewProps> = ({
  onMenuToggle,
  modelType,
  selectedModel,
  onLanguageChange,
  onModelTypeChange,
  onModelChange,
  session,
  status,
  handleRefresh,
  availableModels,
}) => {
  return (
    <header className="md:hidden flex items-center justify-between bg-gray-800 px-3 py-2 shadow">
      {/* Левая часть (меню) */}
      <button
        onClick={onMenuToggle}
        className="p-2 text-white hover:bg-gray-700 rounded"
        aria-label="Open menu"
      >
        ☰
      </button>

      {/* Центральная часть (языки, мермеид и модели) */}
      <div className="flex-1 mx-2 space-y-1">
        <div className="flex justify-center space-x-1">
          <button
            onClick={() => onLanguageChange("en")}
            className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
          >
            EN
          </button>
          <button
            onClick={() => onLanguageChange("ru")}
            className="px-2 py-1 bg-green-500 text-white rounded text-xs"
          >
            RU
          </button>

          {/* Блок мермеид */}
          <Link
            href="/mermind"
            className="px-2 py-1 rounded text-xs bg-purple-600 text-white hover:bg-purple-500 transition inline-flex items-center justify-center"
            title={localizationService.get("MerMind")}
            aria-label={localizationService.get("MerMind")}
            prefetch={false}
          >
            🧜‍♀️
          </Link>

          {/* Блок Курс */}
          <Link
            href="https://stepik.org/a/253246/?utm_source=project&utm_medium=referral&utm_campaign=ai-chat-3"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => track("open_course", "AICourse3")}
            className="px-3 py-1 bg-amber-500 text-white rounded hover:bg-amber-600"
            title={localizationService.get("Course")}
          >
            {localizationService.get("Course")}
          </Link>

          {/* Блок профиля */}
          {session && (
            <Link href="/user" className="text-white text-lg">
              🧑
            </Link>
          )}
        </div>
        <div className="flex justify-center space-x-1">
          {/* Первый select (тип модели) */}
          <div className="relative flex-1 min-w-[50px]">
            <select
              value={modelType}
              onChange={e => onModelTypeChange(e.target.value as ModelType)}
              className="bg-gray-700 text-white text-xs rounded pl-2 pr-6 py-0.5 w-full appearance-none"
            >
              <option value="text">{localizationService.get("Texts")}</option>
              <option value="code">{localizationService.get("Codes")}</option>
              <option value="image">{localizationService.get("Images")}</option>
            </select>
            <div className="absolute inset-y-0 right-1 flex items-center pointer-events-none">
              <span className="text-gray-400 text-xs">▼</span>
            </div>
          </div>

          {/* Второй select (конкретная модель) */}
          <div className="relative flex-1 min-w-[100px]">
            <select
              value={selectedModel}
              onChange={e => onModelChange(e.target.value)}
              className="bg-gray-700 text-white text-xs rounded pl-2 pr-6 py-0.5 w-full appearance-none"
            >
              {availableModels[modelType].map(m => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-1 flex items-center pointer-events-none">
              <span className="text-gray-400 text-xs">▼</span>
            </div>
          </div>
        </div>
      </div>

      {/* Правая часть (кнопки) */}
      <div className="w-8 flex justify-end">
        {status === "loading" ? (
          <span className="p-2 opacity-50">⟳</span>
        ) : session ? (
          <button
            onClick={() => {
              localStorage.removeItem("auto-guest-login");
              sessionStorage.setItem("justSignedOutAt", Date.now().toString());
              signOut();
            }}
            className="p-2 text-white hover:bg-gray-700 rounded"
            aria-label="Sign out"
          >
            ⏏
          </button>
        ) : (
          <button
            onClick={handleRefresh}
            className={"p-2 text-white hover:bg-gray-700 rounded"}
            aria-label="Refresh"
          >
            ⟳
          </button>
        )}
      </div>
    </header>
  );
};
