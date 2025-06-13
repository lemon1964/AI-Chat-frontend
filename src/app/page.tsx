// frontend/src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Notification from "@/Components/common/Notification";
import { CategoryList } from "@/Components/chat/CategoryList";
import { ChatWindow } from "@/Components/chat/ChatWindow";
import { AppBar } from "@/Components/chat/AppBar";
import { localizationService } from "@/services/localizationService";
import ChatSkeleton from "@/Components/common/Preloader";
import useBackendWakeUp from "@/hooks/useBackendWakeUp";

export default function ChatPage() {
  const session = useSession();
  const [selected, setSelected] = useState<{ id: string; name: string } | null>(null);
  const [lang, setLang] = useState(localizationService.getCurrentLanguage());
  const isWakingUp = useBackendWakeUp();

  useEffect(() => {
    if (session.data) {
      // при логине сбрасываем демо-выбор
      setSelected(null);
    }
  }, [session.data]);

  if (isWakingUp) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <ChatSkeleton />
        <span className="ml-2 text-gray-600">Пробуждаем сервер, подождите…</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Notification />
      <AppBar onLanguageChange={(newLang: string) => setLang(newLang)} />
      {/* === Основной контейнер: flex-строка, занимает всё оставшееся под AppBar === */}
      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* -- Левый sidebar (рубрики) -- */}
        <aside className="w-1/5 border-r overflow-y-auto sticky top-16 p-4">
          <CategoryList key={lang} onSelect={(id, name) => setSelected({ id, name })} />
        </aside>
        {/* -- Правая панель: чат, flex-1 растягивается на всю высоту под AppBar -- */}
        <main className="w-4/5 flex flex-col flex-1 min-h-0">
          {selected ? (
            <ChatWindow key={lang} categoryId={selected.id} categoryName={selected.name} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-600">
              {localizationService.get("SelectCategory")}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
