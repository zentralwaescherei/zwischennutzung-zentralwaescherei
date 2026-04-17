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
