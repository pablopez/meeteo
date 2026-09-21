export const languages = ["en", "es"] as const;

export type Language = (typeof languages)[number];

export function isLanguage(
  value: string | null | undefined,
): value is Language {
  return languages.some((language) => language === value);
}