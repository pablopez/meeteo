"use client";

import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import { Icon, type IconName } from "@/shared/ui";

export type MenuSquareButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  icon: IconName;
  label: string;
  badge?: ReactNode;
  active?: boolean;
  className?: string;
};

export function MenuSquareButton({
  icon,
  label,
  badge,
  active = false,
  className = "",
  ...buttonProps
}: MenuSquareButtonProps) {
  return (
    <button
      {...buttonProps}
      type="button"
      aria-label={label}
      className={[
        // Layout
        "relative flex h-20 w-20 flex-col items-center justify-center gap-1",
        // Primary text
        "text-sm font-medium text-primary transition-colors",
        // Accent text on interaction
        "hover:text-accent focus-visible:text-accent",
        // Active state
        active
          ? "text-accent"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Icon
        name={icon}
        size="lg"
        className="h-8 w-8"
      />

      {badge !== undefined && (
        <span className="absolute right-2 top-2 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-xs font-semibold text-primary">
          {badge}
        </span>
      )}
    </button>
  );
}
