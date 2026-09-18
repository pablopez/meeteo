"use client";

import type { ButtonHTMLAttributes } from "react";

export type MenuToggleButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "aria-label"
> & {
  isOpen: boolean;
  openLabel: string;
  closeLabel: string;
  controls: string;
};

export function MenuToggleButton({
  isOpen,
  openLabel,
  closeLabel,
  controls,
  className,
  ...buttonProps
}: MenuToggleButtonProps) {
  return (
    <button
      {...buttonProps}
      type="button"
      aria-label={
        isOpen ? closeLabel : openLabel
      }
      aria-expanded={isOpen}
      aria-controls={controls}
      className={[
        "flex h-12 w-12 items-center justify-center",
        "rounded-full border border-white/20",
        "bg-white/10 text-white backdrop-blur-md",
        "transition-colors hover:bg-white/20",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
        aria-hidden="true"
        className="relative h-5 w-6"
      >
        <span
          className={[
            "absolute left-0 h-0.5 w-6 rounded bg-current",
            "transition-all duration-300",
            isOpen
              ? "top-1/2 rotate-45"
              : "top-0.5",
          ].join(" ")}
        />

        <span
          className={[
            "absolute left-0 top-1/2 h-0.5 w-6 rounded bg-current",
            "-translate-y-1/2 transition-all duration-300",
            isOpen
              ? "opacity-0"
              : "opacity-100",
          ].join(" ")}
        />

        <span
          className={[
            "absolute left-0 h-0.5 w-6 rounded bg-current",
            "transition-all duration-300",
            isOpen
              ? "top-1/2 -rotate-45"
              : "bottom-0.5",
          ].join(" ")}
        />
      </span>
    </button>
  );
}