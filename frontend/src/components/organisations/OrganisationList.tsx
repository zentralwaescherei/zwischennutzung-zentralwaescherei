"use client";

import { useMemo, useState } from "react";

import { OrganisationDetailSheet } from "@/components/organisations/OrganisationDetailSheet";
import type { Organisation } from "@/lib/cms/types";

type OrganisationListItem = Pick<
  Organisation,
  "id" | "name" | "shortDescription" | "websiteUrl"
> & {
  floorArea: Pick<Organisation["floorArea"], "name" | "slug" | "svgZoneId">;
};

type OrganisationListProps = {
  organisations: OrganisationListItem[];
};

export function OrganisationList({ organisations }: OrganisationListProps) {
  const [selectedOrganisationId, setSelectedOrganisationId] = useState<
    OrganisationListItem["id"] | null
  >(null);

  const selectedOrganisation = useMemo(
    () =>
      organisations.find(
        (organisation) => organisation.id === selectedOrganisationId,
      ) ?? null,
    [organisations, selectedOrganisationId],
  );

  return (
    <>
      <ul
        style={{
          display: "grid",
          gap: "1rem",
          listStyle: "none",
          margin: 0,
          padding: 0,
        }}
      >
        {organisations.map((organisation) => (
          <li
            key={organisation.id}
            style={{
              display: "grid",
              gap: "1rem",
              border: "1px solid #111111",
              backgroundColor: "#ffffff",
              padding: "1.25rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "start",
                justifyContent: "space-between",
                gap: "1rem",
              }}
            >
              <div style={{ display: "grid", gap: "0.5rem", maxWidth: "36rem" }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.75rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                  }}
                >
                  {organisation.floorArea.name}
                </p>
                <h2 style={{ margin: 0, fontSize: "1.5rem", lineHeight: 1 }}>
                  {organisation.name}
                </h2>
                <p style={{ margin: 0, lineHeight: 1.6 }}>
                  {organisation.shortDescription}
                </p>
              </div>

              <button
                aria-label={`Details ${organisation.name}`}
                onClick={() => setSelectedOrganisationId(organisation.id)}
                style={{
                  border: "1px solid #111111",
                  backgroundColor: "#c5d6ff",
                  color: "#111111",
                  padding: "0.75rem 1rem",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
                type="button"
              >
                Details
              </button>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
              <a
                aria-label={`Website ${organisation.name}`}
                href={organisation.websiteUrl}
                rel="noreferrer"
                style={{
                  color: "#111111",
                  textDecorationThickness: "0.1em",
                  textUnderlineOffset: "0.18em",
                }}
                target="_blank"
              >
                Website
              </a>
            </div>
          </li>
        ))}
      </ul>

      <OrganisationDetailSheet
        organisation={selectedOrganisation}
        onClose={() => setSelectedOrganisationId(null)}
      />
    </>
  );
}
