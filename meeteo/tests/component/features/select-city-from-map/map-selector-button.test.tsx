import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { MapSelectorButton } from "@/features/select-city-from-map";

describe("MapSelectorButton", () => {
  it("renders the map toggle button", () => {
    render(<MapSelectorButton />);

    expect(
      screen.getByRole("button", {
        name: "Select a city from the map",
      }),
    ).toBeInTheDocument();
  });

  it("calls onClick when pressed", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();

    render(
      <MapSelectorButton
        active
        onClick={onClick}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Select a city from the map",
      }),
    );

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
