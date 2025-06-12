// src/utils/useSpeechRecognition.ts
import { useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { showNotification } from "@/reducers/notificationReducer";
import { AppDispatch } from "@/store/store";
import { localizationService } from "@/services/localizationService";

/**
 * Хук для работы с Web Speech API (SpeechRecognition).
 * Возвращает функцию startListening, которую можно вызывать при клике на кнопку «🎤».
 */
export function useSpeechRecognition(onTranscript: (text: string) => void) {
  const dispatch = useDispatch<AppDispatch>();
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  const startListening = useCallback(() => {
    // Если уже есть экземпляр — не создаём новый
    if (recognitionRef.current) return;

    const SpeechRecognitionConstructor =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;

    if (!SpeechRecognitionConstructor) {
      dispatch(
        showNotification(
          localizationService.get("BrowserNoSpeechSupport"),
          "error",
          3
        )
      );
      return;
    }

    const recognition: ISpeechRecognition = new SpeechRecognitionConstructor();
    const lang = localizationService.getCurrentLanguage() === "ru" ? "ru-RU" : "en-US";
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      dispatch(showNotification(localizationService.get("Listening"), "info", 3));
    };

    recognition.onerror = (event) => {
      console.error("SpeechRecognition error:", event.error);
      dispatch(
        showNotification(localizationService.get("SpeechRecognitionError"), "error", 3)
      );
      recognition.stop();
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
      recognition.stop();
    };

    recognition.onend = () => {
      recognitionRef.current = null;
    };

    recognition.start();
    recognitionRef.current = recognition;
  }, [dispatch, onTranscript]);

  return startListening;
}
