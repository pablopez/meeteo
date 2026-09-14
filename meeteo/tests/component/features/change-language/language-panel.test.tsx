import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { I18nProvider } from "@/app/providers/i18n-provider";
import { LanguagePanel } from "@/features/change-language";

function renderWithProvider(ui: React.ReactElement) {
  return render(<I18nProvider>{ui}</I18nProvider>);
}

describe("LanguagePanel", () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.lang = "en";
  });

  it("renders available languages", async () => {
    renderWithProvider(<LanguagePanel />);

    expect(
      screen.getByRole("button", { name: "English" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Español" }),
    ).toBeInTheDocument();
  });

  it("marks the current language as active", async () => {
    renderWithProvider(<LanguagePanel />);

    expect(
      screen.getByRole("button", { name: "English" }),
    ).toHaveAttribute("aria-pressed", "true");

    expect(
      screen.getByRole("button", { name: "Español" }),
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("changes language when an option is selected", async () => {
    const user = userEvent.setup();

    renderWithProvider(<LanguagePanel />);

    await user.click(
      screen.getByRole("button", { name: "Español" }),
    );

    expect(
      screen.getByRole("button", { name: "Español" }),
    ).toHaveAttribute("aria-pressed", "true");

    expect(
      screen.getByRole("button", { name: "English" }),
    ).toHaveAttribute("aria-pressed", "false");

    expect(window.localStorage.getItem("meeteo:language")).toBe("es");
    expect(document.documentElement.lang).toBe("es");
  });
});
