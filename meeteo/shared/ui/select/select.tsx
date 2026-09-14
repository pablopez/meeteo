"use client";

import {
  forwardRef,
  useId,
  type SelectHTMLAttributes,
} from "react";

import {
  Icon,
  type IconName,
} from "../icon";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type SelectOrientation =
  | "horizontal"
  | "vertical";

export type SelectProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "children"
> & {
  label: string;
  options: readonly SelectOption[];
  orientation?: SelectOrientation;
  containerClassName?: string;
  icon?: IconName;
  fullWidth?: boolean;
};

export const Select = forwardRef<
  HTMLSelectElement,
  SelectProps
>(function Select(
  {
  id,
  label,
  options,
  icon,
  fullWidth = false,
  orientation = "horizontal",
  className,
  containerClassName,
  ...selectProps
},
  ref,
) {
  const generatedId = useId();
  const selectId = id ?? generatedId;

  return (
    <label
      htmlFor={selectId}
      className={[
      orientation === "horizontal"
        ? "inline-flex items-center gap-2"
        : "flex flex-col gap-2",
      fullWidth && "w-full",
      containerClassName,
    ]
      .filter(Boolean)
      .join(" ")}
        >
      <span className="text-sm text-muted-foreground">
        {label}
      </span>

      <span className="relative inline-flex">
        <span
  className={[
    "relative inline-flex",
    fullWidth && "w-full",
  ]
    .filter(Boolean)
    .join(" ")}
>
  {icon && (
    <Icon
      name={icon}
      size="sm"
      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
    />
  )}

  <select
    {...selectProps}
    ref={ref}
    id={selectId}
    className={[
      "appearance-none rounded-lg",
      "border border-border bg-surface",
      "py-2 pr-9 text-sm text-foreground",
      icon ? "pl-9" : "pl-3",
      fullWidth && "w-full",
      "outline-none transition-colors",
      "focus:border-primary focus:ring-2 focus:ring-primary/20",
      "disabled:cursor-not-allowed disabled:opacity-60",
      className,
    ]
      .filter(Boolean)
      .join(" ")}
  >
    {options.map((option) => (
      <option
        key={option.value}
        value={option.value}
        disabled={option.disabled}
      >
        {option.label}
      </option>
    ))}
  </select>

  <Icon
    name="chevron-down"
    size="sm"
    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
  />
</span>

        <Icon
          name="chevron-down"
          size="sm"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
      </span>
    </label>
  );
});