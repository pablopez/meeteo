import type { ButtonHTMLAttributes } from "react";

import { Icon } from "../icon";

export type FavoriteButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "children"
> & {
  favorite: boolean;
  label: string;
};

export function FavoriteButton({
  favorite,
  label,
  className,
  ...buttonProps
}: FavoriteButtonProps) {
  return (
    <button
      {...buttonProps}
      type="button"
      aria-label={label}
      aria-pressed={favorite}
      className={[
        "inline-flex items-center justify-center",
        "rounded-lg bg-transparent p-1",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        "disabled:pointer-events-none disabled:opacity-60",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Icon
        name={favorite ? "star-filled" : "star"}
        size="lg"
        className={
          favorite
            ? "text-yellow-500"
            : "text-foreground"
        }
      />
    </button>
  );
}
