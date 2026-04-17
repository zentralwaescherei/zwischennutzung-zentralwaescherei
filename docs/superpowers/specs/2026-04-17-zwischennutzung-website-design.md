# Zwischennutzung Zentralwaescherei Website Design

## Context

This website serves the cultural area "Zwischennutzung Zentralwaescherei" in Zurich. The primary audience is the general public. The project has a time-critical communication purpose because there will be a public vote in June, so all key information areas must be present and usable from the first launch.

## Product Goals

- Present a complete and understandable overview of all organizations active in the house.
- Let visitors explore organizations spatially through a clickable wireframe/floorplan.
- Capture and communicate personal meaning of the area through testimonies.
- Publish ongoing updates via a blog with a lightweight editorial workflow.
- Preserve aesthetic quality while keeping delivery speed high (ASAP launch).

## Non-Goals (V1)

- No public user accounts.
- No public content submission flow.
- No multilingual interface at launch (German only for V1).
- No advanced editorial approval chain beyond draft -> publish.

## Selected Approach

Use a **headless CMS + modern frontend** architecture.

Reasoning:
- Supports non-technical editors with internal login.
- Enables structured content types and relationships needed for map filtering.
- Balances aesthetic ambition with rapid delivery for a public-facing deadline.
- Reduces risk compared with building a custom admin system from scratch.

## High-Level Architecture

### Frontend

Public website with these core surfaces:
- Homepage (intro, key navigation, curated highlights, heading/text blocks)
- Organizations directory (overview and detail)
- Interactive house map + filtered organization list
- Testimonies section
- Blog index + blog detail

### CMS Backend

- Authenticated editor access for internal team only.
- Content authoring and publishing for organizations, map structure, testimonies, blog posts, and reusable text blocks.
- Draft/publish workflow (especially for blog, optionally for other content where useful).

### Data Contract

Frontend consumes published CMS content via API. CMS is the source of truth.

## Visual Direction (Approved)

The approved visual direction for V1 is **Neo-Poster Minimal**.

Design principles:
- Artsy, young, fresh tone with restrained composition.
- Minimal interface chrome with strong typography and generous whitespace.
- Neutral base palette with one vivid accent color used intentionally.
- High-contrast documentary imagery and simple geometric UI primitives.
- Floor map stays mostly monochrome, with accent color for active area/filter states.

## Content Model

### Reusable Text Block

Purpose: Allow editors to add heading/text sections without code changes.

Fields:
- `title` (required)
- `bodyRichText` (required)
- `ctaLabel` (optional)
- `ctaUrl` (optional)
- `styleVariant` (optional, e.g. neutral/accent)
- `placementKey` (optional positioning reference)

### Floor/Area

Fields:
- `name`
- `slug`
- `svgZoneId` (must match clickable zone ID in SVG)
- `description` (optional)
- `sortOrder`

### Organization

Fields:
- `name` (required)
- `slug` (required)
- `shortDescription` (required)
- `websiteUrl` (required, validated URL)
- `categoryTags` (optional array)
- `floorArea` (reference to Floor/Area, required)
- `logoOrImage` (optional)
- `isFeatured` (optional boolean)

Views:
- Overview card/list item
- Detail panel or page with short description and external website link

### Testimony

Fields:
- `quote` (required)
- `personName` (required unless anonymous mode is selected)
- `displayLabel` (optional override, e.g. "Anwohnerin")
- `roleContext` (optional)
- `portraitImage` (optional)
- `themeTags` (optional)
- `isApproved` (boolean for editorial control)

### Blog Post

Fields:
- `title` (required)
- `slug` (required)
- `excerpt` (required)
- `bodyRichText` (required)
- `coverImage` (optional)
- `authorName` (required)
- `publishDate` (required on publish)
- `status` (`draft` or `published`)

Workflow:
- Editors create/edit in draft.
- Editors publish when ready.

## Interactive House Wireframe Design

### Asset Strategy

- Source of truth: SVG floorplan.
- Each clickable area carries a stable zone ID.
- Zone IDs map to `Floor/Area.svgZoneId` values in CMS data.

### Interaction Behavior

- Default state shows all organizations.
- Clicking a zone activates filter for that floor/area.
- Active filter state is visible via highlighted zone and active filter label/chip.
- Clear action resets to all organizations.
- Filter state is reflected in URL query parameters for shareable links.

### Accessibility

- Keyboard-focusable map zones.
- Clear text labels/ARIA descriptions for zones.
- Sufficient contrast for active/inactive states.
- Filtering also usable from non-map controls (e.g. floor selector list) as fallback.

## Information Architecture and Core Pages

### Homepage

- Intro hero and mission framing.
- Reusable heading/text blocks.
- Quick access to all four pillars:
  - Organizations
  - House map
  - Testimonies
  - Blog
- Optional featured organizations/testimonies/posts.

### Organizations Page

- Search/filter-ready list or grid.
- Each organization opens detail panel/page with description + website link.
- If map filter is active, list is constrained to selected floor/area.

### House Map Section/Page

- Interactive SVG map on top/left.
- Synchronized organization list on side/below.
- Empty-state message if no organizations in selected area.

### Testimonies Page

- Curated testimony cards with optional portrait.
- Mix of emotional storytelling and credibility through labels/context.
- Optional thematic grouping for readability.

### Blog

- Blog index with cards (title, excerpt, date).
- Detail page with full article.
- Only published posts visible publicly.

## Data Flow

1. Editor updates content in CMS.
2. Content is saved as draft or published.
3. Frontend fetches published content from CMS APIs.
4. Client-side filtering joins organizations with floor/area references.
5. UI renders synchronized map + list state and detail views.

## UX States

- Loading state for first-page fetches (skeleton/spinner).
- Empty states:
  - No organizations at all (initial data issue)
  - No organizations for selected floor/area
  - No testimonies yet
  - No published blog posts yet
- Error states with retry action for failed fetches.
- Safe fallback media when optional image assets are missing.

## Error Handling Strategy

- Validate URLs in CMS for organization website links.
- Gracefully ignore invalid zone mappings and log them for editor correction.
- Protect against missing optional fields with robust defaults.
- For API failures, show clear user-facing fallback and allow retry.

## Authentication and Roles

- Internal editor login only (no public auth).
- Suggested minimum roles:
  - `editor`: create/update draft and publish content
  - `admin`: role/content model management

## Language and Localization

- V1 language: German only.
- Content model should remain localization-ready for future expansion, but no multi-language UI or workflows are in current scope.

## MVP Scope (ASAP, 1-2 weeks)

Must-have for launch:
- Organizations overview + detail + website link.
- Interactive SVG floor/area filtering integrated with organization list.
- Testimonies display.
- Blog with draft/publish workflow.
- Reusable heading/text blocks.
- Internal editor authentication.
- Baseline responsive design and accessibility.

Deferred to immediate post-launch iteration:
- Advanced search and tag faceting.
- Rich editorial analytics.
- Multilingual rollout.
- More complex storytelling layouts/animations.

## Quality and Testing Strategy

### Unit Tests

- Map filtering logic by `svgZoneId` and `floorArea` references.
- URL query parse/serialize for filter state.
- Content mapping/transformation utilities.

### Component Tests

- Organization cards and detail interactions.
- Map zone click and keyboard selection behavior.
- Testimony card rendering.
- Blog card and detail rendering.
- Reusable heading/text block rendering variants.

### Integration / E2E Smoke

- Homepage loads with core navigation.
- Floor click filters organizations correctly.
- Organization detail opens and external link is present.
- Blog list and detail page render published content.
- German content appears correctly across pages.

### Editorial QA

- Editor can log in.
- Editor can create draft and publish blog post.
- Editor can add/update organization and assign floor/area.
- Editor can add heading/text block and see it live in intended placement.

## Risks and Mitigations

- **Risk:** Missing or delayed floorplan asset.
  - **Mitigation:** Start with a simplified SVG and refine visuals iteratively.
- **Risk:** Content entry bottleneck before launch.
  - **Mitigation:** Define content templates and minimum required fields early.
- **Risk:** Data mismatch between map zones and organization mapping.
  - **Mitigation:** Add validation checks and pre-launch QA checklist.
- **Risk:** Timeline compression due to aesthetic polish.
  - **Mitigation:** Separate MVP visual system from post-launch enhancement backlog.

## Success Criteria (V1)

- Public visitors can understand who is active in the area and where they are located.
- Visitors can use the map to filter organizations by floor/area reliably.
- Visitors can read testimonies and latest updates via blog.
- Editors can update all major content types without developer intervention.
- Site is stable, accessible at baseline, and ready before the June vote communication window.

