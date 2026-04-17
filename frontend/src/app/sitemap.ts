import type { MetadataRoute } from "next";

import { allBlogPosts } from "@/lib/blog/samplePosts";
import { filterPublishedPosts } from "@/lib/cms/types";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://zentralwaescherei.example";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = filterPublishedPosts(allBlogPosts);
  return [
    { url: `${BASE}/`, lastModified: new Date() },
    ...posts.map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: new Date(p.publishDate ?? p.publishedAt ?? Date.now()),
    })),
  ];
}
