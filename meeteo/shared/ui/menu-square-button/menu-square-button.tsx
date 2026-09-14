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
        "relative flex h-20 w-20 flex-col items-center justify-center gap-1",
        "rounded-2xl border border-border bg-surface/60 backdrop-blur-md",
        "text-sm font-medium text-foreground transition-colors",
        "hover:bg-surface/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        active
          ? "ring-2 ring-primary bg-surface/80"
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
        <span className="absolute right-2 top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-semibold text-primary-foreground">
          {badge}
        </span>
      )}
    </button>
  );
}
