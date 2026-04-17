import { describe, expect, it } from "vitest";

import { allBlogPosts } from "@/lib/blog/samplePosts";
import { filterPublishedPosts, getPublishedPostBySlug, type BlogPost } from "@/lib/cms/types";

describe("filterPublishedPosts", () => {
  it("returns only posts with publishedAt set (Strapi publish semantics)", () => {
    const posts: BlogPost[] = [
      {
        id: "1",
        title: "A",
        slug: "a",
        excerpt: "x",
        bodyRichText: "<p>a</p>",
        authorName: "me",
        publishedAt: "2026-01-01T00:00:00.000Z",
      },
      {
        id: "2",
        title: "B",
        slug: "b",
        excerpt: "y",
        bodyRichText: "<p>b</p>",
        authorName: "me",
        publishedAt: null,
      },
    ];
    const published = filterPublishedPosts(posts);
    expect(published).toHaveLength(1);
    expect(published[0]?.id).toBe("1");
  });

  it("excludes draft placeholder from sample data", () => {
    const published = filterPublishedPosts(allBlogPosts);
    expect(published.every((p) => p.slug !== "faq-abstimmung-entwurf")).toBe(true);
    expect(published.length).toBeGreaterThanOrEqual(2);
  });
});

describe("getPublishedPostBySlug", () => {
  it("returns undefined for draft slug", () => {
    expect(getPublishedPostBySlug(allBlogPosts, "faq-abstimmung-entwurf")).toBeUndefined();
  });

  it("returns published post by slug", () => {
    const post = getPublishedPostBySlug(allBlogPosts, "programm-april");
    expect(post?.title).toContain("April");
  });
});
