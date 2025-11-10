// src/components/features/chat/ChatWindowViews/ChatMessages.tsx

import { ImageOutput } from "@ui/chat/ImageOutput";
import dynamic from "next/dynamic";
import { localizationService } from "@/services/localizationService";

const MarkdownRenderer = dynamic(
  () => import("@features/common/MarkdownRenderer").then(mod => mod.MarkdownRenderer),
  { ssr: false }
);

interface ChatMessagesProps {
  messages: Message[];
  speakingId: string | null;
  speakText: (id: string, text: string) => void;
  topRef: React.RefObject<HTMLDivElement | null>;
  bottomRef: React.RefObject<HTMLDivElement | null>;
  scrollToTop: () => void;
  scrollToBottom: () => void;
}

export const ChatMessages = ({
  messages,
  speakingId,
  speakText,
  topRef,
  bottomRef,
  scrollToTop,
  scrollToBottom,
}: ChatMessagesProps) => (
  <div className="relative flex-1 overflow-hidden">
    <button
      onClick={scrollToBottom}
      className="absolute top-2 right-4 z-10 hover:bg-gray-300 rounded-full p-1 shadow"
      title={localizationService.get("GoToLatest")}
    >
      ▼
    </button>

    <div className="flex flex-col h-full overflow-y-auto p-2 md:p-4 space-y-4 bg-black">
      <div ref={topRef} />
      {messages.map(msg => (
        <div key={msg.id} className="space-y-1">
          <div className="ml-2 md:ml-4 text-gray-400 break-words">{msg.prompt}</div>
          {msg.answers.map(ans =>
            /\.(png|jpe?g|gif)$/i.test(ans.content) ? (
              <ImageOutput key={ans.id} url={ans.content} />
            ) : (
              <div
                key={ans.id}
                className="mt-2 ml-4 md:ml-8 bg-gray-800 text-white border border-gray-700 rounded-md p-2 md:p-3 flex items-start break-words"
              >
                <div className="flex-1 min-w-0 overflow-x-auto">
                  {typeof ans.content === "string" ? (
                    <MarkdownRenderer content={ans.content} />
                  ) : (
                    <div className="text-red-500 text-sm">
                      {localizationService.get("InvalidResponseContent")}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => speakText(ans.id, ans.content)}
                  className="ml-2 text-xl shrink-0"
                  title={
                    speakingId === ans.id
                      ? localizationService.get("Stop")
                      : localizationService.get("Play")
                  }
                >
                  {speakingId === ans.id ? "⏸️" : "🔊"}
                </button>
              </div>
            )
          )}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>

    <button
      onClick={scrollToTop}
      className="absolute bottom-2 right-4 z-10 hover:bg-gray-300 rounded-full p-1 shadow"
      title={localizationService.get("GoToFirst")}
    >
      ▲
    </button>
  </div>
);
