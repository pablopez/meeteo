"use client";

import {
  useId,
  useRef,
  type InputHTMLAttributes,
  type Key,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import {
  Icon,
  type IconName,
} from "../icon";

export type PredictiveInputStatus =
  | "idle"
  | "loading"
  | "success"
  | "error";

export type PredictiveInputMessages = {
  loading: string;
  empty: string;
  error: string;
};

export type PredictiveInputProps<T> = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "children"
> & {
  label: string;
  value: string;
  options: readonly T[];
  status: PredictiveInputStatus;
  messages: PredictiveInputMessages;
  resultsLabel: string;
  icon?: IconName;
  onValueChange: (value: string) => void;
  onOptionSelect: (option: T) => void;
  getOptionKey: (option: T) => Key;
  renderOption: (option: T) => ReactNode;
};

export function PredictiveInput<T>({
  id,
  label,
  value,
  options,
  status,
  messages,
  resultsLabel,
  icon = "search",
  onValueChange,
  onOptionSelect,
  getOptionKey,
  renderOption,
  onKeyDown,
  className,
  ...inputProps
}: PredictiveInputProps<T>) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const listId = `${inputId}-results`;
  const messageId = `${inputId}-message`;

  const inputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<
    Array<HTMLButtonElement | null>
  >([]);

  const hasOptions = options.length > 0;

  const hasMessage =
    status === "loading" ||
    status === "error" ||
    (status === "success" && !hasOptions);

  function focusOption(index: number) {
    optionRefs.current[index]?.focus();
  }

  function handleInputKeyDown(
    event: KeyboardEvent<HTMLInputElement>,
  ) {
    onKeyDown?.(event);

    if (event.defaultPrevented) {
      return;
    }

    if (event.key === "ArrowDown" && hasOptions) {
      event.preventDefault();
      focusOption(0);
    }

    if (event.key === "ArrowUp" && hasOptions) {
      event.preventDefault();
      focusOption(options.length - 1);
    }
  }

  function handleOptionKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    if (event.key === "ArrowDown") {
      event.preventDefault();

      focusOption(
        Math.min(index + 1, options.length - 1),
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (index === 0) {
        inputRef.current?.focus();
        return;
      }

      focusOption(index - 1);
    }

    if (event.key === "Escape") {
      event.preventDefault();
      inputRef.current?.focus();
    }
  }

  function handleOptionSelect(option: T) {
    onOptionSelect(option);
    inputRef.current?.focus();
  }

  return (
    <div className="relative">
      <label
        htmlFor={inputId}
        className="mb-2 block text-sm font-medium"
      >
        {label}
      </label>

      <div className="relative">
        <Icon
          name={icon}
          size="md"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/70"
        />

        <input
          {...inputProps}
          ref={inputRef}
          id={inputId}
          type="search"
          role="combobox"
          value={value}
          autoComplete="off"
          aria-autocomplete="list"
          aria-expanded={hasOptions}
          aria-controls={
            hasOptions ? listId : undefined
          }
          aria-describedby={
            hasMessage ? messageId : undefined
          }
          aria-invalid={
            status === "error" || undefined
          }
          onChange={(event) =>
            onValueChange(event.target.value)
          }
          onKeyDown={handleInputKeyDown}
          className={[
            "w-full rounded-xl border border-white/20",
            "bg-white/10 py-3 pl-10 pr-4 text-white placeholder:text-white/50",
            "outline-none transition-colors backdrop-blur-md",
            "focus:border-white/50 focus:ring-2 focus:ring-white/20",
            "disabled:cursor-not-allowed disabled:opacity-60",
            className,
          ]
            .filter(Boolean)
            .join(" ")}
        />
      </div>

      {status === "loading" && (
        <p
          id={messageId}
          role="status"
          className="mt-2 text-sm text-white/70"
        >
          {messages.loading}
        </p>
      )}

      {status === "error" && (
        <p
          id={messageId}
          role="alert"
          className="mt-2 text-sm text-white"
        >
          {messages.error}
        </p>
      )}

      {status === "success" && !hasOptions && (
        <p
          id={messageId}
          className="mt-2 text-sm text-white/70"
        >
          {messages.empty}
        </p>
      )}

      {hasOptions && (
        <ul
          id={listId}
          role="listbox"
          aria-label={resultsLabel}
          className="absolute z-10 mt-2 w-full overflow-hidden rounded-xl border border-white/20 bg-white/10 backdrop-blur-lg"
        >
          {options.map((option, index) => (
            <li
              key={getOptionKey(option)}
              role="none"
            >
              <button
                ref={(element) => {
                  optionRefs.current[index] = element;
                }}
                type="button"
                role="option"
                aria-selected="false"
                onClick={() =>
                  handleOptionSelect(option)
                }
                onKeyDown={(event) =>
                  handleOptionKeyDown(event, index)
                }
                className="flex w-full px-4 py-3 text-left text-white outline-none hover:bg-white/10 focus:bg-white/10"
              >
                {renderOption(option)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}