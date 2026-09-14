import { isTheme } from "@/features/change-theme/model/theme";

describe("isTheme", () => {
  it.each(["system", "light", "dark"])(
    "accepts '%s' as a valid theme",
    (theme) => {
      expect(isTheme(theme)).toBe(true);
    },
  );

  it.each([null, "", "blue", "automatic"])(
    "rejects '%s' as an invalid theme",
    (theme) => {
      expect(isTheme(theme)).toBe(false);
    },
  );
});