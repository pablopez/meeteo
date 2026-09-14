import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { I18nProvider } from "@/app/providers/i18n-provider";
import { LanguageSwitcher } from "@/features/change-language";

function renderWithProvider(ui: React.ReactElement) {
  return render(<I18nProvider>{ui}</I18nProvider>);
}

describe("LanguageSwitcher", () => {
  it("changes and persists the selected language", async () => {
    const user = userEvent.setup();

    renderWithProvider(<LanguageSwitcher />);

    const selector = screen.getByRole("combobox", {
      name: "Language",
    });

    await user.selectOptions(selector, "es");

    expect(
      await screen.findByRole("combobox", {
        name: "Idioma",
      }),
    ).toHaveValue("es");

    expect(window.localStorage.getItem("meeteo:language")).toBe("es");
    expect(document.documentElement).toHaveAttribute("lang", "es");
  });

  it("restores the stored language", async () => {
    window.localStorage.setItem("meeteo:language", "es");

    renderWithProvider(<LanguageSwitcher />);

    expect(
      await screen.findByRole("combobox", {
        name: "Idioma",
      }),
    ).toHaveValue("es");
  });
});