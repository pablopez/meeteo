import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Carousel } from "@/shared/ui";

type Item = {
  id: string;
  label: string;
};

const items: Item[] = [
  { id: "a", label: "First" },
  { id: "b", label: "Second" },
  { id: "c", label: "Third" },
];

function renderCarousel(
  props: Partial<React.ComponentProps<typeof Carousel<Item>>> = {},
) {
  const onChange = jest.fn();

  render(
    <Carousel
      items={items}
      getItemId={(item) => item.id}
      renderItem={(item) => <div>{item.label}</div>}
      onChange={onChange}
      {...props}
    />,
  );

  return { onChange };
}

describe("Carousel", () => {
  it("renders all items", () => {
    renderCarousel();

    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
    expect(screen.getByText("Third")).toBeInTheDocument();
  });

  it("renders navigation dots", () => {
    renderCarousel();

    const dots = screen.getAllByRole("tab");

    expect(dots).toHaveLength(3);
  });

  it("renders line pagination", () => {
    renderCarousel({ paginationVariant: "lines" });

    expect(screen.getAllByRole("tab")[0]).toHaveClass(
      "h-1.5",
      "w-6",
    );
  });

  it("hides pagination", () => {
    renderCarousel({ paginationVariant: "hidden" });

    expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
  });

  it("navigates to the selected dot", async () => {
    const user = userEvent.setup();
    const { onChange } = renderCarousel();

    const dots = screen.getAllByRole("tab");

    await user.click(dots[2]);

    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("navigates to the next item", async () => {
    const user = userEvent.setup();
    const { onChange } = renderCarousel();

    await user.click(
      screen.getByRole("button", { name: "Next item" }),
    );

    expect(onChange).toHaveBeenCalledWith(1);
  });

  it("navigates to the previous item", async () => {
    const user = userEvent.setup();
    const { onChange } = renderCarousel({ initialIndex: 1 });

    await user.click(
      screen.getByRole("button", { name: "Previous item" }),
    );

    expect(onChange).toHaveBeenCalledWith(0);
  });

  it("loops to the last item from the first one", async () => {
    const user = userEvent.setup();
    const { onChange } = renderCarousel();

    await user.click(
      screen.getByRole("button", { name: "Previous item" }),
    );

    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("loops to the first item from the last one", async () => {
    const user = userEvent.setup();
    const { onChange } = renderCarousel({
      initialIndex: 2,
    });

    await user.click(
      screen.getByRole("button", { name: "Next item" }),
    );

    expect(onChange).toHaveBeenCalledWith(0);
  });

  it("does not change items by dragging when swipe is disabled", () => {
    const { onChange } = renderCarousel({ swipeEnabled: false });
    const viewport = screen
      .getByText("First")
      .closest("[aria-hidden]")?.parentElement?.parentElement;

    fireEvent.pointerDown(viewport!, { clientX: 100 });
    fireEvent.pointerUp(viewport!, { clientX: 20 });

    expect(onChange).not.toHaveBeenCalled();
  });

  it("isolates pointer gestures in a nested carousel", () => {
    const parentOnChange = jest.fn();
    const childOnChange = jest.fn();

    render(
      <Carousel
        items={["parent-a", "parent-b"]}
        getItemId={(item) => item}
        onChange={parentOnChange}
        renderItem={(item) =>
          item === "parent-a" ? (
            <Carousel
              items={["Inner first", "Inner second"]}
              getItemId={(child) => child}
              onChange={childOnChange}
              renderItem={(child) => <div>{child}</div>}
            />
          ) : (
            <div>{item}</div>
          )
        }
      />,
    );

    const childViewport = screen
      .getByText("Inner first")
      .closest("[aria-hidden]")?.parentElement?.parentElement;

    expect(childViewport).not.toBeNull();

    const pointerDown = new Event("pointerdown", {
      bubbles: true,
    });
    const pointerUp = new Event("pointerup", {
      bubbles: true,
    });

    Object.defineProperty(pointerDown, "clientX", {
      value: 100,
    });
    Object.defineProperty(pointerUp, "clientX", {
      value: 20,
    });

    fireEvent(childViewport!, pointerDown);
    fireEvent(childViewport!, pointerUp);

    expect(childOnChange).toHaveBeenCalledWith(1);
    expect(parentOnChange).not.toHaveBeenCalled();
  });

  it("renders nothing when items are empty", () => {
    render(<Carousel items={[]} getItemId={(item: Item) => item.id} renderItem={(item) => <div>{item.label}</div>} />);

    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
  });
});
