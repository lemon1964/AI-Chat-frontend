// frontend/src/Components/chat/ChatWindow.tsx
"use client";

import { FC, useState, useEffect, useRef, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import { RootState, AppDispatch } from "@/store/store";
import { useGetQuestionsQuery, useCreateQuestionMutation } from "@/services/chatApi";
import ChatSkeleton from "@/Components/common/Preloader";
import { showNotification } from "@/reducers/notificationReducer";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { ImageOutput } from "./ImageOutput";
import { localizationService } from "@/services/localizationService";
import SoundVolume from "@/Components/common/SoundVolume";
import ModalAudio from "@/Components/common/ModalAudio";
import { useRateLimit } from "@/hooks/useRateLimit";
import { demoMessages } from "@/lib/demoChat";

export const ChatWindow: FC<ChatWindowProps> = ({ categoryId, categoryName }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { modelType, selectedModel } = useSelector((state: RootState) => state.model);

  const session = useSession();

  // определяем демо-категорию (независимо от логина)
  const demoCategoryIds = ["humor", "images", "code"];
  const isDemoCategory = demoCategoryIds.includes(categoryId);

  const isDemo = isDemoCategory;

  // Запрос сообщений
  const {
    data: messages,
    isLoading,
    isFetching,
    refetch,
    error,
  } = useGetQuestionsQuery(categoryId, { skip: isDemoCategory });

  const [audioModalOpen, setAudioModalOpen] = useState(false);

  const [createQuestion, { isLoading: isSending }] = useCreateQuestionMutation();
  const [input, setInput] = useState("");

  // ───────── Реф на кнопку отправки ─────────
  const sendButtonRef = useRef<HTMLButtonElement>(null);

  // Состояния для TTS
  const { speakingId, speakText } = useTextToSpeech();

  // Хук для распознавания речи
  const startListening = useSpeechRecognition(transcript => {
    setInput(transcript);
    sendButtonRef.current?.focus();
  });
  // ───────────────────────────────────────────

  // PAGE_SIZE и infinite scroll
  const PAGE_SIZE = 20;
  const [limit, setLimit] = useState(PAGE_SIZE);

  const { isAllowed, mark } = useRateLimit();

  useEffect(() => {
    setLimit(PAGE_SIZE);
  }, [categoryId]);

  // Выбираем источник сообщений
  const messagesToShow = useMemo<Message[]>(() => {
    if (isDemo) {
      return demoMessages[categoryId] || [];
    }
    return messages ? messages.slice(-limit).reverse() : [];
  }, [isDemo, categoryId, messages, limit]);

  const topRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesToShow.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesToShow]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    if (container.scrollTop < 50 && messages && limit < messages.length) {
      setLimit(prev => Math.min(prev + PAGE_SIZE, messages.length));
    }
  };

  const scrollToTop = () => topRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToBottom = () => bottomRef.current?.scrollIntoView({ behavior: "smooth" });

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Ограничение по количеству запросов
    const type = modelType as "text" | "code" | "image";
    const isPromo = JSON.parse(localStorage.getItem("isPromoUser") || "false");
    // Промокод-юзер
    if (!isPromo) {
      const { ok, retryAfter } = isAllowed(type);
      // console.log(`[ChatWindow] isAllowed("${type}") →`, { ok, retryAfter });
      if (!ok) {
        const when = retryAfter!.toLocaleString();
        // получаем перевод типа:
        const typeLabel = localizationService.get(type);
        // формируем сообщения
        const msg1 = localizationService.get("LimitReached", { type: typeLabel });
        const msg2 = localizationService.get("NextAllowedAt", { when });
        dispatch(showNotification(`${msg1} ${msg2}`, "error", 10));
        return;
      }
    }

    try {
      await createQuestion({
        categoryId,
        prompt: input.trim(),
        model: selectedModel,
        model_type: modelType,
        category_id: categoryId,
        language: localizationService.getCurrentLanguage(),
      }).unwrap();
      dispatch(showNotification(localizationService.get("QuestionSent"), "success", 2));
      mark(type); // отмечаем использование
      setInput("");
      refetch();
    } catch {
      dispatch(showNotification(localizationService.get("ErrorSendingQuestion"), "error", 3));
    }
  };

  // 2) ЕСЛИ залогинены, но осталась демо-рубрика, как будто ничего не выбрано
  if (session.data && isDemo) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-600">
        {localizationService.get("SelectCategory")}
      </div>
    );
  }

  // 3) обычные loading/error только для реального чата
  if (!isDemo && (isLoading || isFetching || isSending)) {
    return <ChatSkeleton />;
  }
  if (!isDemo && error) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-500 p-4">
        {localizationService.get("ErrorLoadingMessages")}
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Заголовок рубрики + кнопка Audio Settings */}
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-2xl font-bold">{categoryName}</h2>
        <button
          className="px-3 py-1  bg-gray-500 text-white rounded hover:bg-blue-600"
          onClick={() => setAudioModalOpen(true)}
        >
          🔊 {localizationService.get("AudioSettings")}
        </button>
      </div>
      {/* Audio Settings Modal */}
      {audioModalOpen && (
        <ModalAudio
          title={localizationService.get("AudioSettings")}
          onClose={() => setAudioModalOpen(false)}
        >
          <SoundVolume />
        </ModalAudio>
      )}
      {/* Состояния загрузки / ошибки */}
      {isLoading || isFetching || isSending ? (
        <ChatSkeleton />
      ) : error ? (
        <div className="flex-1 flex items-center justify-center text-red-500 p-4">
          Error loading messages.
        </div>
      ) : (
        <div className="relative flex-1 overflow-hidden">
          <button
            onClick={scrollToBottom}
            className="absolute top-2 right-4 z-10 hover:bg-gray-300 rounded-full p-1 shadow"
            title="Go to latest message"
          >
            ▼
          </button>

          <div
            className="flex flex-col h-full overflow-y-auto p-4 space-y-4"
            onScroll={handleScroll}
          >
            <div ref={topRef} />
            {messagesToShow.map((msg: Message) => (
              <div key={msg.id} className="space-y-1">
                <div className="ml-4 text-gray-400">{msg.prompt}</div>
                {msg.answers.map(ans =>
                  // // матчим по расширению или по internal-Next URL или по внешнему http
                  /\.(png|jpe?g|gif)$/i.test(ans.content) ? (
                    //  ||
                    // ans.content.startsWith("http") ||
                    // ans.content.startsWith("/_next/image")
                    <ImageOutput key={ans.id} url={ans.content} />
                  ) : (
                    <div
                      key={ans.id}
                      className="mt-2 ml-8 bg-gray-800 text-white border border-gray-700 rounded-md p-3 flex justify-between items-start"
                    >
                      <div className="whitespace-pre-wrap text-gray-100 flex-1">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            ul: props => <ul className="list-disc pl-5" {...props} />,
                            ol: props => <ol className="list-decimal pl-5" {...props} />,
                            li: props => <li className="my-1" {...props} />,
                          }}
                        >
                          {ans.content}
                        </ReactMarkdown>
                      </div>
                      <button
                        onClick={() => speakText(ans.id, ans.content)}
                        className="ml-2 text-xl"
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
            title="Go to first message"
          >
            ▲
          </button>
        </div>
      )}

      {/* Форма ввода + кнопка голосового ввода */}
      {!isDemo && (
        <form onSubmit={send} className="flex items-center border-t bg-white p-4">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Your question..."
            className="flex-1 border rounded-l px-3 py-2 text-gray-700 focus:outline-none"
            disabled={isSending}
          />
          <button
            type="button"
            onClick={startListening}
            className="ml-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            title="Voice input"
          >
            🎤
          </button>
          <button
            ref={sendButtonRef}
            type="submit"
            className="ml-2 px-4 py-2 bg-green-500 text-white rounded-r hover:bg-green-600 disabled:opacity-50"
            disabled={isSending}
          >
            {isSending ? "Sending…" : "Send"}
          </button>
        </form>
      )}
    </div>
  );
};
