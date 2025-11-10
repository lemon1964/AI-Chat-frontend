// src/components/features/chat/ChatWindowViews/ChatInputForm.tsx
import { useRef } from "react";
import { localizationService } from "@/services/localizationService";

interface ChatInputFormProps {
  input: string;
  setInput: (value: string) => void;
  send: (e: React.FormEvent) => void;
  isSending: boolean;
  startListening: () => void;
  sendButtonRef: React.RefObject<HTMLButtonElement | null>;
  isReady: boolean;
}

export const ChatInputForm = ({
  input,
  setInput,
  send,
  isSending,
  startListening,
  sendButtonRef,
  isReady
}: ChatInputFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  return (
    <form 
      ref={formRef}
      onSubmit={send} 
      className="flex items-center border-t bg-white p-4"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={localizationService.get("Your question...")}
        className="flex-1 border bg-white rounded-l px-3 py-2 text-gray-700 focus:outline-none"
        disabled={isSending}
      />
      
      <button
        type="button"
        onClick={startListening}
        className="ml-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        title="Voice input"
        disabled={isSending}
      >
        🎤
      </button>
      
      <button
        ref={sendButtonRef}
        type="submit"
        className="ml-2 px-4 py-2 bg-green-500 text-white rounded-r hover:bg-green-600 disabled:opacity-50"
        disabled={isSending || !input.trim() || !isReady}
      >
        {isSending ? "Sending…" : "Send"}
      </button>
    </form>
  );
};
