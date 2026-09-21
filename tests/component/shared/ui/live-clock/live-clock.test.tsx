import { render, screen } from "@testing-library/react";

import { LiveClock } from "@/shared/ui";

describe("LiveClock", () => {
  it("renders a 24-hour time with seconds and its timezone", () => {
    render(
      <LiveClock
        time="21:00:01"
        timezone="Asia/Tokyo"
        separatorVisible
      />,
    );

    expect(screen.getByText("Asia/Tokyo")).toBeInTheDocument();
    expect(
      screen.getByLabelText("21:00:01, Asia/Tokyo"),
    ).toBeInTheDocument();
    expect(screen.queryByText(/PM/)).not.toBeInTheDocument();
  });

  it("hides only the first time separator while blinking", () => {
    const { container } = render(
      <LiveClock
        time="21:30:45"
        timezone="Europe/Madrid"
        separatorVisible={false}
      />,
    );

    expect(container.querySelector("strong")).toHaveTextContent(
      "21:30:45",
    );
    expect(container.querySelector("strong span")).toHaveClass(
      "opacity-0",
    );
  });
});
