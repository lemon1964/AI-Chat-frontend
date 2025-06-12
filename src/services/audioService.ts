// frontend/src/services/audioService.ts
import { Howl } from "howler";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

class AudioService {
  private musicVolume: number;
  private speechVolume: number;
  private currentLanguage: string;

  // private sounds: Record<string, Howl>;
  private music: Howl | null;

  constructor() {
    this.musicVolume = 0.5; // от 0 до 1
    this.speechVolume = 1; // от 0 до 1
    this.currentLanguage = "ru-RU"; // Язык по умолчанию
    // this.currentLanguage = "en-US"; // Язык по умолчанию

    this.music = null;
  }

  // Воспроизведение музыки
  playMusic(path: string): void {
    const isAbsolute = path.startsWith("http") || path.startsWith("/music");
    const src = isAbsolute ? path : `${BASE_URL}${path}`;

    if (this.music) {
      this.music.stop();
    }

    this.music = new Howl({ src: [src], loop: true, volume: this.musicVolume });
    this.music.play();
  }

  stopMusic(): void {
    if (this.music) {
      this.music.stop();
      this.music = null;
    }
  }

  getMusicVolume(): number {
    return this.musicVolume;
  }

  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(volume, 1));
    if (this.music) {
      this.music.volume(this.musicVolume);
    }
  }

  // Методы управления речью
  speak(text: string): void {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.currentLanguage;
    utterance.volume = this.speechVolume;
    speechSynthesis.speak(utterance);
  }

  setSpeechLanguage(language: string): void {
    this.currentLanguage = language;
  }

  getSpeechVolume(): number {
    return this.speechVolume;
  }

  setSpeechVolume(volume: number): void {
    this.speechVolume = Math.max(0, Math.min(volume, 1));
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

}

export const audioService = new AudioService();
