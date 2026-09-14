import { render, screen } from "@testing-library/react";

import { Icon } from "@/shared/ui";

describe("Icon adapter", () => {
  it("renders a mapped Lucide icon by name", () => {
    render(<Icon name="search" data-testid="icon" />);

    const icon = screen.getByTestId("icon");

    expect(icon).toBeInTheDocument();
    expect(icon.tagName).toBe("svg");
  });

  it("forwards custom className", () => {
    render(
      <Icon
        name="map"
        data-testid="icon"
        className="custom-class"
      />,
    );

    expect(screen.getByTestId("icon")).toHaveClass(
      "custom-class",
    );
  });

  it("renders a filled star for star-filled", () => {
    render(
      <Icon
        name="star-filled"
        data-testid="icon"
      />,
    );

    expect(screen.getByTestId("icon")).toHaveAttribute(
      "fill",
      "currentColor",
    );
  });

  it("is hidden from assistive technologies", () => {
    render(<Icon name="trash" data-testid="icon" />);

    expect(screen.getByTestId("icon")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});
