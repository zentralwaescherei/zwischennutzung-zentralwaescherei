import Link from "next/link";

const quickLinks = [
  {
    href: "/organisationen",
    title: "Hauskarte",
    description: "Direkter Einstieg zur Orientierung im Haus und zum Lageplan der Bereiche.",
    linkLabel: "Zur Hauskarte",
  },
  {
    href: "/organisationen",
    title: "Organisationen",
    description: "Ueberblick ueber alle Akteurinnen und Akteure im Haus.",
  },
  {
    href: "/zeugnisse",
    title: "Zeugnisse",
    description: "Persoenliche Stimmen zur Bedeutung der Zwischennutzung.",
  },
  {
    href: "/blog",
    title: "Blog",
    description: "Aktuelle Einblicke, Termine und redaktionelle Updates.",
  },
];

export default function HomePage() {
  return (
    <section style={{ display: "grid", gap: "2rem" }}>
      <div style={{ display: "grid", gap: "1rem", maxWidth: "48rem" }}>
        <p style={{ margin: 0, fontSize: "0.875rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Website V1
        </p>
        <h1 style={{ margin: 0, fontSize: "clamp(2.5rem, 8vw, 5rem)", lineHeight: 1 }}>
          Zwischennutzung Zentralwaescherei
        </h1>
        <p style={{ margin: 0, fontSize: "1.125rem", lineHeight: 1.6 }}>
          Diese Startseite bildet die erste oeffentliche Struktur fuer Informationen zu Organisationen,
          Zeugnissen und redaktionellen Updates aus dem Haus.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))",
        }}
      >
        {quickLinks.map((item) => (
          <article
            key={`${item.href}-${item.title}`}
            style={{
              border: "1px solid #111111",
              padding: "1.25rem",
              backgroundColor: "#ffffff",
            }}
          >
            <h2 style={{ marginTop: 0 }}>{item.title}</h2>
            <p>{item.description}</p>
            <Link href={item.href}>{item.linkLabel ?? "Zur Seite"}</Link>
          </article>
        ))}
      </div>
    </section>
  );
}
