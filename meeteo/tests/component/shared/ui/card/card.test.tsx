import { render, screen } from "@testing-library/react";

import { Card } from "@/shared/ui";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Card content</Card>);

    expect(
      screen.getByText("Card content"),
    ).toBeInTheDocument();
  });

  it("applies the base container styles", () => {
    const { container } = render(<Card>Content</Card>);

    expect(container.firstChild).toHaveClass(
      "rounded-2xl",
      "bg-transparent",
      "overflow-hidden",
    );
    expect(container.firstChild).not.toHaveClass(
      "border",
      "border-border",
      "bg-surface/60",
      "backdrop-blur-md",
    );
  });

  it("merges custom className", () => {
    const { container } = render(
      <Card className="custom-class p-4">Content</Card>,
    );

    expect(container.firstChild).toHaveClass("custom-class");
    expect(container.firstChild).toHaveClass("p-4");
    expect(container.firstChild).toHaveClass("rounded-2xl");
  });

  it("forwards HTML attributes", () => {
    render(
      <Card data-testid="card-test" aria-label="Metric card">
        Content
      </Card>,
    );

    const card = screen.getByTestId("card-test");

    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute("aria-label", "Metric card");
  });
});
