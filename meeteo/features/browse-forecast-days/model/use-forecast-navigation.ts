import { useState } from "react";

export function useForecastNavigation(totalDays: number) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const maximumIndex = Math.max(totalDays - 1, 0);
  const safeIndex = Math.min(currentIndex, maximumIndex);

  function showPreviousDay() {
    setCurrentIndex((index) => Math.max(index - 1, 0));
  }

  function showNextDay() {
    setCurrentIndex((index) =>
      Math.min(index + 1, maximumIndex),
    );
  }

  return {
    currentIndex: safeIndex,
    hasPreviousDay: safeIndex > 0,
    hasNextDay: safeIndex < maximumIndex,
    showPreviousDay,
    showNextDay,
  };
}