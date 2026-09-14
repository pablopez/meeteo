import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Select } from "@/shared/ui";

describe("Select", () => {
  it("renders its options", () => {
    render(
      <Select
        label="Language"
        defaultValue="en"
        options={[
          { value: "en", label: "English" },
          { value: "es", label: "Spanish" },
        ]}
      />,
    );

    expect(
      screen.getByRole("option", {
        name: "English",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("option", {
        name: "Spanish",
      }),
    ).toBeInTheDocument();
  });

  it("notifies when its value changes", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(
      <Select
        label="Language"
        defaultValue="en"
        onChange={handleChange}
        options={[
          { value: "en", label: "English" },
          { value: "es", label: "Spanish" },
        ]}
      />,
    );

    const select = screen.getByRole("combobox", {
      name: "Language",
    });

    await user.selectOptions(select, "es");

    expect(select).toHaveValue("es");
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});