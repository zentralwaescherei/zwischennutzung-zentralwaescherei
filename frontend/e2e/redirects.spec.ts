import { expect, test } from "@playwright/test";

for (const [path, anchor] of [
  ["/organisationen", "#organisationen"],
  ["/zeugnisse", "#zeugnisse"],
  ["/blog", "#blog"],
] as const) {
  test(`legacy ${path} redirects with 308 to ${anchor}`, async ({ page, request }) => {
    const res = await request.fetch(path, { maxRedirects: 0 });
    expect(res.status()).toBe(308);
    expect(res.headers().location).toBe(`/${anchor}`);

    await page.goto(path);
    await page.waitForURL((u) => u.hash === anchor);
    expect(new URL(page.url()).hash).toBe(anchor);
  });
}
