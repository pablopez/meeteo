"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { saveLanguage } from "../lib/language-preference";
import { isLanguage, languages, type Language } from "../model/language";
import { Panel } from "@/shared/ui";

const LANGUAGE_META: Record<
  Language,
  { label: string; flag: string }
> = {
  en: { label: "English", flag: "🇬🇧" },
  es: { label: "Español", flag: "🇪🇸" },
};

export function LanguagePanel() {
  const { t, i18n } = useTranslation();

  const resolvedLanguage =
    i18n.resolvedLanguage?.split("-")[0] ??
    i18n.language?.split("-")[0];

  const currentLanguage = isLanguage(resolvedLanguage)
    ? resolvedLanguage
    : "en";

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  function handleSelect(language: Language) {
    saveLanguage(language);
    void i18n.changeLanguage(language);
  }

  return (
    <Panel aria-label={t("language.label")}>
      <h3 className="mb-3 text-sm font-medium">
        {t("language.label")}
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {languages.map((language) => (
          <button
            key={language}
            type="button"
            onClick={() => handleSelect(language)}
            aria-pressed={currentLanguage === language}
            className={[
              "flex items-center gap-3 rounded-xl border border-white/20 p-3 backdrop-blur-md transition-colors",
              currentLanguage === language
                ? "bg-white/30 text-white"
                : "bg-white/10 text-white hover:bg-white/20",
            ].join(" ")}
          >
            <span
              className="text-2xl"
              aria-hidden="true"
            >
              {LANGUAGE_META[language].flag}
            </span>

            <span className="font-medium">
              {LANGUAGE_META[language].label}
            </span>
          </button>
        ))}
      </div>
    </Panel>
  );
}
