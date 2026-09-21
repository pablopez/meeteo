"use client";

import { useTranslation } from "react-i18next";

import type { City } from "@/entities/city";
import { PredictiveInput } from "@/shared/ui";

import { useCitySearch } from "../model/use-city-search";

type CitySearchProps = {
  onCitySelect: (city: City) => void;
};

export function CitySearch({
  onCitySelect,
}: CitySearchProps) {
  const { t, i18n } = useTranslation();

  const {
    query,
    cities,
    status,
    updateQuery,
    clearResults,
  } = useCitySearch(i18n.resolvedLanguage ?? "en");

  function handleCitySelect(city: City) {
    clearResults();
    onCitySelect(city);
  }

  return (
    <PredictiveInput
      id="city-search"
      label={t("citySearch.label")}
      placeholder={t("citySearch.placeholder")}
      value={query}
      options={cities}
      status={status}
      resultsLabel={t("citySearch.results")}
      messages={{
        loading: t("citySearch.loading"),
        empty: t("citySearch.noResults"),
        error: t("citySearch.error"),
      }}
      onValueChange={updateQuery}
      onOptionSelect={handleCitySelect}
      getOptionKey={(city) => city.id}
      renderOption={(city) => (
        <span className="flex w-full items-center justify-between gap-4">
          <span className="font-medium">
            {city.name}
          </span>

          <span className="text-sm ">
            {[city.region, city.countryCode]
              .filter(Boolean)
              .join(", ")}
          </span>
        </span>
      )}
    />
  );
}