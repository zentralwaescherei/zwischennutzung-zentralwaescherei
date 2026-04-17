type BlogDetailPageProps = {
  params: {
    slug: string;
  };
};

export default function BlogDetailPage({ params }: BlogDetailPageProps) {
  return (
    <article style={{ display: "grid", gap: "1rem", maxWidth: "48rem" }}>
      <p style={{ margin: 0, fontSize: "0.875rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        Route Skeleton
      </p>
      <h1 style={{ margin: 0 }}>Beitrag: {params.slug}</h1>
      <p style={{ margin: 0, lineHeight: 1.6 }}>
        Diese Detailroute ist vorbereitet, um spaeter einen einzelnen veroeffentlichten Blogbeitrag
        aus dem CMS darzustellen.
      </p>
    </article>
  );
}
