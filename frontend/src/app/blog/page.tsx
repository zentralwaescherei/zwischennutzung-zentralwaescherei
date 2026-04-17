import Link from "next/link";

const placeholderPosts = [
  {
    slug: "v1-platzhalter",
    title: "V1 Platzhalter",
    excerpt: "Diese Route ist fuer die kuenftige Blog-Uebersicht vorbereitet.",
  },
];

export default function BlogIndexPage() {
  return (
    <section style={{ display: "grid", gap: "1.5rem", maxWidth: "48rem" }}>
      <div style={{ display: "grid", gap: "1rem" }}>
        <p style={{ margin: 0, fontSize: "0.875rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Route Skeleton
        </p>
        <h1 style={{ margin: 0 }}>Blog</h1>
        <p style={{ margin: 0, lineHeight: 1.6 }}>
          Hier erscheint spaeter die Liste aller veroeffentlichten Beitraege aus dem CMS.
        </p>
      </div>

      <div style={{ display: "grid", gap: "1rem" }}>
        {placeholderPosts.map((post) => (
          <article
            key={post.slug}
            style={{
              border: "1px solid #111111",
              padding: "1.25rem",
              backgroundColor: "#ffffff",
            }}
          >
            <h2 style={{ marginTop: 0 }}>{post.title}</h2>
            <p>{post.excerpt}</p>
            <Link href={`/blog/${post.slug}`}>Zum Beitrag</Link>
          </article>
        ))}
      </div>
    </section>
  );
}
