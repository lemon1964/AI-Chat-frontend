// src/components/features/chat/ChatWindowViews/ChatWindowView.tsx
import ChatSkeleton from "@ui/common/Preloader";
import { motion, AnimatePresence } from "framer-motion";
import { ChatMessages } from "./ChatMessages";
import { ChatInputForm } from "./ChatInputForm";
import { ChatHeader } from "./ChatHeader";
import { localizationService } from "@/services/localizationService";

interface ChatWindowViewProps {
  categoryName: string;
  messagesToShow: Message[];
  isLoading: boolean;
  isFetching: boolean;
  isSending: boolean;
  error: unknown;
  input: string;
  setInput: (value: string) => void;
  send: (e: React.FormEvent) => void;
  isDemo: boolean;
  speakingId: string | null;
  speakText: (id: string, text: string) => void;
  startListening: () => void;
  sendButtonRef: React.RefObject<HTMLButtonElement | null>;
  audioModalOpen: boolean;
  setAudioModalOpen: (value: boolean) => void;
  scrollToTop: () => void;
  scrollToBottom: () => void;
  topRef: React.RefObject<HTMLDivElement | null>;
  bottomRef: React.RefObject<HTMLDivElement | null>;
  isReady: boolean;
}

export const ChatWindowView = (props: ChatWindowViewProps) => {
  if (props.isLoading || props.isFetching || props.isSending) {
    return <ChatSkeleton />;
  }

  if (props.error) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-500 p-4">
        {localizationService.get("ErrorLoadingMessages")}
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <ChatHeader
        categoryName={props.categoryName}
        audioModalOpen={props.audioModalOpen}
        setAudioModalOpen={props.setAudioModalOpen}
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={props.categoryName}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="flex-1 min-h-0 flex flex-col"
        >
          <ChatMessages
            messages={props.messagesToShow}
            speakingId={props.speakingId}
            speakText={props.speakText}
            topRef={props.topRef}
            bottomRef={props.bottomRef}
            scrollToTop={props.scrollToTop}
            scrollToBottom={props.scrollToBottom}
          />
        </motion.div>
      </AnimatePresence>

      {!props.isDemo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChatInputForm
            input={props.input}
            setInput={props.setInput}
            send={props.send}
            isSending={props.isSending}
            startListening={props.startListening}
            sendButtonRef={props.sendButtonRef}
            isReady={props.isReady}
          />
        </motion.div>
      )}
    </div>
  );
};
