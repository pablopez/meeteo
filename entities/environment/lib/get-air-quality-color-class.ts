export function getAirQualityColorClass(index: number): string {
  if (index <= 50) {
    return "bg-green-500";
  }

  if (index <= 100) {
    return "bg-yellow-500";
  }

  if (index <= 150) {
    return "bg-orange-500";
  }

  if (index <= 200) {
    return "bg-red-500";
  }

  return "bg-slate-900";
}
