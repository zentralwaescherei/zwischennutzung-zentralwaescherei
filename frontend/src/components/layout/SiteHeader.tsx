import Link from "next/link";

import { SkipLink } from "@/components/layout/SkipLink";

const navItems: { href: string; label: string }[] = [
  { href: "#start", label: "START" },
  { href: "#organisationen", label: "HAUS" },
  { href: "#zeugnisse", label: "ZEUGNISSE" },
  { href: "#blog", label: "BLOG" },
];

export function SiteHeader() {
  return (
    <header className="site-header" data-section-color="bone">
      <SkipLink />
      <div className="site-header-inner">
        <Link href="#start" className="site-title mono">
          ZW / ZÜRICH
        </Link>
        <nav className="site-nav mono" aria-label="Hauptnavigation">
          <ul>
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
