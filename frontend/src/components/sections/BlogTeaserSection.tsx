import Link from "next/link";

import type { BlogPost } from "@/lib/cms/types";

type Props = { posts: BlogPost[] };

function formatDate(iso?: string | null) {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("de-CH", { dateStyle: "medium" }).format(new Date(iso));
  } catch {
    return "";
  }
}

export function BlogTeaserSection({ posts }: Props) {
  const top = [...posts]
    .sort((a, b) => (b.publishDate ?? b.publishedAt ?? "").localeCompare(a.publishDate ?? a.publishedAt ?? ""))
    .slice(0, 3);

  return (
    <section id="blog" aria-labelledby="blog-title" className="section section--blog">
      <div className="blog-header">
        <p className="mono" aria-hidden="true">04 / BLOG</p>
        <h2 id="blog-title" className="display blog-title">Neuigkeiten</h2>
      </div>
      {top.length === 0 ? (
        <p className="mono">NOCH KEINE BEITRAEGE — BALD MEHR.</p>
      ) : (
        <div className="blog-grid">
          {top.map((post) => (
            <Link key={String(post.id)} className="blog-card" href={`/blog/${post.slug}`}>
              <p className="mono blog-card__meta">{formatDate(post.publishDate ?? post.publishedAt)}</p>
              <h3 className="display blog-card__title">{post.title}</h3>
              <p className="blog-card__excerpt">{post.excerpt}</p>
              <span className="mono blog-card__cta" aria-hidden="true">ZUM BEITRAG →</span>
            </Link>
          ))}
        </div>
      )}
      <hr className="blog-rule" />
      <p className="mono blog-footnote">WEITERE BEITRAEGE FOLGEN</p>
    </section>
  );
}
