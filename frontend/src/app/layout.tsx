import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

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
    <html lang="de">
      <body
        style={{
          margin: 0,
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f7f5ef",
          color: "#111111",
        }}
      >
        <div style={{ minHeight: "100vh" }}>
          <header
            style={{
              borderBottom: "1px solid #d9d4c8",
              padding: "1.5rem 2rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
              }}
            >
              <Link href="/" style={{ color: "inherit", fontWeight: 700, textDecoration: "none" }}>
                Zwischennutzung Zentralwaescherei
              </Link>
              <nav aria-label="Hauptnavigation">
                <ul
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "1rem",
                    listStyle: "none",
                    margin: 0,
                    padding: 0,
                  }}
                >
                  {navigationItems.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} style={{ color: "inherit" }}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </header>
          <main style={{ padding: "2rem" }}>{children}</main>
          <footer
            style={{
              borderTop: "1px solid #d9d4c8",
              padding: "1.5rem 2rem",
            }}
          >
            Oeffentliche V1-Struktur fuer Inhalte aus dem CMS.
          </footer>
        </div>
      </body>
    </html>
  );
}
