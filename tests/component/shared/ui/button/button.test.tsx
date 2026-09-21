import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Button } from "@/shared/ui";

describe("Button", () => {
  it("executes its click handler", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <Button
        label="Search"
        icon="search"
        onClick={handleClick}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Search",
      }),
    );

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("provides an accessible name in icon mode", () => {
    render(
      <Button
        label="Use my location"
        icon="location"
        display="icon"
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Use my location",
      }),
    ).toBeInTheDocument();
  });
});