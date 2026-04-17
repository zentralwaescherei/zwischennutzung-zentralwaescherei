import { expect, test } from "@playwright/test";

test("smoke journey", async ({ page }) => {
  await page.goto("/");
  const orgNav = page.locator("header").getByRole("link", { name: "Organisationen", exact: true });
  await expect(orgNav).toBeVisible();
  await orgNav.click();
  await expect(page.getByRole("img", { name: /haus/i })).toBeVisible();
  await page.locator("header").getByRole("link", { name: "Blog", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Blog" })).toBeVisible();
});
