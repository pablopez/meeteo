export const ICON_NAMES = [
  "search",
  "map",
  "location",
  "language",
  "star",
  "star-filled",
  "trash",
  "arrow-up",
  "arrow-down",
  "chevron-left",
  "chevron-right",
  "chevron-down",
  "chevron-up",
  "table",
  "carousel",
  "theme",
  "sun",
  "moon",
  "close",
  "grip",
  "info",
] as const;

export type IconName = (typeof ICON_NAMES)[number];

export type IconSize = "sm" | "md" | "lg";
