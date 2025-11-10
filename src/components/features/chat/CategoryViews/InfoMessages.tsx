// src/components/features/chat/CategoryViews/InfoMessages.tsx

import { infoMessages } from "@/data/infoMessages";
import { localizationService } from "@/services/localizationService";

interface InfoMessagesProps {
  type: "auth" | "demo";
}

export default function InfoMessages({ type }: InfoMessagesProps) {
  const lang = localizationService.getCurrentLanguage() === "ru" ? "ru" : "en";
  const messages = infoMessages[lang as "ru" | "en"]?.[type] ?? [];

  return (
    <div
      className="space-y-3 text-green-500 text-sm [&_a]:underline [&_a:hover]:text-green-600"
      dangerouslySetInnerHTML={{
        __html: messages.map(m => `<p key="${m.id}">${m.text}</p>`).join(""),
      }}
    />
  );
}