export type UvRisk =
  | "low"
  | "moderate"
  | "high"
  | "very-high"
  | "extreme";

export function getUvRisk(value: number): UvRisk {
  if (value < 3) {
    return "low";
  }

  if (value < 6) {
    return "moderate";
  }

  if (value < 8) {
    return "high";
  }

  if (value < 11) {
    return "very-high";
  }

  return "extreme";
}

export function getUvMeteoconName(value: number | null): string {
  if (value === null) {
    return "uv-index";
  }

  if (value > 11) {
    return "uv-index-11-plus";
  }

  const iconIndex = Math.max(1, Math.round(value));
  return `uv-index-${iconIndex}`;
}
