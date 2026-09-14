"use client";

import { useMemo, useSyncExternalStore } from "react";

import type { City } from "@/entities/city";

import {
  getSelectedCitySnapshot,
  getServerSelectedCitySnapshot,
  parseStoredCity,
  saveSelectedCity,
  subscribeToSelectedCity,
} from "../lib/selected-city-storage";

export function useSelectedCity() {
  const serializedCity = useSyncExternalStore(
    subscribeToSelectedCity,
    getSelectedCitySnapshot,
    getServerSelectedCitySnapshot,
  );

  const selectedCity = useMemo(
    () => parseStoredCity(serializedCity),
    [serializedCity],
  );

  function selectCity(city: City) {
    saveSelectedCity(city);
  }

  return {
    selectedCity,
    selectCity,
  };
}