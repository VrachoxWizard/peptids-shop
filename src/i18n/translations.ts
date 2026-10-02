import { hr } from "./locales/hr";
import { en } from "./locales/en";

export const translations = {
  hr,
  en,
} as const;

export type TranslationKeys = typeof translations.hr;
