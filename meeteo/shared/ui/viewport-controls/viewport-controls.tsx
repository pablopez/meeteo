"use client";

import {
  type MouseEvent,
  type ReactNode,
  type WheelEvent,
} from "react";

import { Icon } from "../icon";

type ViewportControlsProps = {
  children: ReactNode;
  className?: string;
  controlClassName?: string;
  captureWheel?: boolean;
  zoomInLabel?: string;
  zoomOutLabel?: string;
  panUpLabel?: string;
  panDownLabel?: string;
  panLeftLabel?: string;
  panRightLabel?: string;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onPanUp?: () => void;
  onPanDown?: () => void;
  onPanLeft?: () => void;
  onPanRight?: () => void;
  onControlsHoverChange?: (isHovering: boolean) => void;
};

const DEFAULT_LABELS = {
  zoomIn: "Zoom in",
  zoomOut: "Zoom out",
  panUp: "Pan up",
  panDown: "Pan down",
  panLeft: "Pan left",
  panRight: "Pan right",
};

export function ViewportControls({
  children,
  className = "",
  controlClassName = "",
  captureWheel = false,
  zoomInLabel = DEFAULT_LABELS.zoomIn,
  zoomOutLabel = DEFAULT_LABELS.zoomOut,
  panUpLabel = DEFAULT_LABELS.panUp,
  panDownLabel = DEFAULT_LABELS.panDown,
  panLeftLabel = DEFAULT_LABELS.panLeft,
  panRightLabel = DEFAULT_LABELS.panRight,
  onZoomIn,
  onZoomOut,
  onPanUp,
  onPanDown,
  onPanLeft,
  onPanRight,
  onControlsHoverChange,
}: ViewportControlsProps) {
  const baseButtonClassName =
    "pointer-events-auto z-[2000] flex h-8 w-8 items-center justify-center rounded-full border border-border bg-surface text-foreground transition-colors hover:bg-surface-muted data-viewport-control";

  const buttonClassName = [baseButtonClassName, controlClassName]
    .filter(Boolean)
    .join(" ");

  function handleWheel(event: WheelEvent) {
    if (!captureWheel) {
      return;
    }

    event.stopPropagation();

    if (event.deltaY < 0) {
      onZoomIn?.();
    } else if (event.deltaY > 0) {
      onZoomOut?.();
    }
  }

  function handleControlClick(
    event: MouseEvent<HTMLButtonElement>,
    action: () => void,
  ) {
    event.stopPropagation();
    action();
  }

  const controlPointerProps = {
    onPointerEnter: () => onControlsHoverChange?.(true),
    onPointerLeave: () => onControlsHoverChange?.(false),
  };

  return (
    <div
      className={[
        "relative z-[2000] h-full w-full",
        captureWheel ? "pointer-events-auto" : "pointer-events-none",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onWheel={handleWheel}
    >
      {children}

      {onPanUp && (
        <button
          type="button"
          aria-label={panUpLabel}
          data-viewport-control
          {...controlPointerProps}
          onClick={(event) =>
            handleControlClick(event, onPanUp)
          }
          className={`${buttonClassName} absolute left-1/2 top-4 -translate-x-1/2`}
        >
          <Icon name="chevron-up" />
        </button>
      )}

      {onPanDown && (
        <button
          type="button"
          aria-label={panDownLabel}
          data-viewport-control
          {...controlPointerProps}
          onClick={(event) =>
            handleControlClick(event, onPanDown)
          }
          className={`${buttonClassName} absolute bottom-4 left-1/2 -translate-x-1/2`}
        >
          <Icon name="chevron-down" />
        </button>
      )}

      {onPanLeft && (
        <button
          type="button"
          aria-label={panLeftLabel}
          data-viewport-control
          {...controlPointerProps}
          onClick={(event) =>
            handleControlClick(event, onPanLeft)
          }
          className={`${buttonClassName} absolute left-4 top-1/2 -translate-y-1/2`}
        >
          <Icon name="chevron-left" />
        </button>
      )}

      {onPanRight && (
        <button
          type="button"
          aria-label={panRightLabel}
          data-viewport-control
          {...controlPointerProps}
          onClick={(event) =>
            handleControlClick(event, onPanRight)
          }
          className={`${buttonClassName} absolute right-4 top-1/2 -translate-y-1/2`}
        >
          <Icon name="chevron-right" />
        </button>
      )}

      {onZoomIn && (
        <button
          type="button"
          aria-label={zoomInLabel}
          data-viewport-control
          {...controlPointerProps}
          onClick={(event) =>
            handleControlClick(event, onZoomIn)
          }
          className={`${buttonClassName} absolute bottom-14 right-4`}
        >
          <span className="text-lg font-bold leading-none">
            +
          </span>
        </button>
      )}

      {onZoomOut && (
        <button
          type="button"
          aria-label={zoomOutLabel}
          data-viewport-control
          {...controlPointerProps}
          onClick={(event) =>
            handleControlClick(event, onZoomOut)
          }
          className={`${buttonClassName} absolute bottom-4 right-4`}
        >
          <span className="text-lg font-bold leading-none">
            -
          </span>
        </button>
      )}
    </div>
  );
}

export type { ViewportControlsProps };
