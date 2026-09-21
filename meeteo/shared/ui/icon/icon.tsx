import type { LucideProps } from "lucide-react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  GalleryHorizontal,
  GripVertical,
  Info,
  Languages,
  Map,
  MapPin,
  Moon,
  Search,
  Star,
  Sun,
  Table,
  Trash2,
  X,
} from "lucide-react";

import type { IconName, IconSize } from "./types";

export type { IconName, IconSize } from "./types";

type IconProps = Omit<
  LucideProps,
  "children" | "ref"
> & {
  name: IconName;
  size?: IconSize;
};

const SIZE_CLASS_NAMES: Record<IconSize, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

const ICON_COMPONENTS = {
  search: Search,
  map: Map,
  location: MapPin,
  language: Languages,
  star: Star,
  "star-filled": Star,
  trash: Trash2,
  "arrow-up": ArrowUp,
  "arrow-down": ArrowDown,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  "chevron-down": ChevronDown,
  "chevron-up": ChevronUp,
  table: Table,
  carousel: GalleryHorizontal,
  theme: Sun,
  sun: Sun,
  moon: Moon,
  close: X,
  grip: GripVertical,
  info: Info,
} satisfies Record<IconName, React.ComponentType<LucideProps>>;

export function Icon({
  name,
  size = "md",
  className,
  fill,
  ...props
}: IconProps) {
  const Component = ICON_COMPONENTS[name];

  return (
    <Component
      {...props}
      fill={
        name === "star-filled"
          ? "currentColor"
          : fill ?? "none"
      }
      className={[
        "shrink-0",
        SIZE_CLASS_NAMES[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
      focusable="false"
    />
  );
}
