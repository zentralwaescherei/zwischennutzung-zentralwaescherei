import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// The Next.js dev overlay renders inside a <nextjs-portal> custom element with
// chrome that ships with the framework. It does not exist in production builds,
// so we exclude it from the scan to surface only real site violations.
const SCAN = (page: import("@playwright/test").Page) =>
  new AxeBuilder({ page }).exclude("nextjs-portal");

test("no serious or critical a11y issues on /", async ({ page }) => {
  await page.goto("/");
  const results = await SCAN(page).analyze();
  const bad = results.violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""));
  expect(bad).toEqual([]);
});

test("no serious or critical a11y issues on a blog post", async ({ page }) => {
  await page.goto("/");
  const blogLink = page.locator("a[href^='/blog/']").first();
  await blogLink.click();
  await page.waitForURL(/\/blog\//);
  const results = await SCAN(page).analyze();
  const bad = results.violations.filter((v) => ["serious", "critical"].includes(v.impact ?? ""));
  expect(bad).toEqual([]);
});
