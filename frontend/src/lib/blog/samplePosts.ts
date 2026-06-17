import type { BlogPost } from "@/lib/cms/types";

/**
 * Placeholder posts until Strapi listing is wired.
 * Draft vs published follows Strapi draft/publish: `publishedAt` set means public.
 */
export const allBlogPosts: BlogPost[] = [
  {
    id: "bp-1",
    title: "Zwischennutzung erklaert",
    slug: "zwischennutzung-erklaert",
    excerpt: "Kurz und klar: was Zwischennutzung bedeutet und warum sie fuer Staedte relevant ist.",
    bodyRichText:
      "<p>Zwischennutzung nutzt bestehende Flaechen fuer Uebergangszeiten: Kultur, Nachbarschaft und Experimente koennen wirken, bevor langfristige Plaene greifen.</p>",
    authorName: "Redaktion",
    publishDate: "2026-04-01T10:00:00.000Z",
    publishedAt: "2026-04-01T10:00:00.000Z",
  },
  {
    id: "bp-2",
    title: "Programm im April",
    slug: "programm-april",
    excerpt: "Offene Tage, Fuehrungen und Begegnungen im Haus.",
    bodyRichText: "<p>Details zu Terminen folgen hier fortlaufend. Schauen Sie regelmaessig vorbei.</p>",
    authorName: "Programmteam",
    publishDate: "2026-04-10T14:00:00.000Z",
    publishedAt: "2026-04-10T14:00:00.000Z",
  },
  {
    id: "bp-draft",
    title: "Entwurf: FAQ zur Abstimmung",
    slug: "faq-abstimmung-entwurf",
    excerpt: "Noch nicht oeffentlich: Antworten auf haeufige Fragen.",
    bodyRichText: "<p>Dieser Beitrag ist ein Entwurf und erscheint nicht in der oeffentlichen Liste.</p>",
    authorName: "Redaktion",
    publishDate: null,
    publishedAt: null,
  },
];
