// frontend/src/hooks/useTextToSpeech.ts
import { useState, useCallback } from "react";
import { audioService } from "@/services/audioService";
import { localizationService } from "@/services/localizationService";

export function useTextToSpeech() {
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const speakText = useCallback(
    (id: string, content: string) => {
      const synth = window.speechSynthesis;
      const volume = audioService.getSpeechVolume();
      if (!("speechSynthesis" in window) || volume <= 0) return;

      const voices = synth.getVoices();
      if (!voices.length) {
        // если голоса ещё не загружены
        synth.onvoiceschanged = () => speakText(id, content);
        return;
      }

      // если уже читаем этот же id — останавливаем
      if (speakingId === id) {
        synth.cancel();
        setSpeakingId(null);
        return;
      }
      // останавливаем предыдущее
      synth.cancel();

      // настраиваем язык и громкость
      const langCode = localizationService.getCurrentLanguage() === "ru" ? "ru-RU" : "en-US";
      audioService.setSpeechLanguage(langCode);
      audioService.setSpeechVolume(volume);

      const utter = new SpeechSynthesisUtterance(content);
      utter.lang = langCode;
      utter.volume = volume;
      utter.onstart = () => setSpeakingId(id);
      utter.onend   = () => setSpeakingId(null);

      synth.speak(utter);
    },
    [speakingId]
  );

  return { speakingId, speakText };
}
