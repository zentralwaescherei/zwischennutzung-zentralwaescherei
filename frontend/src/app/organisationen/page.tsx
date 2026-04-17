"use client";

import { useMemo, useState } from "react";

import { HouseMap } from "@/components/map/HouseMap";
import { OrganisationList } from "@/components/organisations/OrganisationList";
import type { Organisation } from "@/lib/cms/types";
import { byFloorArea } from "@/lib/filter/byFloorArea";

const organisations: Organisation[] = [
  {
    id: "werkstatt",
    slug: "werkstatt",
    name: "Werkstatt",
    shortDescription:
      "Offene Infrastruktur fuer gemeinsames Reparieren, Bauen und experimentelles Lernen.",
    websiteUrl: "https://example.org/werkstatt",
    categoryTags: ["Werkstatt", "Offen"],
    floorArea: {
      id: "eg",
      name: "Erdgeschoss",
      slug: "eg",
      svgZoneId: "eg",
      description: "Offene Produktions- und Begegnungsflaechen.",
      sortOrder: 1,
    },
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
    floorArea: {
      id: "og1",
      name: "1. Obergeschoss",
      slug: "og1",
      svgZoneId: "og1",
      description: "Raeume fuer Redaktions- und Projektarbeit.",
      sortOrder: 2,
    },
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
    floorArea: {
      id: "og2",
      name: "2. Obergeschoss",
      slug: "og2",
      svgZoneId: "og2",
      description: "Raeume fuer Austausch, Verpflegung und Treffen.",
      sortOrder: 3,
    },
    logoOrImage: null,
    isFeatured: false,
  },
];

export default function OrganisationenPage() {
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

  const filteredOrganisations = useMemo(
    () => byFloorArea(organisations, selectedZoneId),
    [selectedZoneId],
  );
  const selectedFloorArea = useMemo(
    () =>
      organisations.find((organisation) => organisation.floorArea.svgZoneId === selectedZoneId)
        ?.floorArea ?? null,
    [selectedZoneId],
  );

  return (
    <section style={{ display: "grid", gap: "2rem" }}>
      <div style={{ display: "grid", gap: "1rem", maxWidth: "48rem" }}>
        <p
          style={{
            margin: 0,
            fontSize: "0.875rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Verzeichnis
        </p>
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(2.5rem, 8vw, 4.75rem)",
            lineHeight: 0.95,
          }}
        >
          Organisationen im Haus
        </h1>
        <p style={{ margin: 0, lineHeight: 1.7 }}>
          Das Verzeichnis gibt einen schnellen Ueberblick ueber die Akteurinnen und Akteure der
          Zwischennutzung. Jede Karte fuehrt direkt zur Website und oeffnet auf Wunsch ein ruhiges
          Detailblatt mit Kurzprofil und Standort im Haus. Die Hauskarte filtert den Bestand direkt
          nach Ebene.
        </p>
      </div>

      <div style={{ display: "grid", gap: "1.25rem" }}>
        <HouseMap onSelect={setSelectedZoneId} selectedZoneId={selectedZoneId} />

        <div
          aria-live="polite"
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "baseline",
            gap: "0.75rem",
            borderBottom: "1px solid #111111",
            paddingBottom: "0.75rem",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {selectedFloorArea ? `Filter aktiv: ${selectedFloorArea.name}` : "Alle Bereiche"}
          </p>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            {filteredOrganisations.length} Organisation
            {filteredOrganisations.length === 1 ? "" : "en"} sichtbar
          </p>
        </div>

        <OrganisationList organisations={filteredOrganisations} />
      </div>
    </section>
  );
}
