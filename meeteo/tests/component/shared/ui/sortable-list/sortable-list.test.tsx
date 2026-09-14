import { render, screen } from "@testing-library/react";

import { SortableList } from "@/shared/ui";

type Item = {
  id: string;
  name: string;
};

const items: Item[] = [
  { id: "a", name: "Alpha" },
  { id: "b", name: "Bravo" },
  { id: "c", name: "Charlie" },
];

function renderList(
  props: Partial<React.ComponentProps<typeof SortableList<Item>>> = {},
) {
  const onReorder = jest.fn();
  const onRemove = jest.fn();

  render(
    <SortableList
      items={items}
      getItemId={(item) => item.id}
      renderItem={(item, { onRemove: handleRemove }) => (
        <div>
          <span>{item.name}</span>
          <button
            type="button"
            onClick={handleRemove}
          >
            Remove
          </button>
        </div>
      )}
      onReorder={onReorder}
      onRemove={onRemove}
      add={() => {}}
      {...props}
    />,
  );

  return { onReorder, onRemove };
}

describe("SortableList", () => {
  it("renders all items", () => {
    renderList();

    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Bravo")).toBeInTheDocument();
    expect(screen.getByText("Charlie")).toBeInTheDocument();
  });

  it("calls onRemove when remove is triggered", () => {
    const { onRemove } = renderList();

    screen.getAllByRole("button", { name: "Remove" })[1].click();

    expect(onRemove).toHaveBeenCalledWith(items[1]);
  });
});
