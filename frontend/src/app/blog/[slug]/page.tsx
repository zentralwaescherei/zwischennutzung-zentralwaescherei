import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { allBlogPosts } from "@/lib/blog/samplePosts";
import { getPublishedPostBySlug } from "@/lib/cms/types";

type BlogDetailPageProps = {
  params: { slug: string };
};

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("de-CH", { dateStyle: "medium" }).format(new Date(iso));
  } catch {
    return "";
  }
}

export function generateStaticParams(): { slug: string }[] {
  return allBlogPosts.filter((p) => p.publishedAt).map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: BlogDetailPageProps): Metadata {
  const post = getPublishedPostBySlug(allBlogPosts, params.slug);
  if (!post) return { title: "Beitrag" };
  return { title: post.title, description: post.excerpt };
}

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  const post = getPublishedPostBySlug(allBlogPosts, params.slug);
  if (!post) notFound();

  return (
    <article style={{ display: "grid", gap: "1.25rem", maxWidth: "48rem" }}>
      <p style={{ margin: 0, fontSize: "0.875rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Blog</p>
      <header style={{ display: "grid", gap: "0.5rem" }}>
        <h1 style={{ margin: 0, fontSize: "clamp(2rem, 6vw, 3rem)", lineHeight: 1.1 }}>{post.title}</h1>
        <p style={{ margin: 0, color: "#333333", fontSize: "0.95rem" }}>
          {formatDate(post.publishDate ?? post.publishedAt)} · {post.authorName}
        </p>
      </header>
      <p style={{ margin: 0, lineHeight: 1.65, fontSize: "1.0625rem" }}>{post.excerpt}</p>
      <div dangerouslySetInnerHTML={{ __html: post.bodyRichText }} style={{ lineHeight: 1.65 }} />
      <p style={{ margin: 0 }}>
        <Link href="/blog">Zurueck zur Uebersicht</Link>
      </p>
    </article>
  );
}
