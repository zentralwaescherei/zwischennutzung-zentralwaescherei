import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import "./globals.css";
import { posterThemeClass } from "@/styles/theme";

export const metadata: Metadata = {
  title: {
    default: "Zwischennutzung Zentralwaescherei",
    template: "%s | Zwischennutzung Zentralwaescherei",
  },
  description:
    "Oeffentliche Informationsseite zu Organisationen, Zeugnissen und Neuigkeiten aus der Zwischennutzung Zentralwaescherei.",
};

const navigationItems = [
  { href: "/", label: "Start" },
  { href: "/organisationen", label: "Hauskarte" },
  { href: "/organisationen", label: "Organisationen" },
  { href: "/zeugnisse", label: "Zeugnisse" },
  { href: "/blog", label: "Blog" },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de" className={posterThemeClass}>
      <body>
        <div className="layout-shell">
          <header className="site-header">
            <div className="site-header-inner">
              <Link href="/" className="site-title">
                Zwischennutzung Zentralwaescherei
              </Link>
              <nav className="site-nav" aria-label="Hauptnavigation">
                <ul>
                  {navigationItems.map((item) => (
                    <li key={`${item.href}-${item.label}`}>
                      <Link href={item.href}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </header>
          <main className="site-main">{children}</main>
          <footer className="site-footer">Oeffentliche V1-Struktur fuer Inhalte aus dem CMS.</footer>
        </div>
      </body>
    </html>
  );
}
