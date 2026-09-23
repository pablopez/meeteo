"use client";

import {
  useCallback,
  useState,
} from "react";

import { Icon } from "../icon";

type SortableListItemActions = {
  onRemove: () => void;
};

type SortableListProps<T> = {
  items: readonly T[];
  getItemId: (item: T) => string;
  renderItem: (
    item: T,
    actions: SortableListItemActions,
  ) => React.ReactNode;
  onReorder: (items: T[]) => void;
  onRemove?: (item: T) => void;
  add?: (item: T) => void;
  renderLeftAccessory?: (
    item: T,
    index: number,
  ) => React.ReactNode;
  showDragHandle?: boolean;
  "aria-label"?: string;
  itemClassName?: string;
};

export type {
  SortableListItemActions,
  SortableListProps,
};

export function SortableList<T>({
  items,
  getItemId,
  renderItem,
  onReorder,
  onRemove,
  renderLeftAccessory,
  showDragHandle = true,
  "aria-label": ariaLabel,
  itemClassName = "",
}: SortableListProps<T>) {
  const [draggedIndex, setDraggedIndex] =
    useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] =
    useState<number | null>(null);

  const handleDrop = useCallback(() => {
    if (
      draggedIndex === null ||
      dragOverIndex === null ||
      draggedIndex === dragOverIndex
    ) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reordered = [...items];
    const [moved] = reordered.splice(draggedIndex, 1);
    reordered.splice(dragOverIndex, 0, moved);

    onReorder(reordered);
    setDraggedIndex(null);
    setDragOverIndex(null);
  }, [draggedIndex, dragOverIndex, items, onReorder]);

  return (
    <ul
      className="space-y-2"
      role="list"
      aria-label={ariaLabel ?? "Sortable list"}
    >
      {items.map((item, index) => (
        <li
          key={getItemId(item)}
          draggable
          onDragStart={() =>
            setDraggedIndex(index)
          }
          onDragOver={(event) => {
            event.preventDefault();
            setDragOverIndex(index);
          }}
          onDragLeave={() =>
            setDragOverIndex(null)
          }
          onDrop={handleDrop}
          onDragEnd={() => {
            setDraggedIndex(null);
            setDragOverIndex(null);
          }}
          className={[
            "flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 p-2 backdrop-blur-md transition-opacity",
            draggedIndex === index
              ? "opacity-40"
              : "",
            dragOverIndex === index &&
              draggedIndex !== index
              ? "ring-2 ring-white/50"
              : "",
            itemClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {showDragHandle && (
            <div
              className="cursor-grab p-2 active:cursor-grabbing"
              aria-hidden="true"
            >
              <Icon name="grip" size="sm" />
            </div>
          )}

          {renderLeftAccessory && (
            <div className="flex items-center">
              {renderLeftAccessory(item, index)}
            </div>
          )}

          <div className="min-w-0 flex-1">
            {renderItem(item, {
              onRemove: () =>
                onRemove?.(item),
            })}
          </div>
        </li>
      ))}
    </ul>
  );
}
