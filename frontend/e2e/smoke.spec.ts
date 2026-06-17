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
