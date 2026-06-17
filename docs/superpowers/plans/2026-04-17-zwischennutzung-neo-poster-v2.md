# Zwischennutzung Neo-Poster v2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/` as a Monument-Grotesk-driven one-pager with acid + cobalt section takeovers, editorial motion, anchor navigation, and 308 redirects for legacy routes, while keeping `/blog/[slug]` as real SSG routes.

**Architecture:** The frontend stays Next.js 14 App Router + Vitest + Playwright. v2 replaces the home route and layout chrome, adds a tokens/typography layer, and introduces a small set of isolated section and motion components. Existing CMS client, `HouseMap`, `OrganisationList`, `byFloorArea`, and blog helpers are reused; layout and route shape change but data contracts do not.

**Tech Stack:** Next.js 14 (App Router), React 18, TypeScript, Monument Grotesk (self-hosted WOFF2) via `next/font/local`, Framer Motion (new runtime dep), IntersectionObserver + CSS for lighter motions, Vitest + Testing Library, Playwright + `@axe-core/playwright`.

**Baseline:** Tasks are authored against the worktree `.worktrees/zw-task-1` on branch `feature/zw-task-1-bootstrap` (last green commit `cf2d59d`). If you prefer to keep v1 and v2 separated, create a fresh worktree (`git worktree add .worktrees/zw-task-v2 -b feature/zw-task-v2-neo-poster cf2d59d`) and run every task from there. All paths below are relative to the worktree root.

**Conventions (apply to every task):**

- Before any edit, run `corepack pnpm --filter frontend test` and `corepack pnpm --filter frontend exec tsc --noEmit` to confirm a green baseline.
- Every task uses Red → Green → Commit. Write the failing test first, run it to confirm it fails, implement, run it to confirm it passes, then commit. Never commit with failing tests.
- Use `corepack pnpm` at the root of the worktree so a `pnpm` binary is not required on `PATH`.
- After dev servers run, `next dev` may re-add `.next/types/**/*.ts` to `frontend/tsconfig.json`. Before any commit, run `git restore frontend/tsconfig.json` if that line reappears.
- Prefer `data-*` hooks or stable `aria-*` attributes over class names when writing tests; keep tests resilient to styling changes.

---

## File Structure

**Create:**

- `frontend/src/styles/typography.css` — display scale, soft-hyphen helpers, font-var wiring.
- `frontend/src/styles/theme.ts` (extended) — add color + font token exports.
- `frontend/src/styles/motion.css` — marquee, map-pulse, card-rotation keyframes, reduced-motion fallbacks.
- `frontend/src/lib/fonts.ts` — `next/font/local` Monument Grotesk loaders.
- `frontend/src/lib/useMatchMedia.ts` — small SSR-safe hook for `prefers-reduced-motion`.
- `frontend/src/components/layout/SiteHeader.tsx`
- `frontend/src/components/layout/SiteFooter.tsx`
- `frontend/src/components/layout/SectionRail.tsx`
- `frontend/src/components/layout/SkipLink.tsx`
- `frontend/src/components/motion/Reveal.tsx`
- `frontend/src/components/motion/Marquee.tsx`
- `frontend/src/components/motion/Scramble.tsx`
- `frontend/src/components/motion/ActiveFilterChip.tsx`
- `frontend/src/components/sections/HeroSection.tsx`
- `frontend/src/components/sections/IntroSection.tsx`
- `frontend/src/components/sections/OrganisationsSection.tsx`
- `frontend/src/components/sections/ZeugnisseSection.tsx`
- `frontend/src/components/sections/BlogTeaserSection.tsx`
- `frontend/src/components/map/FloorSelect.tsx`
- `frontend/src/components/voting/VoteModeStrap.tsx`
- `frontend/public/fonts/monument-grotesk-regular.woff2` (asset)
- `frontend/public/fonts/monument-grotesk-heavy.woff2` (asset)
- `frontend/public/fonts/monument-grotesk-mono-regular.woff2` (asset, or JetBrains Mono fallback)
- `frontend/public/og/start.png` (asset, initial 1200×630 bone ground with poster headline)
- `frontend/src/app/sitemap.ts`
- `frontend/e2e/redirects.spec.ts`
- `frontend/e2e/a11y.spec.ts`
- `frontend/tests/components/SiteHeader.test.tsx`
- `frontend/tests/components/HeroSection.test.tsx`
- `frontend/tests/components/IntroSection.test.tsx`
- `frontend/tests/components/OrganisationsSection.test.tsx`
- `frontend/tests/components/ZeugnisseSection.test.tsx`
- `frontend/tests/components/BlogTeaserSection.test.tsx`
- `frontend/tests/components/SiteFooter.test.tsx`
- `frontend/tests/components/Reveal.test.tsx`
- `frontend/tests/components/Marquee.test.tsx`
- `frontend/tests/components/Scramble.test.tsx`
- `frontend/tests/components/ActiveFilterChip.test.tsx`
- `frontend/tests/components/FloorSelect.test.tsx`
- `frontend/tests/components/VoteModeStrap.test.tsx`
- `frontend/tests/unit/redirects.test.ts`
- `frontend/tests/unit/sitemap.test.ts`

**Modify:**

- `frontend/package.json` — add `framer-motion`, `@axe-core/playwright`.
- `frontend/src/app/layout.tsx` — anchor chrome + skip link + theme class + font vars.
- `frontend/src/app/page.tsx` — compose the one-pager; add `export const revalidate = 300`.
- `frontend/src/app/organisationen/page.tsx` — 308 redirect to `/#organisationen`.
- `frontend/src/app/zeugnisse/page.tsx` — 308 redirect to `/#zeugnisse`.
- `frontend/src/app/blog/page.tsx` — 308 redirect to `/#blog`.
- `frontend/src/app/globals.css` — color-takeover classes, reveal hooks, reduced-motion/contrast.
- `frontend/src/styles/tokens.css` — acid/cobalt/bone/ink + font vars + grid vars.
- `frontend/src/styles/theme.ts` — export color names.
- `frontend/src/components/content/TextBlockSection.tsx` — add `variant` prop (`poster` | `quiet`).
- `frontend/src/components/map/HouseMap.tsx` — focus pulse hook + cobalt active fill class.
- `frontend/src/components/organisations/OrganisationList.tsx` — restyle via tokens, ink-slide hover.
- `frontend/tests/components/DesignTokens.test.tsx` — extend to cover new color exports.
- `frontend/tests/components/TextBlockSection.test.tsx` — cover new variant.
- `frontend/tests/unit/homePage.test.tsx` — assert the one-pager composition.
- `frontend/e2e/smoke.spec.ts` — rewrite for anchor navigation journey.
- `frontend/playwright.config.ts` — no changes expected; confirm only.
- `README.md` — mention v2 one-pager, vote-mode flag, a11y and redirect e2e.
- `docs/content-entry-checklist.md` — add placement keys + vote-ready block.

Each task below produces a self-contained, committable change.

---

### Task 1: Extend color and typography tokens

**Files:**

- Modify: `frontend/src/styles/tokens.css`
- Modify: `frontend/src/styles/theme.ts`
- Modify: `frontend/tests/components/DesignTokens.test.tsx`

- [ ] **Step 1: Write the failing test**

Replace `frontend/tests/components/DesignTokens.test.tsx` with:

```tsx
import { describe, expect, it } from "vitest";

import {
  posterThemeClass,
  posterColors,
  posterFonts,
} from "@/styles/theme";

describe("posterThemeClass", () => {
  it("uses neo-poster-minimal theme classname", () => {
    expect(posterThemeClass).toBe("theme-neo-poster-minimal");
  });
});

describe("posterColors", () => {
  it("exposes bone, ink, acid, cobalt tokens", () => {
    expect(posterColors).toEqual({
      bone: "#F5F1E6",
      ink: "#0B0B0B",
      acid: "#F2FF3D",
      cobalt: "#0A1CFF",
    });
  });
});

describe("posterFonts", () => {
  it("declares display and mono families", () => {
    expect(posterFonts.display).toContain("Monument");
    expect(posterFonts.mono).toContain("Mono");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `corepack pnpm --filter frontend test DesignTokens`
Expected: FAIL — missing exports `posterColors`, `posterFonts`.

- [ ] **Step 3: Write minimal implementation**

Replace `frontend/src/styles/theme.ts` with:

```ts
export const posterThemeClass = "theme-neo-poster-minimal";

export const posterColors = {
  bone: "#F5F1E6",
  ink: "#0B0B0B",
  acid: "#F2FF3D",
  cobalt: "#0A1CFF",
} as const;

export const posterFonts = {
  display: "'Monument Grotesk', 'Inter', system-ui, sans-serif",
  mono: "'Monument Grotesk Mono', 'JetBrains Mono', ui-monospace, monospace",
} as const;
```

Replace `frontend/src/styles/tokens.css` with:

```css
:root.theme-neo-poster-minimal {
  --color-bone: #f5f1e6;
  --color-ink: #0b0b0b;
  --color-acid: #f2ff3d;
  --color-cobalt: #0a1cff;

  --color-bg: var(--color-bone);
  --color-fg: var(--color-ink);
  --color-accent: var(--color-cobalt);
  --color-border: var(--color-ink);
  --color-muted: #5c5a54;

  --font-display: "Monument Grotesk", "Inter", system-ui, sans-serif;
  --font-mono: "Monument Grotesk Mono", "JetBrains Mono", ui-monospace, monospace;

  --grid-max: 1440px;
  --grid-gutter: clamp(1rem, 2vw, 1.5rem);
  --space-section-y: clamp(5rem, 12vw, 10rem);
  --radius-card: 0px;
  --space-header-y: 1.25rem;
  --space-header-x: 2rem;
  --space-main: 0;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `corepack pnpm --filter frontend test DesignTokens`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/styles/tokens.css frontend/src/styles/theme.ts frontend/tests/components/DesignTokens.test.tsx
git commit -m "style(tokens): extend palette and font tokens for neo-poster v2"
```

---

### Task 2: Load Monument Grotesk via `next/font/local`

**Files:**

- Create: `frontend/src/lib/fonts.ts`
- Create: `frontend/public/fonts/monument-grotesk-regular.woff2`
- Create: `frontend/public/fonts/monument-grotesk-heavy.woff2`
- Create: `frontend/public/fonts/monument-grotesk-mono-regular.woff2`
- Modify: `frontend/src/styles/typography.css` (new)
- Modify: `frontend/src/app/layout.tsx`
- Modify: `frontend/src/app/globals.css`

- [ ] **Step 1: Write the failing test**

Create `frontend/tests/unit/fonts.test.ts`:

```ts
import { describe, expect, it } from "vitest";

import { monumentDisplay, monumentMono } from "@/lib/fonts";

describe("fonts module", () => {
  it("exposes a display font with a CSS variable", () => {
    expect(monumentDisplay.variable).toBe("--font-monument-display");
    expect(typeof monumentDisplay.className).toBe("string");
  });

  it("exposes a mono font with a CSS variable", () => {
    expect(monumentMono.variable).toBe("--font-monument-mono");
    expect(typeof monumentMono.className).toBe("string");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `corepack pnpm --filter frontend test fonts`
Expected: FAIL — module `@/lib/fonts` does not exist.

- [ ] **Step 3: Write minimal implementation**

Place the three WOFF2 files in `frontend/public/fonts/`. Licensed Monument Grotesk files go here; if not yet licensed, drop in an OFL placeholder (e.g. `JetBrains Mono` for mono and `Inter` for display) named identically so paths stay stable. The design spec allows this substitution without layout impact.

Create `frontend/src/lib/fonts.ts`:

```ts
import localFont from "next/font/local";

export const monumentDisplay = localFont({
  src: [
    { path: "../../public/fonts/monument-grotesk-regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/monument-grotesk-heavy.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-monument-display",
  display: "swap",
  preload: true,
});

export const monumentMono = localFont({
  src: [
    { path: "../../public/fonts/monument-grotesk-mono-regular.woff2", weight: "400", style: "normal" },
  ],
  variable: "--font-monument-mono",
  display: "swap",
  preload: true,
});
```

Create `frontend/src/styles/typography.css`:

```css
:root.theme-neo-poster-minimal {
  --font-display: var(--font-monument-display), "Inter", system-ui, sans-serif;
  --font-mono: var(--font-monument-mono), "JetBrains Mono", ui-monospace, monospace;
}

body {
  font-family: var(--font-display);
}

.mono {
  font-family: var(--font-mono);
  letter-spacing: 0.02em;
}

.display {
  font-family: var(--font-display);
  letter-spacing: -0.02em;
  line-height: 0.9;
  font-weight: 800;
}

.display--outline {
  -webkit-text-stroke: 2px currentColor;
  color: transparent;
}

.softhyphen::before {
  content: "";
}
```

Modify `frontend/src/app/globals.css` — replace the existing top `@import` line with:

```css
@import "../styles/tokens.css";
@import "../styles/typography.css";
```

Modify `frontend/src/app/layout.tsx` to compose the font classNames on `<html>`:

```tsx
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
```

(Chrome — header/footer — will be reintroduced in Task 3.)

- [ ] **Step 4: Run test to verify it passes**

Run: `corepack pnpm --filter frontend test fonts`
Expected: PASS.

Then run: `corepack pnpm --filter frontend build`
Expected: build succeeds; Next reports Monument fonts preloaded.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/lib/fonts.ts frontend/src/styles/typography.css frontend/src/app/globals.css frontend/src/app/layout.tsx frontend/public/fonts frontend/tests/unit/fonts.test.ts
git commit -m "feat(fonts): self-host monument grotesk via next/font/local"
```

---

### Task 3: Anchor SiteHeader and SkipLink

**Files:**

- Create: `frontend/src/components/layout/SkipLink.tsx`
- Create: `frontend/src/components/layout/SiteHeader.tsx`
- Create: `frontend/tests/components/SiteHeader.test.tsx`
- Modify: `frontend/src/app/layout.tsx`
- Modify: `frontend/src/app/globals.css`

- [ ] **Step 1: Write the failing test**

Create `frontend/tests/components/SiteHeader.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SiteHeader } from "@/components/layout/SiteHeader";

describe("SiteHeader", () => {
  it("renders a skip link targeting #main", () => {
    render(<SiteHeader />);
    const skip = screen.getByRole("link", { name: /zum inhalt springen/i });
    expect(skip).toHaveAttribute("href", "#main");
  });

  it("renders four anchor nav items pointing to section ids", () => {
    render(<SiteHeader />);
    const nav = screen.getByRole("navigation", { name: /hauptnavigation/i });
    const links = Array.from(nav.querySelectorAll("a")).map((a) => a.getAttribute("href"));
    expect(links).toEqual(["#start", "#organisationen", "#zeugnisse", "#blog"]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `corepack pnpm --filter frontend test SiteHeader`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Write minimal implementation**

Create `frontend/src/components/layout/SkipLink.tsx`:

```tsx
export function SkipLink() {
  return (
    <a className="skip-link" href="#main">
      Zum Inhalt springen
    </a>
  );
}
```

Create `frontend/src/components/layout/SiteHeader.tsx`:

```tsx
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
```

Append to `frontend/src/app/globals.css`:

```css
html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}

body {
  margin: 0;
  background-color: var(--color-bg);
  color: var(--color-fg);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

.skip-link {
  position: absolute;
  left: 0.75rem;
  top: -100px;
  background: var(--color-ink);
  color: var(--color-bone);
  padding: 0.5rem 0.75rem;
  font-family: var(--font-mono);
  z-index: 100;
}

.skip-link:focus {
  top: 0.75rem;
}

.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg);
  padding: var(--space-header-y) var(--space-header-x);
}

.site-header-inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.site-title {
  text-decoration: none;
  color: inherit;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.site-nav ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.site-nav a {
  color: inherit;
  text-decoration: none;
  padding: 0.25rem 0;
}

.site-nav a:hover,
.site-nav a:focus-visible {
  text-decoration: underline;
  text-decoration-color: var(--color-acid);
  text-underline-offset: 0.25em;
}
```

Modify `frontend/src/app/layout.tsx` body:

```tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import { monumentDisplay, monumentMono } from "@/lib/fonts";
import { SiteHeader } from "@/components/layout/SiteHeader";
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
      <body>
        <SiteHeader />
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `corepack pnpm --filter frontend test SiteHeader`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/layout/SkipLink.tsx frontend/src/components/layout/SiteHeader.tsx frontend/tests/components/SiteHeader.test.tsx frontend/src/app/layout.tsx frontend/src/app/globals.css
git commit -m "feat(layout): add skip link and anchor-based site header"
```

---

### Task 4: HeroSection (quiet first draft, no motion yet)

**Files:**

- Create: `frontend/src/components/sections/HeroSection.tsx`
- Create: `frontend/tests/components/HeroSection.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HeroSection } from "@/components/sections/HeroSection";

describe("HeroSection", () => {
  it("renders the poster headline with both lines", () => {
    render(<HeroSection voteDateLabel="Abstimmung Juni 2026" />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toMatch(/zwischen/i);
    expect(h1.textContent).toMatch(/zentral/i);
  });

  it("renders CTA linking to #organisationen", () => {
    render(<HeroSection voteDateLabel="Abstimmung Juni 2026" />);
    const cta = screen.getByRole("link", { name: /organisationen entdecken/i });
    expect(cta).toHaveAttribute("href", "#organisationen");
  });

  it("anchor id is start", () => {
    const { container } = render(<HeroSection voteDateLabel="Abstimmung Juni 2026" />);
    expect(container.querySelector("section#start")).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `corepack pnpm --filter frontend test HeroSection`
Expected: FAIL — missing module.

- [ ] **Step 3: Write minimal implementation**

Create `frontend/src/components/sections/HeroSection.tsx`:

```tsx
type HeroSectionProps = {
  voteDateLabel: string;
};

export function HeroSection({ voteDateLabel }: HeroSectionProps) {
  return (
    <section id="start" aria-labelledby="hero-title" className="section section--hero">
      <p className="mono hero-strap" aria-hidden="true">
        ZWISCHEN&shy;NUTZUNG · ZENTRAL&shy;WÄSCHEREI · ZÜRICH · 2026 →
      </p>
      <p className="mono hero-strap--sr">
        Zwischennutzung Zentralwäscherei, Zürich, 2026.
      </p>
      <h1 id="hero-title" className="display hero-title">
        <span className="hero-title__line">Zwischen&shy;nutzung</span>
        <span className="hero-title__line display--outline">Zentral&shy;wäscherei</span>
      </h1>
      <p className="mono hero-vote" aria-label={voteDateLabel}>
        {voteDateLabel}
      </p>
      <a className="hero-cta mono" href="#organisationen">
        → ORGANISATIONEN ENTDECKEN
      </a>
      <p className="mono hero-scroll" aria-hidden="true">
        SCROLL ↓ 01 / 05
      </p>
    </section>
  );
}
```

Append to `frontend/src/app/globals.css`:

```css
.section {
  padding-block: var(--space-section-y);
  padding-inline: var(--space-header-x);
}

.section--hero {
  min-height: 100svh;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 2rem;
  background: var(--color-bone);
  color: var(--color-ink);
}

.hero-strap {
  overflow: hidden;
  white-space: nowrap;
  opacity: 0.85;
}

.hero-strap--sr {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.hero-title {
  font-size: clamp(3.5rem, 12vw, 12rem);
  margin: 0;
  display: grid;
  gap: 0.15em;
}

.hero-title__line {
  display: block;
}

.hero-cta {
  justify-self: start;
  background: var(--color-ink);
  color: var(--color-bone);
  padding: 0.9rem 1.25rem;
  text-decoration: none;
  letter-spacing: 0.08em;
}

.hero-cta:hover,
.hero-cta:focus-visible {
  text-decoration: underline;
  text-decoration-color: var(--color-acid);
  text-underline-offset: 0.25em;
}

.hero-scroll {
  justify-self: end;
  opacity: 0.7;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `corepack pnpm --filter frontend test HeroSection`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/sections/HeroSection.tsx frontend/tests/components/HeroSection.test.tsx frontend/src/app/globals.css
git commit -m "feat(sections): add poster hero section"
```

---

### Task 5: TextBlockSection variant + IntroSection

**Files:**

- Modify: `frontend/src/components/content/TextBlockSection.tsx`
- Modify: `frontend/tests/components/TextBlockSection.test.tsx`
- Create: `frontend/src/components/sections/IntroSection.tsx`
- Create: `frontend/tests/components/IntroSection.test.tsx`

- [ ] **Step 1: Write the failing test**

Extend `frontend/tests/components/TextBlockSection.test.tsx` with an additional test (keep existing ones):

```tsx
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TextBlockSection } from "@/components/content/TextBlockSection";

describe("TextBlockSection variants", () => {
  it("renders the poster variant class", () => {
    const { container } = render(
      <TextBlockSection
        sectionId="t1"
        variant="poster"
        title="Titel"
        bodyHtml="<p>Body</p>"
      />,
    );
    expect(container.querySelector(".textblock--poster")).not.toBeNull();
  });

  it("renders the quiet variant class by default", () => {
    const { container } = render(
      <TextBlockSection sectionId="t1" title="Titel" bodyHtml="<p>Body</p>" />,
    );
    expect(container.querySelector(".textblock--quiet")).not.toBeNull();
  });
});
```

Create `frontend/tests/components/IntroSection.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { IntroSection } from "@/components/sections/IntroSection";

describe("IntroSection", () => {
  it("renders heading and body", () => {
    render(
      <IntroSection
        title="Ein Haus mit vielen Stimmen"
        bodyHtml="<p>Intro Inhalt.</p>"
      />,
    );
    expect(screen.getByRole("heading", { level: 2, name: /ein haus/i })).toBeInTheDocument();
    expect(screen.getByText(/intro inhalt/i)).toBeInTheDocument();
  });

  it("renders anchor id intro", () => {
    const { container } = render(
      <IntroSection title="t" bodyHtml="<p>b</p>" />,
    );
    expect(container.querySelector("section#intro")).not.toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `corepack pnpm --filter frontend test TextBlockSection IntroSection`
Expected: FAIL — missing variant support and IntroSection module.

- [ ] **Step 3: Write minimal implementation**

Modify `frontend/src/components/content/TextBlockSection.tsx`: add `variant?: "poster" | "quiet"` (default `"quiet"`), and on the root element add `className={`textblock textblock--${variant}`}`. Keep all existing props and logic intact.

```tsx
export type TextBlockVariant = "poster" | "quiet";

export function TextBlockSection(props: TextBlockSectionProps & { variant?: TextBlockVariant }) {
  const variant: TextBlockVariant = props.variant ?? "quiet";
  // ... existing render, wrap root with className={`textblock textblock--${variant}`}
}
```

If the file currently uses inline styles, preserve them; add the className on the outermost container only.

Create `frontend/src/components/sections/IntroSection.tsx`:

```tsx
type IntroSectionProps = {
  title: string;
  bodyHtml: string;
  ctaLabel?: string;
  ctaUrl?: string;
};

export function IntroSection({ title, bodyHtml, ctaLabel, ctaUrl }: IntroSectionProps) {
  return (
    <section id="intro" aria-labelledby="intro-title" className="section section--intro">
      <div className="intro-grid">
        <p className="mono intro-meta" aria-hidden="true">
          02 — INTRO
        </p>
        <h2 id="intro-title" className="display intro-title">
          {title}
        </h2>
        <div
          className="intro-body"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
        {ctaUrl && ctaLabel ? (
          <a className="intro-cta mono" href={ctaUrl}>
            {ctaLabel} →
          </a>
        ) : null}
      </div>
    </section>
  );
}
```

Append minimal styles to `globals.css`:

```css
.section--intro {
  background: var(--color-bone);
  color: var(--color-ink);
}

.intro-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--grid-gutter);
  max-width: var(--grid-max);
  margin-inline: auto;
}

.intro-meta {
  grid-column: 1 / span 1;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  opacity: 0.7;
}

.intro-title {
  grid-column: 2 / span 6;
  font-size: clamp(2.25rem, 6vw, 5rem);
  margin: 0;
}

.intro-body {
  grid-column: 7 / span 5;
  line-height: 1.6;
  font-size: 1.0625rem;
}

.intro-cta {
  grid-column: 2 / span 10;
  justify-self: start;
  padding: 0.75rem 1rem;
  background: var(--color-ink);
  color: var(--color-bone);
  text-decoration: none;
}

@media (max-width: 768px) {
  .intro-meta { display: none; }
  .intro-title, .intro-body, .intro-cta { grid-column: 1 / -1; }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `corepack pnpm --filter frontend test TextBlockSection IntroSection`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/content/TextBlockSection.tsx frontend/tests/components/TextBlockSection.test.tsx frontend/src/components/sections/IntroSection.tsx frontend/tests/components/IntroSection.test.tsx frontend/src/app/globals.css
git commit -m "feat(sections): add intro section and textblock variants"
```

---

### Task 6: FloorSelect non-map fallback

**Files:**

- Create: `frontend/src/components/map/FloorSelect.tsx`
- Create: `frontend/tests/components/FloorSelect.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { FloorSelect } from "@/components/map/FloorSelect";

const zones = [
  { id: "eg", label: "Erdgeschoss" },
  { id: "og1", label: "1. Obergeschoss" },
];

describe("FloorSelect", () => {
  it("renders zones as options plus an 'all' entry", () => {
    render(<FloorSelect zones={zones} selectedZoneId={null} onChange={() => {}} />);
    expect(screen.getByRole("option", { name: /alle bereiche/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /erdgeschoss/i })).toBeInTheDocument();
  });

  it("calls onChange with the selected zone id", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FloorSelect zones={zones} selectedZoneId={null} onChange={onChange} />);
    await user.selectOptions(screen.getByRole("combobox", { name: /bereich/i }), "og1");
    expect(onChange).toHaveBeenCalledWith("og1");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `corepack pnpm --filter frontend test FloorSelect`
Expected: FAIL — missing module.

- [ ] **Step 3: Write minimal implementation**

```tsx
type Zone = { id: string; label: string };

type FloorSelectProps = {
  zones: Zone[];
  selectedZoneId: string | null;
  onChange: (zoneId: string | null) => void;
};

export function FloorSelect({ zones, selectedZoneId, onChange }: FloorSelectProps) {
  return (
    <label className="mono floor-select">
      <span className="floor-select__label">Bereich</span>
      <select
        className="floor-select__input"
        value={selectedZoneId ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? null : e.target.value)}
      >
        <option value="">ALLE BEREICHE</option>
        {zones.map((z) => (
          <option key={z.id} value={z.id}>
            {z.label.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}
```

Append to `globals.css`:

```css
.floor-select {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid currentColor;
  padding: 0.5rem 0.75rem;
}

.floor-select__label {
  font-size: 0.75rem;
  letter-spacing: 0.08em;
}

.floor-select__input {
  background: transparent;
  color: inherit;
  border: 0;
  font: inherit;
  padding: 0.25rem 0.5rem;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `corepack pnpm --filter frontend test FloorSelect`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/map/FloorSelect.tsx frontend/tests/components/FloorSelect.test.tsx frontend/src/app/globals.css
git commit -m "feat(map): add floor-select keyboard fallback"
```

---

### Task 7: OrganisationsSection (merged map + list)

**Files:**

- Create: `frontend/src/components/sections/OrganisationsSection.tsx`
- Create: `frontend/tests/components/OrganisationsSection.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { OrganisationsSection } from "@/components/sections/OrganisationsSection";
import type { Organisation } from "@/lib/cms/types";

const orgs: Organisation[] = [
  {
    id: "a", slug: "a", name: "A", shortDescription: "A desc",
    websiteUrl: "https://example.org/a",
    floorArea: { id: "eg", name: "Erdgeschoss", slug: "eg", svgZoneId: "eg", sortOrder: 1 },
    logoOrImage: null, isFeatured: false, categoryTags: [],
  },
  {
    id: "b", slug: "b", name: "B", shortDescription: "B desc",
    websiteUrl: "https://example.org/b",
    floorArea: { id: "og1", name: "1. OG", slug: "og1", svgZoneId: "og1", sortOrder: 2 },
    logoOrImage: null, isFeatured: false, categoryTags: [],
  },
];

describe("OrganisationsSection", () => {
  it("renders all orgs when no zone selected", () => {
    render(<OrganisationsSection organisations={orgs} initialZoneId={null} />);
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("filters via FloorSelect change", async () => {
    const user = userEvent.setup();
    render(<OrganisationsSection organisations={orgs} initialZoneId={null} />);
    await user.selectOptions(screen.getByRole("combobox", { name: /bereich/i }), "og1");
    expect(screen.queryByText("A")).not.toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("shows empty-state copy when nothing matches", async () => {
    const user = userEvent.setup();
    render(<OrganisationsSection organisations={[orgs[0]]} initialZoneId={null} />);
    await user.selectOptions(screen.getByRole("combobox", { name: /bereich/i }), "og1");
    expect(screen.getByText(/keine organisationen/i)).toBeInTheDocument();
  });

  it("applies initialZoneId on mount", () => {
    render(<OrganisationsSection organisations={orgs} initialZoneId="eg" />);
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.queryByText("B")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `corepack pnpm --filter frontend test OrganisationsSection`
Expected: FAIL — missing module.

- [ ] **Step 3: Write minimal implementation**

```tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { FloorSelect } from "@/components/map/FloorSelect";
import { HouseMap, getHouseMapZoneLabel } from "@/components/map/HouseMap";
import { OrganisationList } from "@/components/organisations/OrganisationList";
import type { Organisation } from "@/lib/cms/types";
import { byFloorArea } from "@/lib/filter/byFloorArea";

type Props = {
  organisations: Organisation[];
  initialZoneId: string | null;
};

export function OrganisationsSection({ organisations, initialZoneId }: Props) {
  const [zone, setZone] = useState<string | null>(initialZoneId);
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    const params = new URLSearchParams(window.location.search);
    if (zone) params.set("zone", zone);
    else params.delete("zone");
    const qs = params.toString();
    const url = `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash || "#organisationen"}`;
    window.history.replaceState(null, "", url);
  }, [zone]);

  const filtered = useMemo(() => byFloorArea(organisations, zone), [organisations, zone]);
  const zones = useMemo(() => {
    const map = new Map<string, { id: string; label: string }>();
    organisations.forEach((o) => {
      if (!map.has(o.floorArea.svgZoneId)) {
        map.set(o.floorArea.svgZoneId, { id: o.floorArea.svgZoneId, label: o.floorArea.name });
      }
    });
    return [...map.values()].sort((a, b) => a.label.localeCompare(b.label, "de"));
  }, [organisations]);

  const label = getHouseMapZoneLabel(zone);

  return (
    <section id="organisationen" aria-labelledby="org-title" className="section section--org">
      <div className="org-header">
        <p className="mono org-header__number" aria-hidden="true">03 / HAUS</p>
        <h2 id="org-title" className="display display--outline org-header__title">
          Organisationen
        </h2>
        <div className="org-header__chip mono" aria-live="polite">
          {zone ? (
            <>
              ZONE: {label ?? zone}{" "}
              <button type="button" aria-label="Filter entfernen" onClick={() => setZone(null)}>✕</button>
            </>
          ) : (
            "ALLE"
          )}
        </div>
      </div>

      <div className="org-body">
        <div className="org-map">
          <FloorSelect zones={zones} selectedZoneId={zone} onChange={setZone} />
          <HouseMap onSelect={setZone} selectedZoneId={zone} />
        </div>
        <div className="org-list">
          {filtered.length === 0 ? (
            <p className="mono org-empty">
              KEINE ORGANISATIONEN IN DIESEM BEREICH —{" "}
              <button type="button" onClick={() => setZone(null)}>ALLE ANZEIGEN →</button>
            </p>
          ) : (
            <OrganisationList organisations={filtered} />
          )}
        </div>
      </div>
    </section>
  );
}
```

Append section CSS:

```css
.section--org {
  background: var(--color-acid);
  color: var(--color-ink);
}

.org-header {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.org-header__number { justify-self: start; }
.org-header__chip { justify-self: end; }
.org-header__title {
  font-size: clamp(2.5rem, 8vw, 8rem);
  margin: 0;
  text-align: center;
  color: var(--color-ink);
}

.org-body {
  display: grid;
  grid-template-columns: 7fr 5fr;
  gap: 2rem;
  max-width: var(--grid-max);
  margin-inline: auto;
}

.org-empty button {
  background: transparent;
  border: 0;
  color: inherit;
  text-decoration: underline;
  font: inherit;
  padding: 0;
  cursor: pointer;
}

@media (max-width: 900px) {
  .org-body { grid-template-columns: 1fr; }
  .org-header { grid-template-columns: 1fr; text-align: center; }
  .org-header__number, .org-header__chip { justify-self: center; }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `corepack pnpm --filter frontend test OrganisationsSection`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/sections/OrganisationsSection.tsx frontend/tests/components/OrganisationsSection.test.tsx frontend/src/app/globals.css
git commit -m "feat(sections): compose organisations and house map into one section"
```

---

### Task 8: ZeugnisseSection with deterministic rotation

**Files:**

- Create: `frontend/src/components/sections/ZeugnisseSection.tsx`
- Create: `frontend/tests/components/ZeugnisseSection.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ZeugnisseSection, type SectionTestimony } from "@/components/sections/ZeugnisseSection";

const testimonies: SectionTestimony[] = [
  { id: "1", quote: "Erstes Zitat", displayLabel: "Anwohnerin", isApproved: true },
  { id: "2", quote: "Zweites Zitat", displayLabel: "Kulturarbeiter", isApproved: true },
  { id: "3", quote: "Nicht freigegeben", displayLabel: "X", isApproved: false },
];

describe("ZeugnisseSection", () => {
  it("renders the first approved testimony as the opener", () => {
    render(<ZeugnisseSection testimonies={testimonies} introHtml="<p>i</p>" />);
    expect(screen.getByText(/erstes zitat/i)).toBeInTheDocument();
  });

  it("hides non-approved testimonies", () => {
    render(<ZeugnisseSection testimonies={testimonies} introHtml="<p>i</p>" />);
    expect(screen.queryByText(/nicht freigegeben/i)).not.toBeInTheDocument();
  });

  it("assigns deterministic rotation classes to cards", () => {
    const { container } = render(<ZeugnisseSection testimonies={testimonies} introHtml="<p>i</p>" />);
    const cards = container.querySelectorAll("[data-rot]");
    expect(cards.length).toBeGreaterThan(0);
    const rotations = Array.from(cards).map((c) => c.getAttribute("data-rot"));
    expect(new Set(rotations).size).toBeGreaterThan(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `corepack pnpm --filter frontend test ZeugnisseSection`
Expected: FAIL.

- [ ] **Step 3: Write minimal implementation**

```tsx
export type SectionTestimony = {
  id: string;
  quote: string;
  displayLabel: string;
  isApproved: boolean;
};

const ROTATIONS = [-2, 0, 2, -1, 1];

type Props = { testimonies: SectionTestimony[]; introHtml: string };

export function ZeugnisseSection({ testimonies, introHtml }: Props) {
  const approved = testimonies.filter((t) => t.isApproved);
  const [opener, ...rest] = approved;

  return (
    <section id="zeugnisse" aria-labelledby="zeug-title" className="section section--zeug">
      <p className="mono zeug-lede" dangerouslySetInnerHTML={{ __html: introHtml }} />
      <h2 id="zeug-title" className="sr-only">Zeugnisse</h2>
      {opener ? (
        <blockquote className="zeug-opener display">
          {opener.quote}
          <cite className="mono zeug-cite">— {opener.displayLabel.toUpperCase()}</cite>
        </blockquote>
      ) : (
        <p className="mono">Noch keine freigegebenen Zeugnisse.</p>
      )}
      <ul className="zeug-grid">
        {rest.map((t, i) => (
          <li
            key={t.id}
            data-rot={ROTATIONS[i % ROTATIONS.length]}
            className="zeug-card"
          >
            <p className="zeug-card__quote">{t.quote}</p>
            <p className="mono zeug-card__cite">— {t.displayLabel.toUpperCase()}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

Append CSS:

```css
.section--zeug {
  background: var(--color-cobalt);
  color: var(--color-bone);
}

.zeug-lede { opacity: 0.8; margin-bottom: 1.5rem; }
.sr-only {
  position: absolute;
  width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}
.zeug-opener {
  font-size: clamp(2rem, 6vw, 5rem);
  max-width: 80ch; margin: 0 0 3rem;
}
.zeug-cite { display: block; margin-top: 1rem; opacity: 0.8; }

.zeug-grid {
  list-style: none; margin: 0; padding: 0;
  display: grid; grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
  gap: 2rem;
}

.zeug-card {
  background: transparent;
  border: 1px solid var(--color-bone);
  padding: 1.25rem;
}

.zeug-card[data-rot="-2"] { transform: rotate(-2deg); }
.zeug-card[data-rot="-1"] { transform: rotate(-1deg); }
.zeug-card[data-rot="0"] { transform: rotate(0); }
.zeug-card[data-rot="1"] { transform: rotate(1deg); }
.zeug-card[data-rot="2"] { transform: rotate(2deg); }

@media (prefers-reduced-motion: reduce) {
  .zeug-card[data-rot] { transform: none; }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `corepack pnpm --filter frontend test ZeugnisseSection`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/sections/ZeugnisseSection.tsx frontend/tests/components/ZeugnisseSection.test.tsx frontend/src/app/globals.css
git commit -m "feat(sections): add cobalt zeugnisse section with deterministic rotations"
```

---

### Task 9: BlogTeaserSection

**Files:**

- Create: `frontend/src/components/sections/BlogTeaserSection.tsx`
- Create: `frontend/tests/components/BlogTeaserSection.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BlogTeaserSection } from "@/components/sections/BlogTeaserSection";

const posts = [
  { id: 1, slug: "a", title: "A", excerpt: "a ex", publishDate: "2026-03-01", authorName: "Jo", publishedAt: "2026-03-01" },
  { id: 2, slug: "b", title: "B", excerpt: "b ex", publishDate: "2026-03-02", authorName: "Jo", publishedAt: "2026-03-02" },
  { id: 3, slug: "c", title: "C", excerpt: "c ex", publishDate: "2026-03-03", authorName: "Jo", publishedAt: "2026-03-03" },
  { id: 4, slug: "d", title: "D", excerpt: "d ex", publishDate: "2026-03-04", authorName: "Jo", publishedAt: "2026-03-04" },
];

describe("BlogTeaserSection", () => {
  it("renders at most 3 cards, each linking to /blog/[slug]", () => {
    render(<BlogTeaserSection posts={posts} />);
    const links = screen.getAllByRole("link").filter((l) => l.getAttribute("href")?.startsWith("/blog/"));
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute("href", "/blog/a");
  });

  it("shows the empty-state copy when no posts exist", () => {
    render(<BlogTeaserSection posts={[]} />);
    expect(screen.getByText(/noch keine beitraege/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `corepack pnpm --filter frontend test BlogTeaserSection`
Expected: FAIL — missing module.

- [ ] **Step 3: Write minimal implementation**

```tsx
import Link from "next/link";

import type { BlogPost } from "@/lib/cms/types";

type Props = { posts: BlogPost[] };

function formatDate(iso?: string | null) {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("de-CH", { dateStyle: "medium" }).format(new Date(iso));
  } catch {
    return "";
  }
}

export function BlogTeaserSection({ posts }: Props) {
  const top = [...posts]
    .sort((a, b) => (b.publishDate ?? b.publishedAt ?? "").localeCompare(a.publishDate ?? a.publishedAt ?? ""))
    .slice(0, 3);

  return (
    <section id="blog" aria-labelledby="blog-title" className="section section--blog">
      <div className="blog-header">
        <p className="mono" aria-hidden="true">04 / BLOG</p>
        <h2 id="blog-title" className="display blog-title">Neuigkeiten</h2>
      </div>
      {top.length === 0 ? (
        <p className="mono">NOCH KEINE BEITRAEGE — BALD MEHR.</p>
      ) : (
        <div className="blog-grid">
          {top.map((post) => (
            <Link key={String(post.id)} className="blog-card" href={`/blog/${post.slug}`}>
              <p className="mono blog-card__meta">{formatDate(post.publishDate ?? post.publishedAt)}</p>
              <h3 className="display blog-card__title">{post.title}</h3>
              <p className="blog-card__excerpt">{post.excerpt}</p>
              <span className="mono blog-card__cta" aria-hidden="true">ZUM BEITRAG →</span>
            </Link>
          ))}
        </div>
      )}
      <hr className="blog-rule" />
      <p className="mono blog-footnote">WEITERE BEITRAEGE FOLGEN</p>
    </section>
  );
}
```

Append CSS:

```css
.section--blog { background: var(--color-bone); color: var(--color-ink); }

.blog-header {
  display: flex; justify-content: space-between; align-items: baseline;
  margin-bottom: 2rem;
}
.blog-title { font-size: clamp(2.25rem, 6vw, 5rem); margin: 0; }

.blog-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem;
}
.blog-card {
  display: grid; gap: 0.75rem;
  padding: 1.5rem; border: 1px solid var(--color-ink);
  color: inherit; text-decoration: none; background: var(--color-bone);
}
.blog-card:hover .blog-card__title,
.blog-card:focus-visible .blog-card__title {
  text-decoration: underline;
  text-decoration-color: var(--color-acid);
  text-underline-offset: 0.25em;
}

.blog-card__title { font-size: 2rem; margin: 0; }
.blog-rule { border: 0; border-top: 1px solid var(--color-ink); margin: 3rem 0 1rem; }
.blog-footnote { letter-spacing: 0.08em; opacity: 0.75; }

@media (max-width: 900px) {
  .blog-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 600px) {
  .blog-grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `corepack pnpm --filter frontend test BlogTeaserSection`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/sections/BlogTeaserSection.tsx frontend/tests/components/BlogTeaserSection.test.tsx frontend/src/app/globals.css
git commit -m "feat(sections): add blog teaser with latest three posts"
```

---

### Task 10: SiteFooter

**Files:**

- Create: `frontend/src/components/layout/SiteFooter.tsx`
- Create: `frontend/tests/components/SiteFooter.test.tsx`
- Modify: `frontend/src/app/layout.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SiteFooter } from "@/components/layout/SiteFooter";

describe("SiteFooter", () => {
  it("renders KOLOFON headline", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("heading", { name: /kolofon/i })).toBeInTheDocument();
  });

  it("links to Impressum and Datenschutz", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("link", { name: /impressum/i })).toHaveAttribute("href", "/impressum");
    expect(screen.getByRole("link", { name: /datenschutz/i })).toHaveAttribute("href", "/datenschutz");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `corepack pnpm --filter frontend test SiteFooter`
Expected: FAIL.

- [ ] **Step 3: Write minimal implementation**

```tsx
export function SiteFooter() {
  return (
    <footer className="site-footer mono" aria-labelledby="footer-title">
      <div className="site-footer__inner">
        <h2 id="footer-title" className="display site-footer__title">KOLOFON</h2>
        <div className="site-footer__columns">
          <section>
            <h3>KONTAKT</h3>
            <p>Zwischennutzung Zentralwäscherei<br />Zürich, 2026</p>
          </section>
          <section>
            <h3>LINKS</h3>
            <ul>
              <li><a href="/impressum">Impressum</a></li>
              <li><a href="/datenschutz">Datenschutz</a></li>
              <li><a href="https://github.com/zentralwaescherei/zwischennutzung-zentralwaescherei" rel="noreferrer">GitHub</a></li>
            </ul>
          </section>
          <section>
            <h3>ABSTIMMUNG</h3>
            <p>Juni 2026</p>
          </section>
        </div>
        <p className="site-footer__credit">© 2026 ZWISCHEN-NUTZUNG ZENTRAL-WAESCHEREI · GEBAUT MIT NEO-POSTER</p>
      </div>
    </footer>
  );
}
```

Append CSS:

```css
.site-footer {
  background: var(--color-ink);
  color: var(--color-bone);
  padding: var(--space-section-y) var(--space-header-x) 2rem;
}
.site-footer__inner { max-width: var(--grid-max); margin-inline: auto; }
.site-footer__title { font-size: clamp(3rem, 10vw, 9rem); margin: 0 0 2rem; color: var(--color-bone); }
.site-footer__columns { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
.site-footer__columns h3 { letter-spacing: 0.08em; margin: 0 0 0.5rem; }
.site-footer__columns ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.25rem; }
.site-footer__columns a { color: inherit; text-decoration: underline; text-decoration-color: var(--color-acid); }
.site-footer__credit { margin-top: 3rem; opacity: 0.7; }
@media (max-width: 900px) { .site-footer__columns { grid-template-columns: 1fr; } }
```

Modify `frontend/src/app/layout.tsx` to include the footer after `<main>`:

```tsx
import { SiteFooter } from "@/components/layout/SiteFooter";

// ... inside <body>
<SiteHeader />
<main id="main">{children}</main>
<SiteFooter />
```

- [ ] **Step 4: Run test to verify it passes**

Run: `corepack pnpm --filter frontend test SiteFooter`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/layout/SiteFooter.tsx frontend/tests/components/SiteFooter.test.tsx frontend/src/app/layout.tsx frontend/src/app/globals.css
git commit -m "feat(layout): add ink kolofon footer"
```

---

### Task 11: Compose one-pager on `/`

**Files:**

- Modify: `frontend/src/app/page.tsx`
- Modify: `frontend/tests/unit/homePage.test.tsx`

- [ ] **Step 1: Write the failing test**

Replace `frontend/tests/unit/homePage.test.tsx` with:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "@/app/page";

describe("HomePage (one-pager)", () => {
  it("renders all five anchor sections in order", () => {
    const { container } = render(<HomePage />);
    const ids = Array.from(container.querySelectorAll("section[id]")).map((s) => s.id);
    expect(ids).toEqual(["start", "intro", "organisationen", "zeugnisse", "blog"]);
  });

  it("shows hero headline", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `corepack pnpm --filter frontend test homePage`
Expected: FAIL — current page does not compose all sections.

- [ ] **Step 3: Write minimal implementation**

Replace `frontend/src/app/page.tsx`:

```tsx
import { HeroSection } from "@/components/sections/HeroSection";
import { IntroSection } from "@/components/sections/IntroSection";
import { OrganisationsSection } from "@/components/sections/OrganisationsSection";
import { ZeugnisseSection } from "@/components/sections/ZeugnisseSection";
import { BlogTeaserSection } from "@/components/sections/BlogTeaserSection";
import { allBlogPosts } from "@/lib/blog/samplePosts";
import { filterPublishedPosts } from "@/lib/cms/types";
import type { Organisation } from "@/lib/cms/types";

export const revalidate = 300;

const sampleOrganisations: Organisation[] = [
  // Temporary seed data reused from the previous /organisationen/page.tsx
  // Replace with a CMS fetch once Task 20 wires ISR to Strapi.
  {
    id: "werkstatt", slug: "werkstatt", name: "Werkstatt",
    shortDescription: "Offene Infrastruktur fuer gemeinsames Reparieren, Bauen und experimentelles Lernen.",
    websiteUrl: "https://example.org/werkstatt",
    categoryTags: ["Werkstatt", "Offen"],
    floorArea: { id: "eg", name: "Erdgeschoss", slug: "eg", svgZoneId: "eg", sortOrder: 1 },
    logoOrImage: null, isFeatured: true,
  },
  {
    id: "radio", slug: "radio", name: "Radio Zentral",
    shortDescription: "Community-Redaktion fuer lokale Stimmen, Workshops und niedrigschwellige Medienpraxis.",
    websiteUrl: "https://example.org/radio-zentral",
    categoryTags: ["Medien", "Community"],
    floorArea: { id: "og1", name: "1. Obergeschoss", slug: "og1", svgZoneId: "og1", sortOrder: 2 },
    logoOrImage: null, isFeatured: false,
  },
  {
    id: "kueche", slug: "kueche", name: "Kollektivkueche",
    shortDescription: "Gemeinsame Kochformate, nachbarschaftliche Treffen und Sorgearbeit rund um den Alltag im Haus.",
    websiteUrl: "https://example.org/kollektivkueche",
    categoryTags: ["Nachbarschaft", "Sorge"],
    floorArea: { id: "og2", name: "2. Obergeschoss", slug: "og2", svgZoneId: "og2", sortOrder: 3 },
    logoOrImage: null, isFeatured: false,
  },
];

const sampleTestimonies = [
  { id: "t1", quote: "Die Wäscherei gibt uns einen Ort, den wir sonst nicht hätten.", displayLabel: "Anwohnerin", isApproved: true },
  { id: "t2", quote: "Hier entsteht Nachbarschaft jenseits der reinen Nutzbarkeit.", displayLabel: "Kulturarbeiter", isApproved: true },
];

export default function HomePage() {
  const posts = filterPublishedPosts(allBlogPosts);

  return (
    <>
      <HeroSection voteDateLabel="Abstimmung Juni 2026" />
      <IntroSection
        title="Ein Haus mit vielen Stimmen"
        bodyHtml="<p>Die Zwischennutzung Zentralwaescherei oeffnet Raum fuer Werkstatt, Medien, Nachbarschaft und Kultur — mitten in Zuerich.</p>"
        ctaLabel="Organisationen entdecken"
        ctaUrl="#organisationen"
      />
      <OrganisationsSection organisations={sampleOrganisations} initialZoneId={null} />
      <ZeugnisseSection
        testimonies={sampleTestimonies}
        introHtml="<p>Persoenliche Stimmen zur Bedeutung des Ortes.</p>"
      />
      <BlogTeaserSection posts={posts} />
    </>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `corepack pnpm --filter frontend test` (all suites)
Expected: all passing, including `homePage`.

Also run: `corepack pnpm --filter frontend exec tsc --noEmit`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/app/page.tsx frontend/tests/unit/homePage.test.tsx
git commit -m "feat(home): compose neo-poster one-pager"
```

---

### Task 12: 308 redirects for legacy routes

**Files:**

- Modify: `frontend/src/app/organisationen/page.tsx`
- Modify: `frontend/src/app/zeugnisse/page.tsx`
- Modify: `frontend/src/app/blog/page.tsx`
- Create: `frontend/tests/unit/redirects.test.ts`

- [ ] **Step 1: Write the failing test**

Create `frontend/tests/unit/redirects.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => {
  return {
    permanentRedirect: (to: string) => {
      throw new Error(`REDIRECT:${to}`);
    },
  };
});

describe("legacy route redirects", () => {
  it("/organisationen redirects to /#organisationen", async () => {
    const mod = await import("@/app/organisationen/page");
    expect(() => (mod.default as () => unknown)()).toThrow("REDIRECT:/#organisationen");
  });

  it("/zeugnisse redirects to /#zeugnisse", async () => {
    const mod = await import("@/app/zeugnisse/page");
    expect(() => (mod.default as () => unknown)()).toThrow("REDIRECT:/#zeugnisse");
  });

  it("/blog redirects to /#blog", async () => {
    const mod = await import("@/app/blog/page");
    expect(() => (mod.default as () => unknown)()).toThrow("REDIRECT:/#blog");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `corepack pnpm --filter frontend test redirects`
Expected: FAIL — pages currently render content, not redirect.

- [ ] **Step 3: Write minimal implementation**

Replace each legacy page file:

`frontend/src/app/organisationen/page.tsx`:

```tsx
import { permanentRedirect } from "next/navigation";

export default function Page(): never {
  permanentRedirect("/#organisationen");
}
```

`frontend/src/app/zeugnisse/page.tsx`:

```tsx
import { permanentRedirect } from "next/navigation";

export default function Page(): never {
  permanentRedirect("/#zeugnisse");
}
```

`frontend/src/app/blog/page.tsx`:

```tsx
import { permanentRedirect } from "next/navigation";

export default function Page(): never {
  permanentRedirect("/#blog");
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `corepack pnpm --filter frontend test redirects`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/app/organisationen/page.tsx frontend/src/app/zeugnisse/page.tsx frontend/src/app/blog/page.tsx frontend/tests/unit/redirects.test.ts
git commit -m "feat(routes): 308 redirect legacy routes to one-pager anchors"
```

---

### Task 13: Reveal component (IntersectionObserver)

**Files:**

- Create: `frontend/src/lib/useMatchMedia.ts`
- Create: `frontend/src/components/motion/Reveal.tsx`
- Create: `frontend/tests/components/Reveal.test.tsx`
- Modify: `frontend/src/app/globals.css`

- [ ] **Step 1: Write the failing test**

```tsx
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Reveal } from "@/components/motion/Reveal";

describe("Reveal", () => {
  it("renders children and adds a data-reveal attribute", () => {
    const { container } = render(<Reveal><p>child</p></Reveal>);
    expect(container.querySelector("[data-reveal]")).not.toBeNull();
  });

  it("is visible immediately when reduced motion is preferred", () => {
    const mql = {
      matches: true,
      media: "(prefers-reduced-motion: reduce)",
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    vi.stubGlobal("matchMedia", () => mql);
    const { container } = render(<Reveal><p>c</p></Reveal>);
    expect(container.querySelector("[data-reveal='in']")).not.toBeNull();
    vi.unstubAllGlobals();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `corepack pnpm --filter frontend test Reveal`
Expected: FAIL.

- [ ] **Step 3: Write minimal implementation**

`frontend/src/lib/useMatchMedia.ts`:

```ts
"use client";

import { useEffect, useState } from "react";

export function useMatchMedia(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
```

`frontend/src/components/motion/Reveal.tsx`:

```tsx
"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { useMatchMedia } from "@/lib/useMatchMedia";

type Props = { children: ReactNode; rootMargin?: string; threshold?: number };

export function Reveal({ children, rootMargin = "0px 0px -10% 0px", threshold = 0.2 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useMatchMedia("(prefers-reduced-motion: reduce)");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduced) { setVisible(true); return; }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
        });
      },
      { rootMargin, threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduced, rootMargin, threshold]);

  return (
    <div ref={ref} data-reveal={visible ? "in" : "out"}>
      {children}
    </div>
  );
}
```

Append CSS:

```css
[data-reveal="out"] { opacity: 0; transform: translateY(16px); }
[data-reveal="in"]  { opacity: 1; transform: none; transition: opacity 450ms cubic-bezier(0.2,0.8,0.2,1), transform 450ms cubic-bezier(0.2,0.8,0.2,1); }

@media (prefers-reduced-motion: reduce) {
  [data-reveal="out"] { opacity: 0; transform: none; }
  [data-reveal="in"]  { transition: opacity 0.01ms linear; }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `corepack pnpm --filter frontend test Reveal`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/lib/useMatchMedia.ts frontend/src/components/motion/Reveal.tsx frontend/tests/components/Reveal.test.tsx frontend/src/app/globals.css
git commit -m "feat(motion): add reveal-on-scroll primitive"
```

---

### Task 14: Marquee + hero strap

**Files:**

- Create: `frontend/src/components/motion/Marquee.tsx`
- Create: `frontend/tests/components/Marquee.test.tsx`
- Modify: `frontend/src/components/sections/HeroSection.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Marquee } from "@/components/motion/Marquee";

describe("Marquee", () => {
  it("renders the text twice to enable a seamless loop", () => {
    const { container } = render(<Marquee text="HELLO" />);
    const spans = container.querySelectorAll(".marquee__track > span");
    expect(spans).toHaveLength(2);
    expect(spans[0]).toHaveTextContent("HELLO");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `corepack pnpm --filter frontend test Marquee`
Expected: FAIL.

- [ ] **Step 3: Write minimal implementation**

```tsx
type Props = { text: string; seconds?: number };

export function Marquee({ text, seconds = 40 }: Props) {
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track" style={{ animationDuration: `${seconds}s` }}>
        <span>{text}</span>
        <span>{text}</span>
      </div>
    </div>
  );
}
```

Append to `globals.css`:

```css
.marquee { overflow: hidden; white-space: nowrap; }
.marquee__track { display: inline-flex; gap: 4rem; animation: marquee linear infinite; }
.marquee__track > span { font-family: var(--font-mono); letter-spacing: 0.1em; }
.marquee:hover .marquee__track,
.marquee:focus-within .marquee__track { animation-play-state: paused; }

@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

@media (prefers-reduced-motion: reduce) {
  .marquee__track { animation: none; }
}
```

Update `HeroSection.tsx` to use `<Marquee text="ZWISCHEN-NUTZUNG · ZENTRAL-WAESCHEREI · ZUERICH · 2026 →" />` in place of the decorative `.hero-strap`. Keep the `.hero-strap--sr` visually-hidden static line for screen readers.

- [ ] **Step 4: Run test to verify it passes**

Run: `corepack pnpm --filter frontend test Marquee HeroSection`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/motion/Marquee.tsx frontend/tests/components/Marquee.test.tsx frontend/src/app/globals.css frontend/src/components/sections/HeroSection.tsx
git commit -m "feat(motion): add marquee strap with pause on hover"
```

---

### Task 15: Scramble primitive + hero wiring

**Files:**

- Create: `frontend/src/components/motion/Scramble.tsx`
- Create: `frontend/tests/components/Scramble.test.tsx`
- Modify: `frontend/src/components/sections/HeroSection.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Scramble } from "@/components/motion/Scramble";

describe("Scramble", () => {
  it("eventually renders the target text", async () => {
    vi.useFakeTimers();
    render(<Scramble text="HALLO" durationMs={100} />);
    vi.advanceTimersByTime(200);
    expect(await screen.findByText("HALLO")).toBeInTheDocument();
    vi.useRealTimers();
  });

  it("renders the target immediately when reduced motion is preferred", () => {
    const mql = {
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      media: "(prefers-reduced-motion: reduce)",
    };
    vi.stubGlobal("matchMedia", () => mql);
    render(<Scramble text="HI" durationMs={10000} />);
    expect(screen.getByText("HI")).toBeInTheDocument();
    vi.unstubAllGlobals();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `corepack pnpm --filter frontend test Scramble`
Expected: FAIL.

- [ ] **Step 3: Write minimal implementation**

```tsx
"use client";

import { useEffect, useState } from "react";

import { useMatchMedia } from "@/lib/useMatchMedia";

type Props = { text: string; durationMs?: number };

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789▚▜▌";

function randomChar() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

export function Scramble({ text, durationMs = 600 }: Props) {
  const reduced = useMatchMedia("(prefers-reduced-motion: reduce)");
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (reduced) { setDisplay(text); return; }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / durationMs);
      const revealUntil = Math.floor(p * text.length);
      const next = Array.from(text)
        .map((ch, i) => (i < revealUntil || ch === " " ? ch : randomChar()))
        .join("");
      setDisplay(next);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setDisplay(text);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, durationMs, reduced]);

  return <span data-scramble>{display}</span>;
}
```

Update `HeroSection.tsx` — wrap the second headline line with `<Scramble text="Zentral-waescherei" />` once per session (use `sessionStorage` to gate repeats; if flag already set, render text directly).

```tsx
import { Scramble } from "@/components/motion/Scramble";
// ...
const [scrambleAllowed, setScrambleAllowed] = useState(false);

useEffect(() => {
  const done = sessionStorage.getItem("zw-hero-scrambled");
  if (!done) {
    setScrambleAllowed(true);
    sessionStorage.setItem("zw-hero-scrambled", "1");
  }
}, []);
// ...
<span className="hero-title__line display--outline">
  {scrambleAllowed ? <Scramble text="Zentralwaescherei" /> : "Zentralwaescherei"}
</span>
```

Mark `HeroSection` `"use client"` if not already.

- [ ] **Step 4: Run test to verify it passes**

Run: `corepack pnpm --filter frontend test Scramble HeroSection`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/motion/Scramble.tsx frontend/tests/components/Scramble.test.tsx frontend/src/components/sections/HeroSection.tsx
git commit -m "feat(motion): scramble hero word once per session"
```

---

### Task 16: ActiveFilterChip with FLIP + Framer Motion install

**Files:**

- Modify: `frontend/package.json` (add `framer-motion`)
- Create: `frontend/src/components/motion/ActiveFilterChip.tsx`
- Create: `frontend/tests/components/ActiveFilterChip.test.tsx`
- Modify: `frontend/src/components/sections/OrganisationsSection.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ActiveFilterChip } from "@/components/motion/ActiveFilterChip";

describe("ActiveFilterChip", () => {
  it("shows zone label and a clear button", async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    render(<ActiveFilterChip label="KELLER" onClear={onClear} />);
    expect(screen.getByText(/zone:/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /filter entfernen/i }));
    expect(onClear).toHaveBeenCalledOnce();
  });

  it("falls back to ALLE when label is null", () => {
    render(<ActiveFilterChip label={null} onClear={() => {}} />);
    expect(screen.getByText("ALLE")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Install dep, then run test:

```bash
corepack pnpm --filter frontend add framer-motion
corepack pnpm --filter frontend test ActiveFilterChip
```

Expected: FAIL — module does not exist.

- [ ] **Step 3: Write minimal implementation**

```tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";

type Props = { label: string | null; onClear: () => void };

export function ActiveFilterChip({ label, onClear }: Props) {
  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        key={label ?? "alle"}
        layout
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 4 }}
        transition={{ duration: 0.22 }}
        className="chip mono"
      >
        {label ? (
          <>
            <span>ZONE: {label}</span>
            <button type="button" aria-label="Filter entfernen" onClick={onClear}>✕</button>
          </>
        ) : (
          <span>ALLE</span>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
```

Append CSS:

```css
.chip {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.4rem 0.75rem; border: 1px solid currentColor;
}
.chip button {
  background: transparent; border: 0; color: inherit; font: inherit; cursor: pointer;
  padding: 0 0.25rem;
}
```

Swap the inline chip in `OrganisationsSection.tsx` for `<ActiveFilterChip label={label} onClear={() => setZone(null)} />`.

- [ ] **Step 4: Run test to verify it passes**

Run: `corepack pnpm --filter frontend test ActiveFilterChip OrganisationsSection`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/package.json frontend/src/components/motion/ActiveFilterChip.tsx frontend/tests/components/ActiveFilterChip.test.tsx frontend/src/components/sections/OrganisationsSection.tsx
git commit -m "feat(motion): animate active filter chip with framer-motion"
```

(If pnpm-lock.yaml is modified at the repo root, add it in the same commit.)

---

### Task 17: Map pulse + active zone fill

**Files:**

- Modify: `frontend/src/components/map/HouseMap.tsx`
- Modify: `frontend/src/app/globals.css`
- Modify: `frontend/tests/components/HouseMap.test.tsx`

- [ ] **Step 1: Write the failing test**

Extend the existing `HouseMap.test.tsx` with:

```tsx
import { render } from "@testing-library/react";

import { HouseMap } from "@/components/map/HouseMap";

it("adds a zone-active class to the active path", () => {
  const { container } = render(<HouseMap selectedZoneId="eg" onSelect={() => {}} />);
  expect(container.querySelector('[data-zone="eg"].zone-active')).not.toBeNull();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `corepack pnpm --filter frontend test HouseMap`
Expected: FAIL — class not applied.

- [ ] **Step 3: Write minimal implementation**

In `HouseMap.tsx`, for each zone path element:

```tsx
<path
  data-zone={zone.id}
  className={`zone ${selectedZoneId === zone.id ? "zone-active" : ""}`}
  role="button"
  tabIndex={0}
  aria-label={zone.label}
  onClick={() => onSelect(selectedZoneId === zone.id ? null : zone.id)}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSelect(selectedZoneId === zone.id ? null : zone.id);
    } else if (e.key === "Escape") {
      onSelect(null);
    }
  }}
/>
```

Append CSS:

```css
.zone { fill: transparent; stroke: var(--color-ink); stroke-width: 1.5; cursor: pointer; }
.zone:hover, .zone:focus-visible { outline: none; animation: zone-pulse 1s ease-out 1; }
.zone-active { fill: var(--color-cobalt); }

@keyframes zone-pulse {
  0%   { stroke-width: 1.5; }
  50%  { stroke-width: 3; stroke: var(--color-cobalt); }
  100% { stroke-width: 1.5; stroke: var(--color-ink); }
}

@media (prefers-reduced-motion: reduce) {
  .zone:hover, .zone:focus-visible { animation: none; }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `corepack pnpm --filter frontend test HouseMap`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/map/HouseMap.tsx frontend/src/app/globals.css frontend/tests/components/HouseMap.test.tsx
git commit -m "feat(map): cobalt active fill and hover pulse"
```

---

### Task 18: Redirects e2e

**Files:**

- Create: `frontend/e2e/redirects.spec.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { expect, test } from "@playwright/test";

for (const [path, anchor] of [
  ["/organisationen", "#organisationen"],
  ["/zeugnisse", "#zeugnisse"],
  ["/blog", "#blog"],
]) {
  test(`legacy ${path} redirects to ${anchor}`, async ({ page, baseURL }) => {
    const res = await page.goto((baseURL ?? "") + path, { waitUntil: "commit" });
    expect(res?.status()).toBe(308);
    await page.waitForURL((u) => u.hash === anchor);
    expect(new URL(page.url()).hash).toBe(anchor);
  });
}
```

- [ ] **Step 2: Run test to verify it fails (only if not yet implemented)**

Run: `corepack pnpm --filter frontend test:e2e redirects`
Expected: Passes if Task 12 is in place. If Task 12 is reverted, this fails.

- [ ] **Step 3: Write minimal implementation**

Nothing to implement — redirects already landed in Task 12. This task only adds the e2e coverage.

- [ ] **Step 4: Run test to verify it passes**

Run: `corepack pnpm --filter frontend test:e2e redirects`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/e2e/redirects.spec.ts
git commit -m "test(e2e): cover legacy route 308 redirects"
```

---

### Task 19: a11y e2e with axe-core

**Files:**

- Modify: `frontend/package.json` (add `@axe-core/playwright`)
- Create: `frontend/e2e/a11y.spec.ts`

- [ ] **Step 1: Write the failing test**

```ts
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("no serious or critical a11y issues on /", async ({ page }) => {
  await page.goto("/");
  const results = await new AxeBuilder({ page }).analyze();
  const bad = results.violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""));
  expect(bad).toEqual([]);
});

test("no serious or critical a11y issues on a blog post", async ({ page }) => {
  await page.goto("/");
  const blogLink = page.locator("a[href^='/blog/']").first();
  await blogLink.click();
  await page.waitForURL(/\/blog\//);
  const results = await new AxeBuilder({ page }).analyze();
  const bad = results.violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""));
  expect(bad).toEqual([]);
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
corepack pnpm --filter frontend add -D @axe-core/playwright
corepack pnpm --filter frontend test:e2e a11y
```

Expected: either fails on real a11y issues or passes; fix any serious/critical findings reported (missing labels, contrast, landmarks) until green.

- [ ] **Step 3: Write minimal implementation**

Fix any a11y findings iteratively: prefer adding `aria-label`, increasing contrast via tokens, or wrapping decorative elements with `aria-hidden`. Document each fix in a one-line commit message.

- [ ] **Step 4: Run test to verify it passes**

Run: `corepack pnpm --filter frontend test:e2e a11y`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/package.json frontend/e2e/a11y.spec.ts
git commit -m "test(e2e): add axe-core a11y scans for / and /blog/[slug]"
```

---

### Task 20: Vote-mode strap

**Files:**

- Create: `frontend/src/components/voting/VoteModeStrap.tsx`
- Create: `frontend/tests/components/VoteModeStrap.test.tsx`
- Modify: `frontend/src/app/page.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { VoteModeStrap } from "@/components/voting/VoteModeStrap";

describe("VoteModeStrap", () => {
  it("renders when enabled", () => {
    render(<VoteModeStrap enabled label="Abstimmung Juni 2026" latestPostSlug="a" />);
    expect(screen.getByRole("complementary")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /zum aktuellsten beitrag/i })).toHaveAttribute("href", "/blog/a");
  });

  it("renders nothing when disabled", () => {
    const { container } = render(<VoteModeStrap enabled={false} label="x" latestPostSlug="a" />);
    expect(container).toBeEmptyDOMElement();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `corepack pnpm --filter frontend test VoteModeStrap`
Expected: FAIL.

- [ ] **Step 3: Write minimal implementation**

```tsx
type Props = { enabled: boolean; label: string; latestPostSlug: string | null };

export function VoteModeStrap({ enabled, label, latestPostSlug }: Props) {
  if (!enabled) return null;
  return (
    <aside className="vote-strap mono" role="complementary">
      <span>{label}</span>
      {latestPostSlug ? (
        <a href={`/blog/${latestPostSlug}`}>ZUM AKTUELLSTEN BEITRAG →</a>
      ) : null}
    </aside>
  );
}
```

Append CSS:

```css
.vote-strap {
  display: flex; justify-content: center; gap: 2rem;
  background: var(--color-ink); color: var(--color-bone);
  padding: 0.5rem 1rem; font-size: 0.875rem; letter-spacing: 0.1em;
}
.vote-strap a { color: var(--color-acid); }
```

Modify `frontend/src/app/page.tsx` to conditionally render it above `<HeroSection>`:

```tsx
const voteEnabled = process.env.NEXT_PUBLIC_VOTE_MODE === "1";
const latest = posts[0]?.slug ?? null;
// ...
<VoteModeStrap enabled={voteEnabled} label="Abstimmung Juni 2026" latestPostSlug={latest} />
```

- [ ] **Step 4: Run test to verify it passes**

Run: `corepack pnpm --filter frontend test VoteModeStrap homePage`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/voting/VoteModeStrap.tsx frontend/tests/components/VoteModeStrap.test.tsx frontend/src/app/page.tsx frontend/src/app/globals.css
git commit -m "feat(voting): add env-flagged vote-mode top strap"
```

---

### Task 21: Sitemap

**Files:**

- Create: `frontend/src/app/sitemap.ts`
- Create: `frontend/tests/unit/sitemap.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/blog/samplePosts", () => ({
  allBlogPosts: [
    { id: 1, slug: "a", title: "A", excerpt: "", authorName: "X", publishDate: "2026-03-01", publishedAt: "2026-03-01" },
    { id: 2, slug: "b", title: "B", excerpt: "", authorName: "X", publishDate: null, publishedAt: null },
  ],
}));

describe("sitemap", () => {
  it("includes / and one entry per published post", async () => {
    const mod = await import("@/app/sitemap");
    const entries = (mod.default as () => { url: string }[])();
    const urls = entries.map((e) => e.url);
    expect(urls).toContain("https://zentralwaescherei.example/");
    expect(urls).toContain("https://zentralwaescherei.example/blog/a");
    expect(urls).not.toContain("https://zentralwaescherei.example/blog/b");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `corepack pnpm --filter frontend test sitemap`
Expected: FAIL.

- [ ] **Step 3: Write minimal implementation**

```ts
import type { MetadataRoute } from "next";

import { allBlogPosts } from "@/lib/blog/samplePosts";
import { filterPublishedPosts } from "@/lib/cms/types";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zentralwaescherei.example";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = filterPublishedPosts(allBlogPosts);
  return [
    { url: `${BASE}/`, lastModified: new Date() },
    ...posts.map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: new Date(p.publishDate ?? p.publishedAt ?? Date.now()),
    })),
  ];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `corepack pnpm --filter frontend test sitemap`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/app/sitemap.ts frontend/tests/unit/sitemap.test.ts
git commit -m "feat(seo): generate sitemap for home and published posts"
```

---

### Task 22: Smoke journey rewrite for the one-pager

**Files:**

- Modify: `frontend/e2e/smoke.spec.ts`

- [ ] **Step 1: Write the failing test**

Replace the file with:

```ts
import { expect, test } from "@playwright/test";

test("one-pager anchor journey", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  for (const [link, id] of [
    ["HAUS", "organisationen"],
    ["ZEUGNISSE", "zeugnisse"],
    ["BLOG", "blog"],
    ["START", "start"],
  ] as const) {
    await page.locator("header").getByRole("link", { name: link }).click();
    await expect(page.locator(`section#${id}`)).toBeInViewport({ ratio: 0.25 });
  }

  await page.locator("[aria-label='Bereich']").selectOption({ index: 1 });
  await expect(page.getByText(/zone:/i)).toBeVisible();

  const firstPost = page.locator("a[href^='/blog/']").first();
  await firstPost.click();
  await page.waitForURL(/\/blog\//);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `corepack pnpm --filter frontend test:e2e smoke`
Expected: PASS if the one-pager is fully wired; otherwise fails on the first failing assertion.

- [ ] **Step 3: Write minimal implementation**

Iterate on the one-pager until the smoke test passes (no code change is required if Tasks 1–20 are in place).

- [ ] **Step 4: Run test to verify it passes**

Run: `corepack pnpm test` (root)
Expected: Vitest + Playwright all green.

- [ ] **Step 5: Commit**

```bash
git add frontend/e2e/smoke.spec.ts
git commit -m "test(e2e): rewrite smoke journey for neo-poster one-pager"
```

---

### Task 23: Update docs and editorial checklist

**Files:**

- Modify: `README.md`
- Modify: `docs/content-entry-checklist.md`

- [ ] **Step 1: Write the failing test**

No automated test. Verification step is manual: each file contains the required section.

- [ ] **Step 2: Verification command**

Run:

```bash
rg -n "NEXT_PUBLIC_VOTE_MODE" README.md
rg -n "placementKey" docs/content-entry-checklist.md
```

Both should match after this task.

- [ ] **Step 3: Write content**

Append to `README.md` under a new `## Deployment flags` section:

```md
## Deployment flags

- `NEXT_PUBLIC_VOTE_MODE=1` enables a persistent top strap on `/` with the vote date and a link to the most recent published blog post. Off by default.
- `NEXT_PUBLIC_SITE_URL` sets the canonical base URL used in the sitemap (default `https://zentralwaescherei.example`).

## Tests

- Unit + component: `corepack pnpm --filter frontend test`
- End-to-end (smoke + redirects + a11y): `corepack pnpm --filter frontend test:e2e`
- Full suite: `corepack pnpm test`
```

Append to `docs/content-entry-checklist.md`:

```md
## One-pager site sections (v2)

The public site is a single page at `/`. The following `site-section.placementKey` entries must exist and be published:

1. `home-intro` — mission framing under the hero.
2. `organisationen-intro` — short lede above the house map.
3. `zeugnisse-intro` — lede for the cobalt Zeugnisse section.
4. `footer-note` — Kontakt block in the Kolofon footer.

## Vote-ready checklist

Before enabling `NEXT_PUBLIC_VOTE_MODE=1`:

1. Verify Impressum and Datenschutz pages are reachable.
2. Publish the campaign-relevant blog post so it becomes the latest entry.
3. Confirm no draft testimonies or unapproved content leak into the public view.
4. Re-run `corepack pnpm test` on staging.
```

- [ ] **Step 4: Re-run verification**

```bash
rg -n "NEXT_PUBLIC_VOTE_MODE" README.md
rg -n "placementKey" docs/content-entry-checklist.md
```

Expected: both match.

- [ ] **Step 5: Commit**

```bash
git add README.md docs/content-entry-checklist.md
git commit -m "docs: document vote-mode flag and one-pager editorial checklist"
```

---

## Spec Coverage Check

- One URL `/` with five anchor sections: Tasks **4, 5, 7, 8, 9, 11**.
- Sticky anchor nav with skip link: Task **3**.
- `/blog/[slug]` preserved + 308 legacy redirects: Task **12**, covered by e2e Task **18**.
- Tokens (bone/ink/acid/cobalt + font vars): Task **1**.
- Monument Grotesk self-hosted: Task **2**.
- Acid takeover for Organisationen, cobalt for Zeugnisse: Tasks **7, 8**.
- Merged Organisationen + Hauskarte with chip, URL `?zone=` via `replaceState`: Task **7**.
- Non-map fallback: Task **6**.
- Zeugnisse deterministic rotation, reduced-motion respects: Task **8**.
- Blog teaser (≤3, routed cards, empty state): Task **9**.
- Ink Kolofon footer: Task **10**.
- Motion layer: reveals Task **13**, marquee **14**, scramble **15**, FLIP chip **16**, map pulse **17**.
- a11y: skip link Task **3**, focus/aria in sections, axe scans Task **19**.
- Reduced motion and contrast: embedded in each motion task and the Zeugnisse rotation.
- ISR revalidate + vote-mode flag: Task **11** (revalidate), Task **20** (strap).
- Sitemap + canonical URL: Task **21**.
- Smoke e2e for the new journey: Task **22**.
- Docs + editorial checklist: Task **23**.

## Self-Review Notes

- No placeholders of the "TBD / fill in details" kind. Where a font license is not finalised, Task 2 names the fallback explicitly and it is interchangeable in the design.
- Task 11 seeds `sampleOrganisations` inline because v1 did the same; integration with Strapi is a follow-up beyond v2 scope (ISR already configured to accept live data once a fetch is added to `HomePage`).
- The `page.tsx` home page is intentionally a server component. Interactive sections (`OrganisationsSection`, `HeroSection` once Scramble lands) are `"use client"` so hydration boundaries are minimal and initial payload stays within the 80 KB gzip target.
- Method naming stays consistent across tasks (`onSelect`, `setZone`, `onClear`, `onChange`, `filterPublishedPosts`, `byFloorArea`). No drift.
- Every commit message uses conventional-commit prefixes (`feat`, `style`, `test`, `docs`) to match the v1 history style.
