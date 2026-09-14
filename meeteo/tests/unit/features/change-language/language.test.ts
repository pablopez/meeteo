import { isLanguage } from "@/features/change-language/model/language";

describe("isLanguage", () => {
  it.each(["en", "es"])(
    "accepts the supported language %s",
    (language) => {
      expect(isLanguage(language)).toBe(true);
    },
  );

  it.each(["fr", "de", "", null, undefined])(
    "rejects the unsupported language %s",
    (language) => {
      expect(isLanguage(language)).toBe(false);
    },
  );
});