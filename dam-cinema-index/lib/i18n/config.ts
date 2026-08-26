import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import es from "./locales/es.json";
import de from "./locales/de.json";
import ja from "./locales/ja.json";
import ko from "./locales/ko.json";
import hi from "./locales/hi.json";
import zh from "./locales/zh.json";
import it from "./locales/it.json";
import pt from "./locales/pt.json";
import ru from "./locales/ru.json";
import ar from "./locales/ar.json";

const savedLang = localStorage.getItem("language") || "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr },
    es: { translation: es },
    de: { translation: de },
    ja: { translation: ja },
    ko: { translation: ko },
    hi: { translation: hi },
    zh: { translation: zh },
    it: { translation: it },
    pt: { translation: pt },
    ru: { translation: ru },
    ar: { translation: ar },
  },
  lng: savedLang,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  returnObjects: true,
});

export const LANGUAGE_MAP: Record<string, string> = {
  en: "en-US",
  fr: "fr-FR",
  es: "es-ES",
  ja: "ja-JP",
  ko: "ko-KR",
  hi: "hi-IN",
  zh: "zh-CN",
  de: "de-DE",
  it: "it-IT",
  pt: "pt-PT",
  ru: "ru-RU",
  ar: "ar-SA",
};

export function getTmdbLanguage(): string {
  const lang = localStorage.getItem("language") || "en";
  return LANGUAGE_MAP[lang] || "en-US";
}

export default i18n;
