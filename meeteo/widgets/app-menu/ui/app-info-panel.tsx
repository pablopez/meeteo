import { useTranslation } from "react-i18next";

import { Panel } from "@/shared/ui";

export function AppInfoPanel() {
  const { t } = useTranslation();

  return (
    <Panel
      aria-label={t("menu.appInfo")}
      className="text-center"
    >
      <h3 className="mb-3 font-semibold text-white">
        {t("menu.dataSources")}
      </h3>

      <div className="space-y-2 text-center text-sm text-white/80">
        <p>
          {t("menu.weatherData")}:{" "}
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Open-Meteo
          </a>
        </p>

        <p>
          {t("menu.environmentData")}:{" "}
          <a
            href="https://atmosphere.copernicus.eu/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            CAMS
          </a>
        </p>

        <p>
          {t("menu.mapData")}:{" "}
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            OpenStreetMap
          </a>
        </p>
      </div>
    </Panel>
  );
}
