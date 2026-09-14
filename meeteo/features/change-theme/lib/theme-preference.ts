import { isTheme, type Theme } from "../model/theme";

const STORAGE_KEY = "meeteo:theme";

export function getStoredTheme(): Theme {
  try {
    const storedTheme = localStorage.getItem(STORAGE_KEY);

    return isTheme(storedTheme) ? storedTheme : "system";
  } catch {
    return "system";
  }
}

export function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // La aplicación continúa aunque localStorage no esté disponible.
  }
}

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
}