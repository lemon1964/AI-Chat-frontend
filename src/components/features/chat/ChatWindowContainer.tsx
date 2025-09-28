// src/components/features/chat/ChatWindowContainer.tsx
import { FC, useState, useRef, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSession } from "next-auth/react";
import { RootState, AppDispatch } from "@/store/store";
import { useGetQuestionsQuery, useCreateQuestionMutation } from "@/services/chatApi";
import { showNotification } from "@/reducers/notificationReducer";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useModels } from "@/hooks/useModels";
import { useRateLimit } from "@/hooks/useRateLimit";
import { demoCategoryIds, demoMessages } from "@/data/demoChat";
import { localizationService } from "@/services/localizationService";
import { ChatWindowView } from "./ChatWindowViews/ChatWindowView";

const ChatWindowContainer: FC<ChatWindowProps> = ({ categoryId, categoryName }) => {
  const dispatch = useDispatch<AppDispatch>();
  const session = useSession();
  const isDemoCategory = demoCategoryIds.includes(categoryId);
  const isDemo = isDemoCategory;
  const {
    data: messages,
    isLoading,
    isFetching,
    refetch,
    error,
  } = useGetQuestionsQuery(categoryId, {
    skip: isDemoCategory,
    refetchOnMountOrArgChange: true,
  });
  const { modelType, selectedModel } = useSelector((state: RootState) => state.model);
  const { refetchModels, isLoadingModels } = useModels();
  const [audioModalOpen, setAudioModalOpen] = useState(false);
  const [createQuestion, { isLoading: isSending }] = useCreateQuestionMutation();
  const [input, setInput] = useState("");
  const sendButtonRef = useRef<HTMLButtonElement>(null);
  const { speakingId, speakText } = useTextToSpeech();
  const startListening = useSpeechRecognition(transcript => {
    setInput(transcript);
    sendButtonRef.current?.focus();
  });
  const topRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);

  const flags = useSelector((s: RootState) => s.flags);
  const isReady = flags.loaded;
  const rl = useRateLimit(flags.limits || undefined);
  // const { isAllowed, mark } = useRateLimit();

  const messagesToShow = useMemo<Message[]>(() => {
    if (isDemo) {
      return demoMessages[categoryId] || [];
    }
    return messages ? [...messages].reverse() : [];
  }, [isDemo, categoryId, messages]);

  // Эффект для прокрутки
  useEffect(() => {
    if (messagesToShow.length > 0 && shouldScrollToBottom) {
      const timer = setTimeout(() => {
        bottomRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [messagesToShow, shouldScrollToBottom]);

  // При смене категории
  useEffect(() => {
    setShouldScrollToBottom(false);
    const timer = setTimeout(() => setShouldScrollToBottom(true), 1000);
    return () => clearTimeout(timer);
  }, [categoryId]);

  const scrollToTop = () => topRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToBottom = () => bottomRef.current?.scrollIntoView({ behavior: "smooth" });

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    setShouldScrollToBottom(true); // Гарантируем скролл после отправки
    if (!input.trim()) return;
    if (isLoadingModels) {
      dispatch(showNotification("Models are updating, please wait", "info", 5));
      return;
    }
    const type = modelType as "text" | "code" | "image";
    const isPromo = JSON.parse(localStorage.getItem("isPromoUser") || "false");
    if (!isPromo) {
      const { ok, retryAfter } = rl.isAllowed(type);
      // if (process.env.NODE_ENV !== "production") {
      //   console.log("[mermind] check diagram:", { ok, retryAfter });
      // }
      if (!ok) {
        const when = retryAfter!.toLocaleString();
        const typeLabel = localizationService.get(type);
        const msg1 = localizationService.get("LimitReached", { type: typeLabel });
        const msg2 = localizationService.get("NextAllowedAt", { when });
        const msg3 = localizationService.get("PayForSubscription");
        dispatch(showNotification(`${msg1} ${msg2} ${msg3}`, "error", 5));
        return;
      }
    }
    try {
      const response = await createQuestion({
        categoryId,
        prompt: input.trim(),
        model: selectedModel,
        model_type: modelType,
        category_id: categoryId,
        language: localizationService.getCurrentLanguage(),
      }).unwrap();
      // Прокрутка вниз
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      await refetch();
      // Проверяем подмену модели только если ответ содержит эту информацию
      if (response.actual_model && response.actual_model !== selectedModel) {
        // Обновляем список моделей
        await refetchModels();
        // Форматируем название моделей для уведомления
        const otherModel = response.actual_model.split("/")[0].split("-")[0];
        const unavailableModel = selectedModel.split("/")[0].split("-")[0];
        dispatch(
          showNotification(
            `
          ${localizationService.get("Model")} 
          ${unavailableModel} 
          ${localizationService.get("isNoLongervAvailable")}
          ${otherModel} 
          ${localizationService.get("respondedInstead")}
          `,
            "info",
            5
          )
        );
      } else {
        dispatch(showNotification(localizationService.get("QuestionSent"), "success", 2));
      }
      rl.mark(type);
      // mark(type);
      setInput("");
    } catch {
      dispatch(showNotification(localizationService.get("ErrorSendingQuestion"), "error", 3));
    }
  };

  if (session.data && isDemo) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-600">
        {localizationService.get("SelectCategory")}
      </div>
    );
  }

  return (
    <ChatWindowView
      key={categoryId}
      categoryName={categoryName}
      messagesToShow={messagesToShow}
      isLoading={isLoading}
      isFetching={isFetching}
      isSending={isSending}
      error={error}
      input={input}
      setInput={setInput}
      send={send}
      isDemo={isDemo}
      speakingId={speakingId}
      speakText={speakText}
      startListening={startListening}
      sendButtonRef={sendButtonRef}
      audioModalOpen={audioModalOpen}
      setAudioModalOpen={setAudioModalOpen}
      scrollToTop={scrollToTop}
      scrollToBottom={scrollToBottom}
      topRef={topRef}
      bottomRef={bottomRef}
      isReady={isReady}
    />
  );
};

export default ChatWindowContainer;
