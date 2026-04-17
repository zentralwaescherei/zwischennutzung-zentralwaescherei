import { expect, test } from "@playwright/test";

for (const [path, anchor] of [
  ["/organisationen", "#organisationen"],
  ["/zeugnisse", "#zeugnisse"],
  ["/blog", "#blog"],
] as const) {
  test(`legacy ${path} redirects to ${anchor}`, async ({ page, baseURL }) => {
    const res = await page.goto((baseURL ?? "") + path, { waitUntil: "commit" });
    expect(res?.status()).toBe(308);
    await page.waitForURL((u) => u.hash === anchor);
    expect(new URL(page.url()).hash).toBe(anchor);
  });
}
