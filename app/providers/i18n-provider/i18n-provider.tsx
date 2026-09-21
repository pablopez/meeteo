"use client";

import { useEffect, type ReactNode } from "react";
import { I18nextProvider } from "react-i18next";

import {
  getPreferredLanguage,
} from "@/features/change-language/lib/language-preference";
import { i18n } from "@/shared/config/i18n";

type I18nProviderProps = {
  children: ReactNode;
};

export function I18nProvider({ children }: I18nProviderProps) {
  useEffect(() => {
    const preferredLanguage = getPreferredLanguage();

    document.documentElement.lang = preferredLanguage;
    void i18n.changeLanguage(preferredLanguage);
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}