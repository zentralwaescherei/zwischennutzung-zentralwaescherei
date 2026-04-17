import type { Testimony } from "@/lib/cms/types";
import { TextBlockSection } from "@/components/content/TextBlockSection";

/** Placeholder data until CMS fetch is wired in a later task */
const sampleTestimonies: Testimony[] = [
  {
    id: "t1",
    quote:
      "Fuer mich ist dieser Ort ein Experimentierraum: offen, neugierig und ohne starre Hierarchien. Hier entstehen Begegnungen, die sonst kaum passieren.",
    personName: "Mina Keller",
    displayLabel: "Besucherin",
    roleContext: "Kulturinteressiert",
    isApproved: true,
    sortOrder: 0,
  },
  {
    id: "t2",
    quote:
      "Die Zwischennutzung zeigt, wie viel Potenzial in bestehenden Gebaeuden steckt, wenn Raum fuer Ideen bleibt.",
    personName: "Jonas Frei",
    displayLabel: "Nachbar",
    isApproved: true,
    sortOrder: 1,
  },
  {
    id: "t3",
    quote: "Ich komme fuer Workshops und bleibe fuer die Atmosphaere. Es fuehlt sich an wie ein offenes Wohnzimmer fuer die Stadt.",
    isAnonymous: true,
    displayLabel: "Teilnehmerin",
    isApproved: true,
    sortOrder: 2,
  },
];

function testimonyAttribution(t: Testimony): string {
  if (t.isAnonymous) {
    return t.displayLabel ?? "Anonym";
  }
  const parts = [t.personName, t.displayLabel, t.roleContext].filter(Boolean);
  return parts.join(" · ");
}

export default function ZeugnissePage() {
  return (
    <div style={{ display: "grid", gap: "2.5rem", maxWidth: "52rem" }}>
      <header style={{ display: "grid", gap: "0.75rem" }}>
        <p style={{ margin: 0, fontSize: "0.875rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Zeugnisse
        </p>
        <h1 style={{ margin: 0, fontSize: "clamp(2rem, 6vw, 3rem)", lineHeight: 1.1 }}>Stimmen zur Zwischennutzung</h1>
      </header>

      <TextBlockSection
        sectionId="zeugnisse-intro"
        title="Was die Zwischennutzung bedeutet"
        bodyHtml="<p>Kuratierte Zitate und kurze Statements von Menschen, die den Ort nutzen, begleiten oder aus der Nachbarschaft kommen. Redaktionell freigegebene Eintraege erscheinen hier oeffentlich.</p>"
      />

      <section aria-labelledby="zeugnisse-list-heading" style={{ display: "grid", gap: "1.25rem" }}>
        <h2 id="zeugnisse-list-heading" style={{ margin: 0, fontSize: "1.25rem" }}>
          Ausgewaehlte Zeugnisse
        </h2>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "1.25rem" }}>
          {sampleTestimonies.map((t) => (
            <li
              key={String(t.id)}
              style={{
                border: "1px solid #111111",
                padding: "1.25rem",
                backgroundColor: "#ffffff",
              }}
            >
              <blockquote style={{ margin: 0, fontSize: "1.125rem", lineHeight: 1.55 }}>&ldquo;{t.quote}&rdquo;</blockquote>
              <p style={{ margin: "1rem 0 0", fontSize: "0.9rem", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                {testimonyAttribution(t)}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
