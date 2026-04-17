# Zwischennutzung Zentralwäscherei — Neo-Poster One-Pager Design (v2)

Status: approved on 2026-04-17.

This spec supersedes the visual and IA portions of the v1 spec (`2026-04-17-zwischennutzung-website-design.md`). The content model, CMS stack, and editorial workflow from v1 remain in force unchanged. Every change below is additive or narrows v1; no content-model migrations are required.

## Context and Goal

The public site for the "Zwischennutzung Zentralwäscherei" cultural area in Zurich must communicate to a general audience before a public vote in June 2026. v1 shipped a restrained multi-page site with a Neo-Poster Minimal baseline. v2 pushes the visual language toward a louder, more artsy, genuinely poster-like presentation, and consolidates the public experience into a single page, while keeping blog articles addressable as dedicated URLs for SEO and sharing.

## Non-Goals (v2)

- No change to CMS stack, content types, or editorial workflow.
- No multilingual UI at launch. German only.
- No public accounts, submissions, or new editorial roles.
- No full blog archive page; the one-pager shows a teaser and each post lives at its own URL.

## Information Architecture

### Single URL `/`

`/` renders the full one-pager. Section order:

1. **Hero** `#start`
2. **Intro / Mission** `#intro`
3. **Organisationen + Hauskarte** (merged) `#organisationen`
4. **Zeugnisse** `#zeugnisse`
5. **Blog (teaser)** `#blog`
6. **Footer / Kolofon** (no anchor needed)

### Navigation

A sticky top bar with four anchor links: `START · HAUS · ZEUGNISSE · BLOG`, in Monument Grotesk Mono, uppercase. An IntersectionObserver marks the active section; on color-takeover sections the bar inverts (ink on acid, bone on cobalt) with a 200ms crossfade. On desktop ≥ 1024 px a left rail shows section numbers `01`…`05` that double as jump links. On mobile the bar collapses into a full-screen overlay with the same four links, one per line.

### Blog and deep-linking

- `/blog/[slug]` stays a real, statically-rendered route. The one-pager's Blog teaser links to these URLs; there is no in-page modal for articles.
- `/#organisationen?zone=<slug>` scrolls to Organisationen and pre-applies the zone filter. The filter chip updates the URL in place via `history.replaceState`; changing the filter never triggers a scroll jump.
- Legacy routes `/organisationen`, `/zeugnisse`, `/blog` return **HTTP 308** redirects to `/#organisationen`, `/#zeugnisse`, `/#blog` respectively so previously shared links continue to work.

## Visual System

### Color roles

- `--color-bone` `#F5F1E6` — default ground.
- `--color-ink` `#0B0B0B` — text, rules, inactive map lines.
- `--color-acid` `#F2FF3D` — active filter, hover/focus, Organisationen takeover.
- `--color-cobalt` `#0A1CFF` — Zeugnisse takeover, link underline, primary CTA background, active map zone fill.

Only Organisationen and Zeugnisse take the full-bleed color treatment. Every other section stays bone + ink so the poster punches remain rare and loud.

### Typography

All sizes use `clamp()` and respect German soft hyphens.

- **Display / Hero:** **Monument Grotesk Heavy**, `clamp(3.5rem, 12vw, 12rem)`, `letter-spacing: -0.02em`, `line-height: 0.9`.
- **Section headers:** Monument Grotesk Regular–Medium, `clamp(2.25rem, 6vw, 5rem)`.
- **Body:** Monument Grotesk Regular, `1.0625–1.125rem`, `line-height: 1.55`. Fallback `Inter` then system stack.
- **Mono accent:** Monument Grotesk Mono is the target for meta labels, section numbers, timestamps, rotated margin captions, and filter chip values. If Monument Grotesk Mono is not licensed in time, `JetBrains Mono` (OFL) is the fallback and is interchangeable in the design without layout impact.
- **Expressive moves:** one oversized display word per section may bleed off the viewport; each section includes at least one rotated (`±90°`) mono caption in its margin; a stroked (outlined) display variant is available for dark blocks.

Monument Grotesk is self-hosted. Two weights (Heavy and Regular) and Mono Regular are preloaded for above-the-fold content; everything else loads with `font-display: swap`. No runtime dependency on Google Fonts.

### Grid and rhythm

12 columns, 24 px gutter on desktop, 16 px on mobile. Max content width 1440 px. Vertical section rhythm via `--space-section-y: clamp(5rem, 12vw, 10rem)`. Layouts are intentionally asymmetric: headings snap to column 2, captions drift to the right margin or into the gutter, and each section breaks the grid deliberately in exactly one place.

## Section Layouts

### 1. Hero (bone)

Full viewport (`min-height: 100svh`). A mono marquee strap reads `ZWISCHEN­NUTZUNG · ZENTRAL­WÄSCHEREI · ZÜRICH · 2026 →` and pauses on hover or focus. The hero headline is two poster lines: line 1 `ZWISCHEN­NUTZUNG` in Monument Heavy solid, line 2 `ZENTRAL­WÄSCHEREI` in the stroked (outlined) variant, offset by one column. A rotated mono note (`-90deg`) in the bottom right holds the vote date, next to a primary CTA "→ ORGANISATIONEN ENTDECKEN" (ink background, bone text, acid underline on hover). Lower right corner: `SCROLL ↓ 01 / 05`.

### 2. Intro / Mission (bone)

Asymmetric 12-col layout. Headline in cols 2–7 (Monument Medium), rich-text body from site-section `home-intro` in cols 7–11, optional CTA below. An oversized mono caption floats in the right margin rotated `-90deg`, reading `02 — INTRO`.

### 3. Organisationen + Hauskarte (acid takeover)

Full-bleed acid background with ink text and ink map linework. The nav bar inverts. The header row shows `03 / HAUS` (mono, left), `ORGANISATIONEN` (display, center, stroked variant), and the active filter chip (right): "ALLE" or `ZONE: <NAME> ✕`.

Below the header:

- **Desktop 7/12 left:** the interactive SVG house map. Inactive zones transparent with ink outlines. Hover or focus adds a 1 s soft cobalt outline pulse. Active zone filled cobalt with a bone label.
- **Desktop 5/12 right:** the filtered organisation list. Each row is a poster card with the org name in Monument Medium, one-line description in body type, mono floor tag, and an arrow-link to the organisation's website. Hover slides an ink block in from the left over 250 ms; text crossfades ink → bone.
- **Mobile:** map stacks above the list; both remain fully interactive.
- **Empty state:** oversized mono `KEINE ORGANISATIONEN IN DIESEM BEREICH — ALLE ANZEIGEN →`.
- **Non-map fallback:** above the map, a mono floor `<select>` (or chip row) mirrors the map state for keyboard and touch users who prefer not to use the SVG. It is always visible, not a hidden affordance.

Section-level text block: `organisationen-intro` appears as a thin lede strip above the map row.

### 4. Zeugnisse (cobalt takeover)

Full-bleed cobalt with bone text. A thin mono lede strip at the top holds the `zeugnisse-intro` site-section text. The opener is an oversized pull-quote taken from the first approved testimony (Monument Regular, upright — no faux italic). Attribution follows in mono, uppercase. Below the opener, a masonry-style grid of testimony cards: short quote (Monument 1.25 rem), attribution in mono, optional portrait rendered with a CSS duotone (grayscale + multiply over cobalt). Cards rotate deterministically by index (`-2, 0, 2, -1, 1` repeating) so SSR and CSR render identically; rotation is removed under `prefers-reduced-motion`.

### 5. Blog teaser (bone)

Section header row: `04 / BLOG` left, `NEUIGKEITEN` right. A grid of the three most recent published posts (2 on tablet, 1 on mobile). Each card is an `<a>` to `/blog/[slug]` containing a mono date label, a Monument display headline, and a one-line excerpt. Hover animates the trailing `→` 4 px right and underlines the headline in acid. Below the grid, a full-width ink-ruled row with a mono note "WEITERE BEITRÄGE FOLGEN" closes the section. No "alle Beiträge" link is shown in v2 because there is no archive page yet; additional posts are only reachable at their individual `/blog/[slug]` URLs. An archive is out of scope for v2.

### 6. Footer / Kolofon (ink)

Ink ground, bone text. Oversized mono `KOLOFON`. Columns: Kontakt (site-section `footer-note`), Links (Impressum, Datenschutz, GitHub), Abstimmungshinweis (vote date repeated). Bottom line in tiny mono: `© 2026 ZWISCHEN­NUTZUNG ZENTRAL­WÄSCHEREI · GEBAUT MIT NEO-POSTER`.

### Blog article page `/blog/[slug]`

Kept routed and quiet. Bone ground, ink text, Monument display headline, mono meta (date · author), content column capped at 72 ch, images may break one column either side. No section takeovers. Top-left back link reads `← ZURÜCK ZUR ÜBERSICHT` and returns to `/#blog`.

## Interaction and Motion

Motion is split across three mechanisms by cost and predictability:

- **Framer Motion** for component transitions that need measured layout (FLIP chip, coordinated enters, exit animations).
- **Plain CSS animations** for the marquee, map pulse, and card rotations.
- **IntersectionObserver (no library)** for scroll reveals, to keep the JS budget small.

### Named motions

- `reveal-up`: opacity 0 → 1 with a 16 px upward translate, 450 ms, `cubic-bezier(0.2, 0.8, 0.2, 1)`, 60 ms stagger between siblings. Triggered at 20 % visibility with `rootMargin: "0px 0px -10% 0px"`. Elements in the viewport on first paint render revealed immediately to avoid SSR flash.
- `scramble-in`: one headline word cycles a fixed alphabet of Monument glyphs plus `▚ ▜ ▌` for ~600 ms and settles. Used once per section opener, and once on the hero per session (tracked via `sessionStorage`).
- `marquee-strap`: 40 s linear infinite loop, pauses on hover and focus. Decorative; the same text is also rendered statically for screen readers.
- `chip-transit`: the active filter chip animates position between zones via a FLIP transition, 220 ms.
- `map-pulse`: 1 s soft cobalt outline pulse on hover/focus of a zone path.
- `reveal-up` companion: images and testimony portraits also get a gentle parallax offset in their container, capped at 8 px travel; disabled under reduced motion.

### Reduced motion and contrast

`prefers-reduced-motion: reduce` disables scramble, marquee, parallax, map-pulse, and card rotation. Reveals collapse to opacity-only; chip transitions become instant crossfades. `prefers-contrast: more` removes duotone filters, forces pure ink/bone on acid and cobalt, and replaces stroked display with solid fill.

## Content Model Impact

No schema changes. The design relies on these `site-section.placementKey` values:

- `home-intro`
- `organisationen-intro`
- `zeugnisse-intro`
- `footer-note`

These are documented in the editorial checklist and seeded before launch. Organisations, testimonies, floor areas, and blog posts remain as specified in v1.

## Accessibility

- WCAG 2.2 AA target. Contrast verified for each combination (ink/bone, ink/acid, bone/cobalt).
- Single `<h1>` in the hero; each section has an `<h2>` and is wrapped in `<section aria-labelledby>`. Nav has `aria-label="Hauptnavigation"`.
- Visible skip-link `Zum Inhalt springen` targets `<main id="main">`.
- Focus rings: 2 px ink on bone/acid, 2 px bone on ink/cobalt; never color-only.
- Map zones are keyboard-focusable with German `aria-label` per zone; Enter or Space toggles the filter; Escape clears it. The floor `<select>` fallback is always present.
- Decorative mono captions that repeat visible headings are `aria-hidden="true"`. The marquee strap is decorative and mirrored by a static visible line for assistive tech.
- `<html lang="de">`. Soft hyphens in `ZWISCHEN­NUTZUNG` and `ZENTRAL­WÄSCHEREI` ensure clean mobile wrapping.

## Performance

- `/` is statically generated at build time; content fetched from Strapi (organisations, testimonies, site-sections, blog teasers). ISR `revalidate: 300` so editors see updates within five minutes without manual deploys.
- Monument Grotesk WOFF2 files self-hosted. Preload Heavy, Regular, and Mono Regular. Non-critical weights lazy-load with `font-display: swap`.
- Initial JS budget target: ≤ 80 KB gzip. Hero scramble, map interactions, and Framer Motion are code-split per section.
- Images via `next/image` in AVIF/WebP. Duotone portraits done in CSS; no runtime image pipeline.
- The SVG floor map is inlined; no additional request.

## SEO

- `/` owns primary `<title>`, `<meta name="description">`, and `og:image` (a pre-rendered hero composition at `frontend/public/og/start.png`).
- `/blog/[slug]` keeps per-article metadata, `og:type=article`, and canonical URL.
- Legacy route 308 redirects preserve inbound links and ranking.
- `sitemap.xml` lists `/` and every published `/blog/[slug]`. `robots.txt` allows all.

## Vote-Period Hardening

- `NEXT_PUBLIC_VOTE_MODE=1` enables a persistent, dismissable top strap on `/` with the vote date and a link to the most recent blog post. No other design behavior depends on this flag. Off by default.
- Editorial checklist gains a "vote-ready" section: Impressum link verified, Datenschutz page present, most-recent blog post reflects the current campaign message, no draft testimonies surfaced.
- If the CMS is unreachable at build time and no ISR snapshot exists, `/` renders a static German fallback explaining the outage and linking to Impressum and social channels.

## UX States

- First-paint loading for `/` is a quiet bone skeleton: section rails present, headlines replaced by ink rectangles matching final typographic sizes. Hydrates in place without layout shift.
- Empty states:
  - No organisations in selected floor/area → oversized mono copy with a clear-filter call.
  - No approved testimonies → the Zeugnisse section falls back to a single editorial pull-quote from `zeugnisse-intro` and hides the grid.
  - No published blog posts → Blog teaser renders the header row plus a mono note "NOCH KEINE BEITRÄGE — BALD MEHR."
- Error states show a small mono banner above the affected section and a `ERNEUT LADEN` action.

## Impact on Existing Code

- `frontend/src/app/page.tsx` is rebuilt as the composed one-pager.
- `frontend/src/app/organisationen/page.tsx`, `.../zeugnisse/page.tsx`, and `.../blog/page.tsx` become 308 redirect handlers.
- `frontend/src/app/blog/[slug]/page.tsx` remains an article page.
- `frontend/src/app/layout.tsx` swaps inline chrome for anchor-based nav, a skip link, Monument Grotesk via `next/font/local`, and the poster theme class.
- New components: `layout/SiteHeader`, `layout/SectionRail`, `layout/SkipLink`, `sections/HeroSection`, `sections/IntroSection`, `sections/OrganisationsSection`, `sections/ZeugnisseSection`, `sections/BlogTeaserSection`, `sections/SiteFooter`, `motion/Reveal`, `motion/Scramble`, `motion/Marquee`, `motion/ActiveFilterChip`, `map/FloorSelect`.
- Existing `OrganisationList`, `OrganisationDetailSheet`, `HouseMap`, `byFloorArea`, `TextBlockSection`, blog helpers, CMS client/types stay in place; they are restyled via tokens or extended with small props.
- Tokens extended in `frontend/src/styles/tokens.css`: `--color-acid`, `--color-cobalt`, `--color-bone`, `--color-ink`, `--font-display`, `--font-mono`, grid vars. New `frontend/src/styles/typography.css` for display scale and soft-hyphen helpers. New color-takeover classes in `globals.css` (`section-acid`, `section-cobalt`) and reduced-motion/contrast rules.
- Assets: Monument Grotesk WOFF2 files under `frontend/public/fonts/`; `frontend/public/og/start.png`.
- One new runtime dependency: `framer-motion`. One new dev dependency: `@axe-core/playwright`.

## Testing

### Vitest / Testing Library

- `tests/components/HeroSection.test.tsx` — headline text present; skip-link rendered; scramble disabled when `prefers-reduced-motion: reduce` (via `matchMedia` mock).
- `tests/components/OrganisationsSection.test.tsx` — map and list render together; empty-state copy appears when no orgs match; `?zone=` applied on mount; chip renders and clears.
- `tests/components/ZeugnisseSection.test.tsx` — first approved testimony becomes the opener; reduced-motion removes rotation classes.
- `tests/components/BlogTeaserSection.test.tsx` — at most three published posts; each card links to `/blog/[slug]`.
- `tests/unit/redirects.test.ts` — the three legacy route files export the expected 308 redirect targets.
- `tests/components/DesignTokens.test.tsx` (extended) — asserts `acid`, `cobalt`, `bone`, `ink` are exported from `@/styles/theme` so visual tokens cannot silently drift.

### Playwright end-to-end

- `frontend/e2e/smoke.spec.ts` (extended) — load `/`, click each anchor (`START`, `HAUS`, `ZEUGNISSE`, `BLOG`), assert each section is in viewport; click one map zone (or fallback `<select>`), assert the active filter chip; open one `/blog/[slug]` and assert headline.
- `frontend/e2e/redirects.spec.ts` — request `/organisationen`, `/zeugnisse`, `/blog`; assert HTTP 308 and final URL fragment.
- `frontend/e2e/a11y.spec.ts` — axe-core scan on `/` and one `/blog/[slug]`; fail on serious or critical issues.

### CI / verification

- `corepack pnpm --filter frontend build` runs in CI before merge; an SSG failure on `/` fails the pipeline.
- `corepack pnpm test` at root keeps running Vitest and Playwright.

## Migration Order (Preview)

A full ordered plan lives in a separate document (see writing-plans output). At a high level:

1. Tokens, fonts, layout chrome, skip link. Type change visible, IA unchanged.
2. Compose sections on `/` in quiet bone style.
3. Color takeovers: acid for Organisationen, cobalt for Zeugnisse.
4. Motion layer: reveals, scramble, marquee, FLIP chip, map pulse, parallax.
5. Legacy route 308 redirects; redirect and a11y e2e suites.
6. OG image, ISR tuning, vote-mode env flag.

## Open Questions

None tracked at design time. Further decisions (exact OG image composition, final Monument Grotesk licensing path, chosen axe rule set) are implementation details and belong in the plan.
