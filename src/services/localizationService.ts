// src/services/localizationService.ts
import enTranslations from "../locales/en.json";
import ruTranslations from "../locales/ru.json";
import store from "@/store/store";

type Translations = { [key: string]: string };

class LocalizationService {
  private translations: Record<string, Translations> = {};

  constructor() {
    this.loadTranslations();
  }

  private loadTranslations() {
    this.translations["en"] = enTranslations;
    this.translations["ru"] = ruTranslations;
  }

  getCurrentLanguage(): string {
    return store.getState().language.current;
  }

  get(key: string, params?: Record<string, string>): string {
    const currentLanguage = this.getCurrentLanguage();
    const translation = this.translations[currentLanguage]?.[key] || key;
    if (params) {
      return Object.keys(params).reduce(
        (str, param) => str.replace(`{${param}}`, params[param]),
        translation
      );
    }
    return translation;
  }
}

export const localizationService = new LocalizationService();