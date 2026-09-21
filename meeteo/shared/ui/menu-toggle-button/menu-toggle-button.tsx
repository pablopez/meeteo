import type { ButtonHTMLAttributes } from "react";
import { ChevronUp, Menu } from "lucide-react";

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
  const baseClassNames = [
    "flex h-12 w-12 items-center justify-center",
    "text-white",
    "transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      {...buttonProps}
      type="button"
      aria-label={isOpen ? closeLabel : openLabel}
      aria-expanded={isOpen}
      aria-controls={controls}
      className={baseClassNames}
    >
      <span
        aria-hidden="true"
        className="relative block h-5 w-6"
      >
        <Menu
          className={[
            "absolute inset-0 h-full w-full transition-all duration-300",
            isOpen
              ? "rotate-90 scale-50 opacity-0"
              : "rotate-0 scale-100 opacity-100",
          ].join(" ")}
        />

        <ChevronUp
          className={[
            "absolute inset-0 h-full w-full transition-all duration-300",
            isOpen
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-50 opacity-0",
          ].join(" ")}
        />
      </span>
    </button>
  );
}