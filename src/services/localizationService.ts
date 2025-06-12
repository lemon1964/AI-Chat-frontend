// frontend/src/services/localizationService.ts
import enTranslations from "../locales/en.json";
import ruTranslations from "../locales/ru.json";
import { audioService } from "./audioService";

type Translations = { [key: string]: string };

class LocalizationService {
  private translations: Record<string, Translations> = {};
  private currentLanguage: string = "ru";
  // private currentLanguage: string = "en";

  constructor() {
    this.loadTranslations();
  }

  private loadTranslations() {
    this.translations["en"] = enTranslations;
    this.translations["ru"] = ruTranslations;
  }

  setLanguage(language: string) {
    this.currentLanguage = language;
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  get(key: string, params?: Record<string, string>): string {
    const translation = this.translations[this.currentLanguage]?.[key] || key;
    if (params) {
      return Object.keys(params).reduce(
        (str, param) => str.replace(`{${param}}`, params[param]),
        translation
      );
    }
    return translation;
  }

  setLanguageAndSync(language: string) {
    this.setLanguage(language);
    audioService.setSpeechLanguage(language === "ru" ? "ru-RU" : "en-US");
  }
}

export const localizationService = new LocalizationService();
