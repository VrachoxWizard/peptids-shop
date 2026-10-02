import { useLanguageStore } from "../store/languageStore";
import { translations } from "./translations";

export function useTranslation() {
  const { language, setLanguage, toggleLanguage } = useLanguageStore();
  const t = translations[language] || translations.hr;
  return { t, language, setLanguage, toggleLanguage };
}
