"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Icon } from "@/shared/ui";

import {
  applyTheme,
  getStoredTheme,
  saveTheme,
} from "../lib/theme-preference";
import { type Theme } from "../model/theme";

export function ThemeSwitcher() {
  const { t } = useTranslation();
  const [theme, setTheme] = useState<Theme>(() =>
    getStoredTheme(),
  );

  useEffect(() => {
    applyTheme(getStoredTheme());
  }, []);

  const isDark = theme === "dark";

  function toggleTheme() {
    const nextTheme = isDark ? "light" : "dark";

    setTheme(nextTheme);
    saveTheme(nextTheme);
    applyTheme(nextTheme);
  }

  return (
    <div
      className="flex items-center gap-2"
      aria-label={t("theme.label")}
    >
      <Icon name="sun" />

      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label={
          isDark ? t("theme.dark") : t("theme.light")
        }
        onClick={toggleTheme}
        className={[
          "relative h-6 w-11 rounded-full transition-colors duration-200 ease-in-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          isDark
            ? "bg-slate-700"
            : "bg-gray-400",
        ].join(" ")}
      >
        <span
          className={[
            "absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white transition-transform duration-200 ease-in-out",
            isDark ? "translate-x-5" : "translate-x-0",
          ].join(" ")}
        />
      </button>

      <Icon name="moon" />
    </div>
  );
}
