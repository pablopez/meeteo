import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MenuToggleButton } from "@/shared/ui";

describe("MenuToggleButton", () => {
  it("renders an accessible toggle button with the open label when closed", () => {
    render(
      <MenuToggleButton
        isOpen={false}
        openLabel="Open menu"
        closeLabel="Close menu"
        controls="app-menu-panel"
      />,
    );

    const button = screen.getByRole("button", {
      name: "Open menu",
    });

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveAttribute("aria-controls", "app-menu-panel");
    expect(button.querySelector("svg")).toBeInTheDocument();
  });

  it("switches to the close label and expanded state when open", () => {
    render(
      <MenuToggleButton
        isOpen
        openLabel="Open menu"
        closeLabel="Close menu"
        controls="app-menu-panel"
      />,
    );

    const button = screen.getByRole("button", {
      name: "Close menu",
    });

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-expanded", "true");
  });

  it("executes the click handler", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <MenuToggleButton
        isOpen={false}
        openLabel="Open menu"
        closeLabel="Close menu"
        controls="app-menu-panel"
        onClick={handleClick}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: "Open menu" }),
    );

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
