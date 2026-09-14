import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MenuSquareButton } from "@/shared/ui";

describe("MenuSquareButton", () => {
  it("renders as an accessible button with an icon", () => {
    render(
      <MenuSquareButton
        icon="search"
        label="Open search"
      />,
    );

    const button = screen.getByRole("button", {
      name: "Open search",
    });

    expect(button).toBeInTheDocument();
    expect(button.querySelector("svg")).toBeInTheDocument();
  });

  it("executes the click handler", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <MenuSquareButton
        icon="search"
        label="Open search"
        onClick={handleClick}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Open search",
      }),
    );

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("shows an active state", () => {
    render(
      <MenuSquareButton
        icon="search"
        label="Open search"
        active
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Open search",
      }),
    ).toHaveClass("ring-2");
  });

  it("renders a badge", () => {
    render(
      <MenuSquareButton
        icon="star"
        label="Favorites"
        badge={3}
      />,
    );

    expect(screen.getByText("3")).toBeInTheDocument();
  });
});
