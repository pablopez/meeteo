import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";

import { en } from "./resources/en";
import { es } from "./resources/es";

export const i18n = createInstance();

void i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    es: {
      translation: es,
    },
  },

  lng: "en",
  fallbackLng: "en",
  supportedLngs: ["en", "es"],

  interpolation: {
    escapeValue: false,
  },

  react: {
    useSuspense: false,
  },
});