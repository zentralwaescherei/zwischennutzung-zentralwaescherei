import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import { monumentDisplay, monumentMono } from "@/lib/fonts";
import { posterThemeClass } from "@/styles/theme";

export const metadata: Metadata = {
  title: {
    default: "Zwischennutzung Zentralwaescherei",
    template: "%s | Zwischennutzung Zentralwaescherei",
  },
  description:
    "Oeffentliche Informationsseite zu Organisationen, Zeugnissen und Neuigkeiten aus der Zwischennutzung Zentralwaescherei.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="de"
      className={`${posterThemeClass} ${monumentDisplay.variable} ${monumentMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
