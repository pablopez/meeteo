export function getMeteoconSrc(
  iconName: string,
  isDay: boolean | number = true,
): string {
  const iconSet = isDay === false || isDay === 0 ? "monochrome" : "flat";

  return `/meteocons/${iconSet}/${iconName}.svg`;
}
