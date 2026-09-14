import { isLanguage, type Language } from "../model/language";

const STORAGE_KEY = "meeteo:language";

export function getPreferredLanguage(): Language {
  if (typeof window === "undefined") {
    return "en";
  }

  try {
    const storedLanguage = window.localStorage.getItem(STORAGE_KEY);

    if (isLanguage(storedLanguage)) {
      return storedLanguage;
    }
  } catch {
    // localStorage puede estar deshabilitado.
  }

  const browserLanguage = window.navigator.language.split("-")[0];

  return isLanguage(browserLanguage) ? browserLanguage : "en";
}

export function saveLanguage(language: Language): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, language);
  } catch {
    // La aplicación seguirá funcionando sin persistencia.
  }
}