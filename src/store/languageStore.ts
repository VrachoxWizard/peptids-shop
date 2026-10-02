import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "hr" | "en";

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: "hr",
      setLanguage: (language) => set({ language }),
      toggleLanguage: () =>
        set((state) => ({ language: state.language === "hr" ? "en" : "hr" })),
    }),
    {
      name: "peptidelab-language",
    }
  )
);
