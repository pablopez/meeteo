import { useTranslation } from "react-i18next";
import { Panel } from "@/shared/ui";

export function AppInfoPanel() {
  const { t } = useTranslation();

  const appVersion = process.env.NEXT_PUBLIC_APP_VERSION || "0.1.0";
  const authorName = process.env.NEXT_PUBLIC_APP_AUTHOR_NAME || "Pablo López";
  const authorUrl = process.env.NEXT_PUBLIC_APP_AUTHOR_URL || "https://github.com/pablopez";
  const currentYear = new Date().getFullYear();

  return (
    <Panel aria-label={t("menu.appInfo")} className="text-center">
      <div className="flex flex-col items-center gap-6 text-center text-white">
        {/* Sección 1: Data sources */}
        <section className="flex flex-col gap-2">
          <h3 className="text-base font-semibold tracking-wide">
            {t("appInfo.dataSourcesTitle", "Data sources")}
          </h3>
          <ul className="flex flex-col gap-1 text-sm text-white/90">
            <li>
              {t("appInfo.weatherGeocoding", "Weather and geocoding")}:{" "}
              <a
                href="https://open-meteo.com"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-white"
              >
                Open-Meteo
              </a>
            </li>
            <li>
              {t("appInfo.airQualityPollen", "Air quality and pollen")}:{" "}
              <a
                href="https://atmosphere.copernicus.eu"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-white"
              >
                CAMS
              </a>
            </li>
            <li>
              {t("appInfo.mapData", "Map data")}:{" "}
              <a
                href="https://www.openstreetmap.org"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-white"
              >
                OpenStreetMap
              </a>
            </li>
          </ul>
        </section>

        {/* Separador fino translúcido */}
        <div className="w-16 h-px bg-white/20" />

        {/* Sección 2: Info & Autor (como sección interna, no footer) */}
        <section aria-label="About" className="flex flex-col gap-1 text-xs text-white/70">
          <span className="font-mono">
            {t("appInfo.version", "Version")} v{appVersion}
          </span>
          <span>
            {t("appInfo.developedBy", "Developed by")}{" "}
            <a
              href={authorUrl}
              target="_blank"
              rel="noreferrer"
              className="underline hover:text-white"
            >
              {authorName}
            </a>
          </span>
          <span>© {currentYear}</span>
        </section>
      </div>
    </Panel>
  );
}