# Content Entry Checklist (Launch Week)

Use this before go-live and before major communications (e.g. public vote).

## Strapi / data

1. Add all floor/area entries with unique `svgZoneId` matching the interactive map.
2. Add all organisations; each must have `websiteUrl` and assigned `floorArea`.
3. Add at least six testimonies with clear attribution (`displayLabel` / `personName` or anonymous flow); only set `publishedAt` / approve per your editorial rules so public entries match policy.
4. Publish at least three blog posts (e.g. announcement, programme, FAQ); confirm each has `publishDate` when published.
5. Configure **Site section** entries for reusable homepage / section text blocks (`placementKey` unique); keep copy voting-relevant where needed.

## Technical

6. Run frontend and CMS on **Node 20 LTS** locally and in deployment (Strapi + `better-sqlite3` / production DB as configured).
7. Set `FRONTEND_URL` in CMS env for CORS if the public site origin is not `http://localhost:3000`.
8. Run `corepack pnpm test` at repo root (unit + Playwright smoke) in staging.

## Final QA

9. Walk through: Start → Organisationen (map + list) → Zeugnisse → Blog → open one blog post.
10. Open a shared organisation URL with `?zone=…` and confirm filter and empty states behave as expected.
11. Verify no draft-only blog posts or unapproved testimonies appear on the public site.
