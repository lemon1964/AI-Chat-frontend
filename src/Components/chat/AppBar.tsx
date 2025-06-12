// frontend/src/Components/chat/AppBar.tsx
"use client";

import { FC, useEffect, useState, useRef, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { localizationService } from "@/services/localizationService";
import { audioService } from "@/services/audioService";
import Modal from "@/Components/common/Modal";
import BaseForm from "@/Components/users/BaseForm";
import ModalTogglable from "@/Components/common/ModalTogglable";
import apiClient from "@/services/authClientService";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store/store";
import { modelActions } from "@/reducers/modelReducer";
import { MODEL_OPTIONS } from "@/lib/ModelOptions";
import { showNotification } from "@/reducers/notificationReducer";

interface AppBarProps {
  onLanguageChange: (lang: string) => void;
}

export const AppBar: FC<AppBarProps> = ({ onLanguageChange }) => {
  const dispatch = useDispatch<AppDispatch>();
  const loginRef = useRef<{ toggleVisibility: () => void }>(null);
  const registerRef = useRef<{ toggleVisibility: () => void }>(null);
  const { data: session } = useSession();
  const [userName, setUserName] = useState<string | null>(null);

  // Состояние из Redux: текущая выбранная модель
  const selectedModel = useSelector((state: RootState) => state.model.selectedModel);
  const { modelType } = useSelector((state: RootState) => state.model);
  const { setModelType, setModel } = modelActions;

  // Проверка и обновление токена
  const verifySession = useCallback(async () => {
    if (!session?.accessToken || !session.refreshToken) return;

    try {
      await apiClient.post("/api/auth/token/verify/", {
        token: session.refreshToken,
      });
    } catch (error: unknown) {
      console.log("Session verification failed", error);
    }
  }, [session?.accessToken, session?.refreshToken]);

  useEffect(() => {
    verifySession();
  }, [verifySession]);

  // Забираем имя пользователя и сразу показываем правила
  useEffect(() => {
    if (!session) return;
    const fetchUserName = async () => {
      try {
        const res = await apiClient.get("/api/auth/get-user-data/");
        setUserName(res.data.name || "🫥");
        // Показываем правила один раз после логина
         dispatch(showNotification(localizationService.get("RateLimitRules"), "info", 10));
      } catch {
        dispatch(showNotification(localizationService.get("ErrorFetchingProfile"), "error", 4));
        setUserName("🫥");
      }
    };
    if (session) {
      fetchUserName();
    }
  }, [session, dispatch]);

  useEffect(() => {
    audioService.playMusic("/music/greensleeves.mp3");
    return () => {
      audioService.stopMusic();
    };
  }, []);

  const handleLanguageChange = (lang: string) => {
    localizationService.setLanguageAndSync(lang);
    onLanguageChange(lang);
  };

  return (
    <header className="sticky top-0 z-40 bg-gray-800 border-b px-4 py-3 flex items-center justify-between">
      {/* — Слева: выбор языка */}
      <div className="flex gap-2">
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => handleLanguageChange("en")}
        >
          EN
        </button>
        <button
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={() => handleLanguageChange("ru")}
        >
          RU
        </button>
      </div>

      {/* селектор модели: */}
      <div className="flex items-center space-x-4">
        <select
          value={modelType}
          onChange={e => dispatch(setModelType(e.target.value as ModelType))}
          className="border px-2 py-1 rounded bg-gray-500 hover:bg-gray-300"
        >
          <option value="text">{localizationService.get("Texts")}</option>
          <option value="code">{localizationService.get("Codes")}</option>
          <option value="image">{localizationService.get("Images")}</option>
        </select>

        <select
          value={selectedModel}
          onChange={e => dispatch(setModel(e.target.value))}
          className="border px-2 py-1 rounded bg-gray-500 hover:bg-gray-300"
        >
          {MODEL_OPTIONS[modelType].map(model => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      </div>

      {/* — Справа: Login/Register или имя пользователя + Logout */}
      <div>
        {session ? (
          <div className="flex items-center gap-4">
            <p className="text-gray-200">
              <span className="font-medium">📍</span>{" "}
              <Link href="/user" className="underline hover:text-blue-600">
                {userName}
              </Link>
            </p>
            <button
              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-red-600"
              onClick={() => signOut()}
            >
              {localizationService.get("Logout")}
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <ModalTogglable buttonLabel="Login" ref={loginRef}>
              <Modal onClose={() => loginRef.current?.toggleVisibility()}>
                <BaseForm type="login" onClose={() => loginRef.current?.toggleVisibility()} />
              </Modal>
            </ModalTogglable>
            <ModalTogglable buttonLabel="Register" ref={registerRef}>
              <Modal onClose={() => registerRef.current?.toggleVisibility()}>
                <BaseForm type="register" onClose={() => registerRef.current?.toggleVisibility()} />
              </Modal>
            </ModalTogglable>
          </div>
        )}
      </div>
    </header>
  );
};
