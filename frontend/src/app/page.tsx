import { HeroSection } from "@/components/sections/HeroSection";
import { IntroSection } from "@/components/sections/IntroSection";
import { OrganisationsSection } from "@/components/sections/OrganisationsSection";
import { ZeugnisseSection } from "@/components/sections/ZeugnisseSection";
import { BlogTeaserSection } from "@/components/sections/BlogTeaserSection";
import { allBlogPosts } from "@/lib/blog/samplePosts";
import { filterPublishedPosts } from "@/lib/cms/types";
import type { Organisation } from "@/lib/cms/types";

export const revalidate = 300;

const sampleOrganisations: Organisation[] = [
  {
    id: "werkstatt",
    slug: "werkstatt",
    name: "Werkstatt",
    shortDescription:
      "Offene Infrastruktur fuer gemeinsames Reparieren, Bauen und experimentelles Lernen.",
    websiteUrl: "https://example.org/werkstatt",
    categoryTags: ["Werkstatt", "Offen"],
    floorArea: { id: "eg", name: "Erdgeschoss", slug: "eg", svgZoneId: "eg", sortOrder: 1 },
    logoOrImage: null,
    isFeatured: true,
  },
  {
    id: "radio",
    slug: "radio",
    name: "Radio Zentral",
    shortDescription:
      "Community-Redaktion fuer lokale Stimmen, Workshops und niedrigschwellige Medienpraxis.",
    websiteUrl: "https://example.org/radio-zentral",
    categoryTags: ["Medien", "Community"],
    floorArea: { id: "og1", name: "1. Obergeschoss", slug: "og1", svgZoneId: "og1", sortOrder: 2 },
    logoOrImage: null,
    isFeatured: false,
  },
  {
    id: "kueche",
    slug: "kueche",
    name: "Kollektivkueche",
    shortDescription:
      "Gemeinsame Kochformate, nachbarschaftliche Treffen und Sorgearbeit rund um den Alltag im Haus.",
    websiteUrl: "https://example.org/kollektivkueche",
    categoryTags: ["Nachbarschaft", "Sorge"],
    floorArea: { id: "og2", name: "2. Obergeschoss", slug: "og2", svgZoneId: "og2", sortOrder: 3 },
    logoOrImage: null,
    isFeatured: false,
  },
];

const sampleTestimonies = [
  {
    id: "t1",
    quote: "Die Waescherei gibt uns einen Ort, den wir sonst nicht haetten.",
    displayLabel: "Anwohnerin",
    isApproved: true,
  },
  {
    id: "t2",
    quote: "Hier entsteht Nachbarschaft jenseits der reinen Nutzbarkeit.",
    displayLabel: "Kulturarbeiter",
    isApproved: true,
  },
];

export default function HomePage() {
  const posts = filterPublishedPosts(allBlogPosts);

  return (
    <>
      <HeroSection voteDateLabel="Abstimmung Juni 2026" />
      <IntroSection
        title="Ein Haus mit vielen Stimmen"
        bodyHtml="<p>Die Zwischennutzung Zentralwaescherei oeffnet Raum fuer Werkstatt, Medien, Nachbarschaft und Kultur — mitten in Zuerich.</p>"
        ctaLabel="Organisationen entdecken"
        ctaUrl="#organisationen"
      />
      <OrganisationsSection organisations={sampleOrganisations} initialZoneId={null} />
      <ZeugnisseSection
        testimonies={sampleTestimonies}
        introHtml="<p>Persoenliche Stimmen zur Bedeutung des Ortes.</p>"
      />
      <BlogTeaserSection posts={posts} />
    </>
  );
}
