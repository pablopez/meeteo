import withPWAInit from "@ducanh2912/next-pwa";
import type { NextConfig } from "next";

import packageJson from "./package.json";

const authorName = typeof packageJson.author === "object" 
  ? packageJson.author?.name 
  : "Pablo López";

const authorUrl = typeof packageJson.author === "object" 
  ? packageJson.author?.url 
  : "https://github.com/pablopez";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
});

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: packageJson.version,
    NEXT_PUBLIC_APP_AUTHOR_NAME: authorName,
    NEXT_PUBLIC_APP_AUTHOR_URL: authorUrl,
  },
  output: "export",
  images: {
    unoptimized: true,
  },
  turbopack: {},
};

export default withPWA(nextConfig);
