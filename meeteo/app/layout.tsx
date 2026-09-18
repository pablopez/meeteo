import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "@/app/styles/globals.css";
import { I18nProvider } from "@/app/providers";
import { ToastProvider } from "@/shared/lib/toast";

export const metadata: Metadata = {
  title: "Meeteo",
  description: "Weather information for locations around the world.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Meeteo",
  },
  icons: {
    apple: "/icon-192x192.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0284c7",
};

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-nunito",
  display: "swap",
});

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${nunito.variable} h-full antialiased`}>
      <body className="bg-transparent text-white antialiased">
        <I18nProvider>
          <ToastProvider>{children}</ToastProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
