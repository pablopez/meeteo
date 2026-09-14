import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ThemeSwitcher } from "@/features/change-theme";

describe("ThemeSwitcher", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("changes the document theme to dark", async () => {
    const user = userEvent.setup();

    render(<ThemeSwitcher />);

    const switchControl = screen.getByRole("switch");

    expect(switchControl).toHaveAttribute(
      "aria-checked",
      "false",
    );

    await user.click(switchControl);

    expect(switchControl).toHaveAttribute(
      "aria-checked",
      "true",
    );

    expect(document.documentElement).toHaveAttribute(
      "data-theme",
      "dark",
    );
  });

  it("restores the saved theme when mounted again", async () => {
    localStorage.setItem("meeteo:theme", "dark");

    render(<ThemeSwitcher />);

    await waitFor(() => {
      expect(screen.getByRole("switch")).toHaveAttribute(
        "aria-checked",
        "true",
      );
    });

    expect(document.documentElement).toHaveAttribute(
      "data-theme",
      "dark",
    );
  });

  it("toggles back to light", async () => {
    const user = userEvent.setup();

    localStorage.setItem("meeteo:theme", "dark");

    render(<ThemeSwitcher />);

    const switchControl = await screen.findByRole(
      "switch",
    );

    await user.click(switchControl);

    expect(switchControl).toHaveAttribute(
      "aria-checked",
      "false",
    );

    expect(document.documentElement).toHaveAttribute(
      "data-theme",
      "light",
    );
  });
});
