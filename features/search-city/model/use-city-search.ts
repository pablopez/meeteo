import { useEffect, useState } from "react";

import {
  searchCities,
  type City,
} from "@/entities/city";

export type CitySearchStatus =
  | "idle"
  | "loading"
  | "success"
  | "error";

const SEARCH_DELAY = 350;

export function useCitySearch(language: string) {
  const [query, setQuery] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [status, setStatus] =
    useState<CitySearchStatus>("idle");

  function updateQuery(value: string) {
    setQuery(value);

    if (value.trim().length < 2) {
      setCities([]);
      setStatus("idle");
    }
  }

  function clearResults() {
    setCities([]);
    setStatus("idle");
  }

  useEffect(() => {
    const normalizedQuery = query.trim();

    if (normalizedQuery.length < 2) {
      return;
    }

    const controller = new AbortController();

    const timeoutId = window.setTimeout(() => {
      setStatus("loading");

      void searchCities({
        query: normalizedQuery,
        language,
        signal: controller.signal,
      })
        .then((results) => {
          if (controller.signal.aborted) {
            return;
          }

          setCities(results);
          setStatus("success");
        })
        .catch(() => {
          if (controller.signal.aborted) {
            return;
          }

          setCities([]);
          setStatus("error");
        });
    }, SEARCH_DELAY);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query, language]);

  return {
    query,
    cities,
    status,
    updateQuery,
    clearResults,
  };
}