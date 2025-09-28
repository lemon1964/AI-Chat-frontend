// src/components/features/common/ClientChatPage.tsx
"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import { localizationService } from "@/services/localizationService";
import { Layout } from "@features/layout/Layout";
import ChatWindowContainer from "@features/chat/ChatWindowContainer";
import { RootState } from "@/store/store";
import Notification from "@features/common/Notification";
import useBackendWakeUp from "@/hooks/useBackendWakeUp";
import { useModels } from "@/hooks/useModels";
import { useSyncRateTier } from "@/hooks/useSyncRateTier";
import ChatSkeleton from "@ui/common/Preloader";
import { ErrorBoundary } from "@ui/common/ErrorBoundary";

export default function ClientChatPage({ session }: { session: Session | null }) {
  const [selected, setSelected] = useState<null | { id: string; name: string }>(null);
  useSelector((state: RootState) => state.language.current);
  const isWakingUp = useBackendWakeUp();
  const { isLoadingModels } = useModels(); // Модели и флаги авторизации подгружаются сразу
  const tier = useSelector((s: RootState) => s.flags.tier);
  useSyncRateTier(tier);  // синхронизируем окно лимитов с оплатой


  useEffect(() => {
    const alreadyAutoLoggedIn = localStorage.getItem("auto-guest-login");
    const justSignedOutAt = parseInt(sessionStorage.getItem("justSignedOutAt") || "0", 10);
    const recentlySignedOut = Date.now() - justSignedOutAt < 5000;

    if (!session && !alreadyAutoLoggedIn && !recentlySignedOut) {
      signIn("credentials", {
        email: "admin@admin.ru",
        password: "R12345678r",
        redirect: false,
      }).then(() => {
        localStorage.setItem("auto-guest-login", "true");
      });
    }
  }, [session]);

  useEffect(() => {
    setSelected(null);
  }, [session]);

  if (isWakingUp) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <ChatSkeleton />
        <span className="ml-2 text-gray-600">Пробуждаем сервер, ждем…</span>
      </div>
    );
  }

  if (isLoadingModels) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <ChatSkeleton />
        <span className="ml-2 text-gray-600">Загружаем модели..</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-black">
      <Notification />
      <Layout onCategorySelect={(id, name) => setSelected({ id, name })}>
        {selected ? (
          <ErrorBoundary>
            <ChatWindowContainer
              key={selected.id}
              categoryId={selected.id}
              categoryName={selected.name}
            />
          </ErrorBoundary>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-600">
            {localizationService.get("SelectCategory")}
          </div>
        )}
      </Layout>
    </div>
  );
}
