"use client";

import { type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { Select } from "@/shared/ui";

import { saveLanguage } from "../lib/language-preference";
import { isLanguage } from "../model/language";

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();

  const resolvedLanguage =
    i18n.resolvedLanguage?.split("-")[0] ??
    i18n.language?.split("-")[0];

  const currentLanguage = isLanguage(resolvedLanguage)
    ? resolvedLanguage
    : "en";

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const selectedLanguage = event.target.value;

    if (!isLanguage(selectedLanguage)) {
      return;
    }

    saveLanguage(selectedLanguage);
    document.documentElement.lang = selectedLanguage;
    void i18n.changeLanguage(selectedLanguage);
  }

  return (
    <Select
  id="language-switcher"
  label={t("language.label")}
  icon="language"
  orientation="vertical"
  fullWidth
  value={currentLanguage}
  onChange={handleChange}
  options={[
    {
      value: "en",
      label: t("language.english"),
    },
    {
      value: "es",
      label: t("language.spanish"),
    },
  ]}
/>
  );
}