import type { ButtonHTMLAttributes } from "react";

import {
  Icon,
  type IconName,
  type IconSize,
} from "../icon";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger";

type ButtonSize = "sm" | "md" | "lg";

type ButtonDisplay =
  | {
      display?: "text";
      icon?: IconName;
    }
  | {
      display: "icon" | "responsive";
      icon: IconName;
    };

type BaseButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export type ButtonProps =
  BaseButtonProps & ButtonDisplay;

const VARIANT_CLASS_NAMES: Record<
  ButtonVariant,
  string
> = {
  primary:
    "bg-primary text-primary-foreground hover:opacity-90",
  secondary:
    "border border-border bg-surface text-foreground hover:bg-surface-muted",
  ghost:
    "bg-transparent text-foreground hover:bg-surface-muted",
  danger:
    "bg-danger text-white hover:opacity-90",
};

const SIZE_CLASS_NAMES: Record<ButtonSize, string> = {
  sm: "h-8 gap-1.5 text-xs",
  md: "h-10 gap-2 text-sm",
  lg: "h-12 gap-2.5 text-base",
};

const ICON_SIZE: Record<ButtonSize, IconSize> = {
  sm: "sm",
  md: "md",
  lg: "lg",
};

const ICON_BUTTON_WIDTH: Record<ButtonSize, string> = {
  sm: "w-8",
  md: "w-10",
  lg: "w-12",
};

export function Button({
  label,
  icon,
  display = "text",
  variant = "secondary",
  size = "md",
  type = "button",
  className,
  ...buttonProps
}: ButtonProps) {
  const layoutClassName =
    display === "icon"
      ? `${ICON_BUTTON_WIDTH[size]} justify-center px-0`
      : display === "responsive"
        ? "justify-center px-2 sm:px-4"
        : "px-4";

  const accessibleLabel =
    display === "text"
      ? buttonProps["aria-label"]
      : buttonProps["aria-label"] ?? label;

  return (
    <button
      {...buttonProps}
      type={type}
      aria-label={accessibleLabel}
      className={[
        "inline-flex items-center rounded-lg font-medium",
        "transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        "disabled:pointer-events-none disabled:opacity-60",
        VARIANT_CLASS_NAMES[variant],
        SIZE_CLASS_NAMES[size],
        layoutClassName,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {icon && (
        <Icon
          name={icon}
          size={ICON_SIZE[size]}
        />
      )}

      {display !== "icon" && (
        <span
          className={
            display === "responsive"
              ? "hidden sm:inline"
              : undefined
          }
        >
          {label}
        </span>
      )}
    </button>
  );
}