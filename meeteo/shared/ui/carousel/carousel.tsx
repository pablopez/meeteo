"use client";

import {
  useCallback,
  useState,
  useRef,
} from "react";

import { Icon } from "../icon";

type CarouselProps<T> = {
  items: readonly T[];
  getItemId: (item: T) => string;
  renderItem: (item: T, index: number) => React.ReactNode;
  currentIndex?: number;
  initialIndex?: number;
  onChange?: (index: number) => void;
  paginationVariant?: "dots" | "lines" | "hidden";
  loop?: boolean;
  previousLabel?: string;
  nextLabel?: string;
  showNavigation?: boolean;
};

export type { CarouselProps };

export function Carousel<T>({
  items,
  getItemId,
  renderItem,
  currentIndex: controlledIndex,
  initialIndex = 0,
  onChange,
  paginationVariant = "dots",
  loop = true,
  previousLabel = "Previous item",
  nextLabel = "Next item",
  showNavigation = true,
}: CarouselProps<T>) {
  const [internalIndex, setInternalIndex] = useState(
    Math.max(
      0,
      Math.min(initialIndex, items.length - 1),
    ),
  );

  const currentIndex =
    controlledIndex !== undefined
      ? controlledIndex
      : internalIndex;

  const containerRef = useRef<HTMLDivElement>(null);
  const pointerStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (index: number) => {
      const safeIndex =
        items.length === 0
          ? 0
          : loop
            ? ((index % items.length) + items.length) %
              items.length
            : Math.max(
                0,
                Math.min(index, items.length - 1),
              );

      if (controlledIndex === undefined) {
        setInternalIndex(safeIndex);
      }

      onChange?.(safeIndex);
    },
    [controlledIndex, items.length, loop, onChange],
  );

  const goToPrevious = useCallback(() => {
    goTo(currentIndex - 1);
  }, [currentIndex, goTo]);

  const goToNext = useCallback(() => {
    goTo(currentIndex + 1);
  }, [currentIndex, goTo]);

  function handlePointerDown(
    event: React.PointerEvent<HTMLDivElement>,
  ) {
    event.stopPropagation();
    pointerStartX.current = event.clientX;
  }

  function handlePointerUp(
    event: React.PointerEvent<HTMLDivElement>,
  ) {
    event.stopPropagation();
    if (pointerStartX.current === null) {
      return;
    }

    const deltaX = event.clientX - pointerStartX.current;
    const threshold = 40;

    if (deltaX > threshold) {
      goToPrevious();
    } else if (deltaX < -threshold) {
      goToNext();
    }

    pointerStartX.current = null;
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <section
      aria-roledescription="carousel"
      className="relative"
    >
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        className="touch-pan-y overflow-hidden"
      >
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {items.map((item, index) => (
            <div
              key={getItemId(item)}
              className="w-full shrink-0"
              aria-hidden={index !== currentIndex}
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>

      {showNavigation && items.length > 1 && (
        <>
          <div className="mt-4 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={goToPrevious}
              disabled={!loop && currentIndex === 0}
              className="rounded-lg border border-border bg-surface p-2 text-foreground disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={previousLabel}
            >
              <Icon name="chevron-left" size="sm" />
            </button>

            {paginationVariant !== "hidden" && (
              <div
                className="flex gap-2"
                role="tablist"
                aria-label="Carousel navigation"
              >
                {items.map((item, index) => (
                  <button
                    key={getItemId(item)}
                    type="button"
                    role="tab"
                    aria-selected={index === currentIndex}
                    aria-label={`Go to item ${index + 1}`}
                    onClick={() => goTo(index)}
                    className={[
                      paginationVariant === "lines"
                        ? "h-1.5 w-6 rounded-full transition-colors"
                        : "h-2.5 w-2.5 rounded-full transition-colors",
                      index === currentIndex
                        ? "bg-primary"
                        : "bg-border hover:bg-muted-foreground",
                    ].join(" ")}
                  />
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={goToNext}
              disabled={!loop && currentIndex === items.length - 1}
              className="rounded-lg border border-border bg-surface p-2 text-foreground disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={nextLabel}
            >
              <Icon name="chevron-right" size="sm" />
            </button>
          </div>
        </>
      )}
    </section>
  );
}
