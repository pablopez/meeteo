import { render, screen } from "@testing-library/react";

import { Panel } from "@/shared/ui";

describe("Panel", () => {
  it("renders children", () => {
    render(<Panel>Panel content</Panel>);

    expect(
      screen.getByText("Panel content"),
    ).toBeInTheDocument();
  });

  it("renders as a section element", () => {
    const { container } = render(<Panel>Content</Panel>);

    expect(container.firstChild?.nodeName).toBe("SECTION");
  });

  it("applies the base container styles", () => {
    const { container } = render(<Panel>Content</Panel>);

    expect(container.firstChild).toHaveClass(
      "rounded-xl",
      "border",
      "border-border",
      "bg-surface/40",
      "backdrop-blur-lg",
      "p-6",
      "sm:p-8",
    );
  });

  it("merges custom className", () => {
    const { container } = render(
      <Panel className="relative z-10">Content</Panel>,
    );

    expect(container.firstChild).toHaveClass("relative");
    expect(container.firstChild).toHaveClass("z-10");
    expect(container.firstChild).toHaveClass("rounded-xl");
  });

  it("forwards HTML attributes", () => {
    render(
      <Panel aria-label="Overview panel" data-testid="panel-test">
        Content
      </Panel>,
    );

    const panel = screen.getByTestId("panel-test");

    expect(panel).toBeInTheDocument();
    expect(panel).toHaveAttribute(
      "aria-label",
      "Overview panel",
    );
  });
});
