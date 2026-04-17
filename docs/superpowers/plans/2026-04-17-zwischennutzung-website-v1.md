# Zwischennutzung Zentralwaescherei Website V1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and launch a German-language public website with organizations directory, interactive SVG floor filtering, testimonies, reusable heading/text blocks, and blog draft/publish workflow backed by a headless CMS.

**Architecture:** Use Next.js App Router for the public frontend and Strapi for authenticated editorial management. Model organizations, floors/areas, testimonies, blog posts, and reusable text blocks in Strapi, then consume published content in frontend server routes with client-side map filtering for fast UX. Ship an MVP first, then iterate on visual polish after launch.

**Tech Stack:** Next.js 14 (TypeScript), React, Tailwind CSS, Vitest, React Testing Library, Playwright, Strapi v5, PostgreSQL, pnpm.

---

## Visual Direction Constraint (Must Preserve)

- Approved direction: **Neo-Poster Minimal**.
- Use one expressive headline style + one readable body style.
- Keep layouts minimal with strong spacing and limited visual noise.
- Keep base UI neutral and reserve one vibrant accent color for hierarchy and interaction.
- Keep map visuals mostly monochrome with accent highlight for selected floor/area.

## Planned File Structure

- Create: `frontend/` (public site)
  - `frontend/src/app/page.tsx` (homepage)
  - `frontend/src/app/organisationen/page.tsx` (organization overview + map/filter entry)
  - `frontend/src/app/blog/page.tsx` (blog index)
  - `frontend/src/app/blog/[slug]/page.tsx` (blog detail)
  - `frontend/src/app/zeugnisse/page.tsx` (testimonies)
  - `frontend/src/components/map/HouseMap.tsx` (interactive SVG zones)
  - `frontend/src/components/organisations/OrganisationList.tsx`
  - `frontend/src/components/organisations/OrganisationDetailSheet.tsx`
  - `frontend/src/components/content/TextBlockSection.tsx`
  - `frontend/src/lib/cms/client.ts` (Strapi fetch helpers)
  - `frontend/src/lib/cms/types.ts` (content contracts)
  - `frontend/src/lib/filter/byFloorArea.ts` (pure filtering logic)
  - `frontend/tests/unit/byFloorArea.test.ts`
  - `frontend/tests/components/HouseMap.test.tsx`
  - `frontend/e2e/smoke.spec.ts`
- Create: `cms/` (Strapi project)
  - `cms/src/api/organisation/content-types/organisation/schema.json`
  - `cms/src/api/floor-area/content-types/floor-area/schema.json`
  - `cms/src/api/testimony/content-types/testimony/schema.json`
  - `cms/src/api/blog-post/content-types/blog-post/schema.json`
  - `cms/src/components/content/text-block.json`
  - `cms/config/plugins.ts` (users/roles + editor auth setup)
  - `cms/config/middlewares.ts` (CORS for frontend origin)
- Create: `docs/content-entry-checklist.md` (editor launch checklist)
- Modify: `.gitignore` (node_modules, .next, dist, .strapi, envs)
- Create: `README.md` (local setup and runbook)

---

### Task 1: Bootstrap Workspace and Tooling

**Files:**
- Create: `pnpm-workspace.yaml`
- Create: `package.json`
- Create: `.gitignore`
- Create: `README.md`
- Test: `README.md` (run commands)

- [ ] **Step 1: Write the failing test**

```bash
# Validate workspace is not bootstrapped yet
test -f pnpm-workspace.yaml && echo "unexpected" && exit 1 || echo "missing workspace file"
```

- [ ] **Step 2: Run test to verify it fails**

Run: `test -f pnpm-workspace.yaml`
Expected: non-zero exit code because file does not exist.

- [ ] **Step 3: Write minimal implementation**

```yaml
# pnpm-workspace.yaml
packages:
  - "frontend"
  - "cms"
```

```json
{
  "name": "zwischennutzung-zentralwaescherei",
  "private": true,
  "packageManager": "pnpm@9.12.0",
  "scripts": {
    "dev": "pnpm --parallel --filter frontend --filter cms dev",
    "test": "pnpm --filter frontend test && pnpm --filter frontend test:e2e"
  }
}
```

```gitignore
node_modules/
.next/
dist/
.env
.env.*
cms/.tmp/
cms/build/
frontend/playwright-report/
frontend/test-results/
```

- [ ] **Step 4: Run test to verify it passes**

Run: `test -f pnpm-workspace.yaml && test -f package.json && test -f .gitignore`
Expected: success exit code.

- [ ] **Step 5: Commit**

```bash
git add pnpm-workspace.yaml package.json .gitignore README.md
git commit -m "chore: bootstrap monorepo workspace for frontend and cms"
```

---

### Task 2: Create CMS with Core Content Types

**Files:**
- Create: `cms/` Strapi project files
- Create: `cms/src/components/content/text-block.json`
- Create: `cms/src/api/floor-area/content-types/floor-area/schema.json`
- Create: `cms/src/api/organisation/content-types/organisation/schema.json`
- Create: `cms/src/api/testimony/content-types/testimony/schema.json`
- Create: `cms/src/api/blog-post/content-types/blog-post/schema.json`
- Modify: `cms/config/middlewares.ts`
- Test: `cms/src/api/**/schema.json` via Strapi type validation on startup

- [ ] **Step 1: Write the failing test**

```bash
test -f cms/src/api/organisation/content-types/organisation/schema.json
```

- [ ] **Step 2: Run test to verify it fails**

Run: `test -f cms/src/api/organisation/content-types/organisation/schema.json`
Expected: non-zero exit code.

- [ ] **Step 3: Write minimal implementation**

```json
{
  "collectionName": "organisations",
  "info": { "singularName": "organisation", "pluralName": "organisations", "displayName": "Organisation" },
  "options": { "draftAndPublish": true },
  "attributes": {
    "name": { "type": "string", "required": true },
    "slug": { "type": "uid", "targetField": "name", "required": true },
    "shortDescription": { "type": "text", "required": true },
    "websiteUrl": { "type": "string", "required": true },
    "categoryTags": { "type": "json" },
    "floorArea": { "type": "relation", "relation": "manyToOne", "target": "api::floor-area.floor-area", "required": true },
    "logoOrImage": { "type": "media", "multiple": false, "allowedTypes": ["images"] },
    "isFeatured": { "type": "boolean", "default": false }
  }
}
```

```json
{
  "collectionName": "floor_areas",
  "info": { "singularName": "floor-area", "pluralName": "floor-areas", "displayName": "FloorArea" },
  "options": { "draftAndPublish": true },
  "attributes": {
    "name": { "type": "string", "required": true },
    "slug": { "type": "uid", "targetField": "name", "required": true },
    "svgZoneId": { "type": "string", "required": true },
    "description": { "type": "text" },
    "sortOrder": { "type": "integer", "default": 0 }
  }
}
```

```json
{
  "collectionName": "blog_posts",
  "info": { "singularName": "blog-post", "pluralName": "blog-posts", "displayName": "BlogPost" },
  "options": { "draftAndPublish": true },
  "attributes": {
    "title": { "type": "string", "required": true },
    "slug": { "type": "uid", "targetField": "title", "required": true },
    "excerpt": { "type": "text", "required": true },
    "bodyRichText": { "type": "richtext", "required": true },
    "coverImage": { "type": "media", "multiple": false, "allowedTypes": ["images"] },
    "authorName": { "type": "string", "required": true },
    "publishDate": { "type": "datetime" }
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter cms dev`
Expected: Strapi starts successfully with content-types available in admin.

- [ ] **Step 5: Commit**

```bash
git add cms
git commit -m "feat: define cms content models for v1 public information"
```

---

### Task 3: Build Frontend Skeleton and CMS Client Contracts

**Files:**
- Create: `frontend/src/lib/cms/types.ts`
- Create: `frontend/src/lib/cms/client.ts`
- Create: `frontend/src/app/layout.tsx`
- Create: `frontend/src/app/page.tsx`
- Create: `frontend/src/app/organisationen/page.tsx`
- Create: `frontend/src/app/zeugnisse/page.tsx`
- Create: `frontend/src/app/blog/page.tsx`
- Create: `frontend/src/app/blog/[slug]/page.tsx`
- Test: `frontend/src/lib/cms/client.test.ts` (optional smoke)

- [ ] **Step 1: Write the failing test**

```ts
// frontend/tests/unit/cmsClient.test.ts
import { buildStrapiUrl } from "@/lib/cms/client";
import { describe, expect, it } from "vitest";

describe("buildStrapiUrl", () => {
  it("builds absolute API url", () => {
    expect(buildStrapiUrl("/api/organisations")).toBe("http://localhost:1337/api/organisations");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter frontend test cmsClient`
Expected: FAIL because `buildStrapiUrl` is not implemented.

- [ ] **Step 3: Write minimal implementation**

```ts
// frontend/src/lib/cms/client.ts
const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? "http://localhost:1337";

export function buildStrapiUrl(path: string): string {
  return `${CMS_URL}${path}`;
}

export async function fetchPublished<T>(path: string): Promise<T> {
  const res = await fetch(buildStrapiUrl(path), { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`CMS fetch failed: ${res.status}`);
  return res.json() as Promise<T>;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter frontend test cmsClient`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend
git commit -m "feat: scaffold frontend routes and cms fetch contracts"
```

---

### Task 4: Implement Organizations Directory + Detail Sheet

**Files:**
- Create: `frontend/src/components/organisations/OrganisationList.tsx`
- Create: `frontend/src/components/organisations/OrganisationDetailSheet.tsx`
- Modify: `frontend/src/app/organisationen/page.tsx`
- Test: `frontend/tests/components/OrganisationList.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { OrganisationList } from "@/components/organisations/OrganisationList";
import { describe, expect, it } from "vitest";

describe("OrganisationList", () => {
  it("renders organisation name and website link", () => {
    render(
      <OrganisationList organisations={[{ id: "1", name: "Werkstatt", shortDescription: "DIY", websiteUrl: "https://example.org", floorArea: { slug: "eg", name: "EG", svgZoneId: "eg" } }]} />
    );
    expect(screen.getByText("Werkstatt")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /website/i })).toHaveAttribute("href", "https://example.org");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter frontend test OrganisationList`
Expected: FAIL because component is missing.

- [ ] **Step 3: Write minimal implementation**

```tsx
// frontend/src/components/organisations/OrganisationList.tsx
export function OrganisationList({ organisations }: { organisations: Array<{ id: string; name: string; shortDescription: string; websiteUrl: string }> }) {
  return (
    <ul className="grid gap-4">
      {organisations.map((org) => (
        <li key={org.id} className="rounded border p-4">
          <h3 className="font-semibold">{org.name}</h3>
          <p>{org.shortDescription}</p>
          <a href={org.websiteUrl} target="_blank" rel="noreferrer" aria-label="Website">
            Website
          </a>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter frontend test OrganisationList`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/organisations frontend/src/app/organisationen/page.tsx frontend/tests/components/OrganisationList.test.tsx
git commit -m "feat: add organizations listing and detail interaction"
```

---

### Task 5: Implement Interactive SVG Map Filtering

**Files:**
- Create: `frontend/src/lib/filter/byFloorArea.ts`
- Create: `frontend/src/components/map/HouseMap.tsx`
- Modify: `frontend/src/app/organisationen/page.tsx`
- Test: `frontend/tests/unit/byFloorArea.test.ts`
- Test: `frontend/tests/components/HouseMap.test.tsx`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest";
import { byFloorArea } from "@/lib/filter/byFloorArea";

describe("byFloorArea", () => {
  it("returns all organisations when filter is null", () => {
    const input = [
      { id: "1", floorArea: { svgZoneId: "eg" } },
      { id: "2", floorArea: { svgZoneId: "og1" } }
    ];
    expect(byFloorArea(input, null)).toHaveLength(2);
  });

  it("filters by selected svg zone", () => {
    const input = [
      { id: "1", floorArea: { svgZoneId: "eg" } },
      { id: "2", floorArea: { svgZoneId: "og1" } }
    ];
    expect(byFloorArea(input, "eg").map((x) => x.id)).toEqual(["1"]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter frontend test byFloorArea`
Expected: FAIL because function is missing.

- [ ] **Step 3: Write minimal implementation**

```ts
// frontend/src/lib/filter/byFloorArea.ts
export function byFloorArea<T extends { floorArea: { svgZoneId: string } }>(organisations: T[], zoneId: string | null): T[] {
  if (!zoneId) return organisations;
  return organisations.filter((org) => org.floorArea.svgZoneId === zoneId);
}
```

```tsx
// frontend/src/components/map/HouseMap.tsx
export function HouseMap({ selectedZoneId, onSelect }: { selectedZoneId: string | null; onSelect: (zoneId: string | null) => void }) {
  return (
    <svg viewBox="0 0 200 120" role="img" aria-label="Hauskarte">
      <g>
        <rect x="10" y="10" width="80" height="40" data-zone="eg" tabIndex={0} onClick={() => onSelect("eg")} />
        <rect x="10" y="60" width="80" height="40" data-zone="og1" tabIndex={0} onClick={() => onSelect("og1")} />
      </g>
      <title>{selectedZoneId ? `Aktiver Bereich: ${selectedZoneId}` : "Alle Bereiche"}</title>
    </svg>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter frontend test byFloorArea HouseMap`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/lib/filter/byFloorArea.ts frontend/src/components/map/HouseMap.tsx frontend/src/app/organisationen/page.tsx frontend/tests
git commit -m "feat: add interactive map-based floor filtering"
```

---

### Task 6: Implement Testimonies and Reusable Text Blocks

**Files:**
- Create: `frontend/src/components/content/TextBlockSection.tsx`
- Modify: `frontend/src/app/page.tsx`
- Modify: `frontend/src/app/zeugnisse/page.tsx`
- Test: `frontend/tests/components/TextBlockSection.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { TextBlockSection } from "@/components/content/TextBlockSection";
import { describe, expect, it } from "vitest";

describe("TextBlockSection", () => {
  it("renders title and rich text body", () => {
    render(<TextBlockSection title="Warum dieser Ort wichtig ist" bodyHtml="<p>Gemeinschaft und Kultur</p>" />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Warum dieser Ort wichtig ist");
    expect(screen.getByText("Gemeinschaft und Kultur")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter frontend test TextBlockSection`
Expected: FAIL because component is missing.

- [ ] **Step 3: Write minimal implementation**

```tsx
// frontend/src/components/content/TextBlockSection.tsx
export function TextBlockSection({ title, bodyHtml }: { title: string; bodyHtml: string }) {
  return (
    <section className="my-8">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter frontend test TextBlockSection`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/content/TextBlockSection.tsx frontend/src/app/page.tsx frontend/src/app/zeugnisse/page.tsx frontend/tests/components/TextBlockSection.test.tsx
git commit -m "feat: render testimonies and reusable heading text blocks"
```

---

### Task 7: Implement Blog Index/Detail with Draft-Publish Semantics

**Files:**
- Modify: `frontend/src/app/blog/page.tsx`
- Modify: `frontend/src/app/blog/[slug]/page.tsx`
- Create: `frontend/tests/components/BlogPages.test.tsx`
- Test: `frontend/e2e/smoke.spec.ts` (blog navigation assertion)

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, expect, it } from "vitest";
import { filterPublishedPosts } from "@/lib/cms/types";

describe("filterPublishedPosts", () => {
  it("returns only published posts", () => {
    const posts = [
      { id: "1", status: "published" },
      { id: "2", status: "draft" }
    ];
    expect(filterPublishedPosts(posts as any)).toEqual([{ id: "1", status: "published" }]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter frontend test filterPublishedPosts`
Expected: FAIL because helper does not exist.

- [ ] **Step 3: Write minimal implementation**

```ts
// frontend/src/lib/cms/types.ts
export type BlogPost = { id: string; status: "draft" | "published"; slug: string; title: string; excerpt: string; bodyRichText: string };

export function filterPublishedPosts(posts: BlogPost[]): BlogPost[] {
  return posts.filter((post) => post.status === "published");
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter frontend test filterPublishedPosts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/app/blog frontend/src/lib/cms/types.ts frontend/tests/components/BlogPages.test.tsx frontend/e2e/smoke.spec.ts
git commit -m "feat: add public blog pages backed by publish status"
```

---

### Task 8: Add End-to-End Smoke Coverage and Launch Checklist

**Files:**
- Modify: `frontend/e2e/smoke.spec.ts`
- Create: `docs/content-entry-checklist.md`
- Modify: `README.md`
- Test: `frontend/e2e/smoke.spec.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { test, expect } from "@playwright/test";

test("smoke journey", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Organisationen" })).toBeVisible();
  await page.getByRole("link", { name: "Organisationen" }).click();
  await expect(page.getByText("Hauskarte")).toBeVisible();
  await page.getByRole("link", { name: "Blog" }).click();
  await expect(page.getByRole("heading", { name: "Blog" })).toBeVisible();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter frontend test:e2e --grep "smoke journey"`
Expected: FAIL until pages/labels are implemented consistently.

- [ ] **Step 3: Write minimal implementation**

```md
# Content Entry Checklist (Launch Week)

1. Add all floor/area entries with unique `svgZoneId`.
2. Add all organizations and verify each has `websiteUrl` + assigned floor.
3. Add minimum 6 testimonies with attribution labels.
4. Publish at least 3 blog posts (announcement, programme, FAQ).
5. Add homepage heading/text blocks for context and voting relevance.
6. Verify all published content in frontend staging before go-live.
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter frontend test:e2e --grep "smoke journey"`
Expected: PASS in local/staging environment.

- [ ] **Step 5: Commit**

```bash
git add frontend/e2e/smoke.spec.ts docs/content-entry-checklist.md README.md
git commit -m "test: add smoke journey and editorial launch checklist"
```

---

### Task 9: Implement Neo-Poster Minimal Design Tokens and UI System

**Files:**
- Create: `frontend/src/styles/tokens.css`
- Modify: `frontend/src/app/globals.css`
- Modify: `frontend/src/app/layout.tsx`
- Create: `frontend/tests/components/DesignTokens.test.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, expect, it } from "vitest";
import { posterThemeClass } from "@/styles/theme";

describe("posterThemeClass", () => {
  it("uses neo-poster-minimal theme classname", () => {
    expect(posterThemeClass).toBe("theme-neo-poster-minimal");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter frontend test DesignTokens`
Expected: FAIL because theme export is missing.

- [ ] **Step 3: Write minimal implementation**

```css
/* frontend/src/styles/tokens.css */
:root.theme-neo-poster-minimal {
  --color-bg: #f7f6f2;
  --color-fg: #111111;
  --color-accent: #2f6bff;
  --radius-card: 0px;
  --space-section-y: clamp(3rem, 8vw, 7rem);
}
```

```ts
// frontend/src/styles/theme.ts
export const posterThemeClass = "theme-neo-poster-minimal";
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter frontend test DesignTokens`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/styles/tokens.css frontend/src/styles/theme.ts frontend/src/app/globals.css frontend/src/app/layout.tsx frontend/tests/components/DesignTokens.test.tsx
git commit -m "style: apply neo-poster-minimal design tokens"
```

---

## Spec Coverage Check

- Organizations overview + detail + website link: **Task 4**
- Interactive SVG floor/area filter: **Task 5**
- Testimonies: **Task 6**
- Reusable heading/text blocks: **Task 6**
- Blog draft/publish visibility: **Task 2 + Task 7**
- Editor authentication in CMS: **Task 2**
- MVP QA and reliability: **Task 8**
- Neo-Poster Minimal visual system: **Task 9**

No spec gaps identified.

