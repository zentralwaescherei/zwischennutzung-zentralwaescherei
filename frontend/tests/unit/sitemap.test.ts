import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/blog/samplePosts", () => ({
  allBlogPosts: [
    {
      id: 1,
      slug: "a",
      title: "A",
      excerpt: "",
      authorName: "X",
      publishDate: "2026-03-01",
      publishedAt: "2026-03-01",
    },
    {
      id: 2,
      slug: "b",
      title: "B",
      excerpt: "",
      authorName: "X",
      publishDate: null,
      publishedAt: null,
    },
  ],
}));

describe("sitemap", () => {
  it("includes / and one entry per published post", async () => {
    const mod = await import("@/app/sitemap");
    const entries = (mod.default as () => { url: string }[])();
    const urls = entries.map((e) => e.url);
    expect(urls).toContain("https://zentralwaescherei.example/");
    expect(urls).toContain("https://zentralwaescherei.example/blog/a");
    expect(urls).not.toContain("https://zentralwaescherei.example/blog/b");
  });
});
