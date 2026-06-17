import { afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BlogTeaserSection } from "@/components/sections/BlogTeaserSection";
import type { BlogPost } from "@/lib/cms/types";

const posts = [
  { id: 1, slug: "a", title: "A", excerpt: "a ex", bodyRichText: "<p>a</p>", publishDate: "2026-03-01", authorName: "Jo", publishedAt: "2026-03-01" },
  { id: 2, slug: "b", title: "B", excerpt: "b ex", bodyRichText: "<p>b</p>", publishDate: "2026-03-02", authorName: "Jo", publishedAt: "2026-03-02" },
  { id: 3, slug: "c", title: "C", excerpt: "c ex", bodyRichText: "<p>c</p>", publishDate: "2026-03-03", authorName: "Jo", publishedAt: "2026-03-03" },
  { id: 4, slug: "d", title: "D", excerpt: "d ex", bodyRichText: "<p>d</p>", publishDate: "2026-03-04", authorName: "Jo", publishedAt: "2026-03-04" },
] satisfies BlogPost[];

describe("BlogTeaserSection", () => {
  afterEach(() => cleanup());

  it("renders at most 3 cards, each linking to /blog/[slug]", () => {
    render(<BlogTeaserSection posts={posts} />);
    const links = screen.getAllByRole("link").filter((l) => l.getAttribute("href")?.startsWith("/blog/"));
    expect(links).toHaveLength(3);
    expect(links[0]).toHaveAttribute("href", "/blog/d");
  });

  it("shows the empty-state copy when no posts exist", () => {
    render(<BlogTeaserSection posts={[]} />);
    expect(screen.getByText(/noch keine beitraege/i)).toBeInTheDocument();
  });
});
