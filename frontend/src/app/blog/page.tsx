import Link from "next/link";

import { allBlogPosts } from "@/lib/blog/samplePosts";
import { filterPublishedPosts } from "@/lib/cms/types";

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("de-CH", { dateStyle: "medium" }).format(new Date(iso));
  } catch {
    return "";
  }
}

export default function BlogIndexPage() {
  const posts = filterPublishedPosts(allBlogPosts);

  return (
    <section style={{ display: "grid", gap: "1.5rem", maxWidth: "48rem" }}>
      <div style={{ display: "grid", gap: "1rem" }}>
        <p style={{ margin: 0, fontSize: "0.875rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Blog
        </p>
        <h1 style={{ margin: 0, fontSize: "clamp(2rem, 6vw, 3rem)", lineHeight: 1.1 }}>Blog</h1>
        <p style={{ margin: 0, lineHeight: 1.6 }}>
          Veroeffentlichte Beitraege aus der Zwischennutzung. Entwuerfe erscheinen hier nicht; sie bleiben im CMS,
          bis sie publiziert sind.
        </p>
      </div>

      {posts.length === 0 ? (
        <p style={{ margin: 0 }}>Aktuell sind keine veroeffentlichten Beitraege vorhanden.</p>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {posts.map((post) => (
            <article
              key={String(post.id)}
              style={{
                border: "1px solid #111111",
                padding: "1.25rem",
                backgroundColor: "#ffffff",
              }}
            >
              <h2 style={{ marginTop: 0 }}>{post.title}</h2>
              <p style={{ margin: "0.5rem 0", color: "#333333", fontSize: "0.9rem" }}>
                {formatDate(post.publishDate ?? post.publishedAt)} · {post.authorName}
              </p>
              <p style={{ margin: "0 0 1rem", lineHeight: 1.55 }}>{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`}>Zum Beitrag</Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
