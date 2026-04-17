"use client";

import type { KeyboardEvent } from "react";

type HouseMapProps = {
  selectedZoneId: string | null;
  onSelect: (zoneId: string | null) => void;
};

type MapZone = {
  id: string;
  label: string;
  shortLabel: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export const HOUSE_MAP_ZONES: MapZone[] = [
  { id: "eg", label: "Erdgeschoss", shortLabel: "EG", x: 16, y: 126, width: 208, height: 76 },
  { id: "og1", label: "1. Obergeschoss", shortLabel: "OG1", x: 48, y: 76, width: 176, height: 42 },
  { id: "og2", label: "2. Obergeschoss", shortLabel: "OG2", x: 80, y: 32, width: 144, height: 36 },
];

export function getHouseMapZoneLabel(zoneId: string | null): string | null {
  if (!zoneId) {
    return null;
  }

  return HOUSE_MAP_ZONES.find((zone) => zone.id === zoneId)?.label ?? `Bereich ${zoneId}`;
}

function isKeyboardSelection(event: KeyboardEvent<SVGGElement>) {
  return event.key === "Enter" || event.key === " ";
}

export function HouseMap({ selectedZoneId, onSelect }: HouseMapProps) {
  return (
    <section
      aria-label="Hauskarte Filter"
      style={{
        display: "grid",
        gap: "1rem",
        padding: "1.25rem",
        border: "1px solid #111111",
        backgroundColor: "#fffdf8",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "0.75rem",
        }}
      >
        <div style={{ display: "grid", gap: "0.35rem" }}>
          <p
            style={{
              margin: 0,
              fontSize: "0.75rem",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Hauskarte
          </p>
          <p style={{ margin: 0, maxWidth: "34rem", lineHeight: 1.6 }}>
            Waehle einen Bereich direkt im Haus, um die Liste zu filtern.
          </p>
        </div>

        <button
          aria-pressed={selectedZoneId === null}
          onClick={() => onSelect(null)}
          style={{
            border: "1px solid #111111",
            backgroundColor: selectedZoneId === null ? "#c5d6ff" : "#ffffff",
            color: "#111111",
            padding: "0.65rem 0.9rem",
            cursor: "pointer",
          }}
          type="button"
        >
          Alle Bereiche
        </button>
      </div>

      <svg
        aria-labelledby="house-map-title house-map-description"
        role="img"
        viewBox="0 0 240 220"
        style={{ width: "100%", height: "auto", display: "block" }}
      >
        <title id="house-map-title">Hauskarte Zwischennutzung Zentralwaescherei</title>
        <desc id="house-map-description">
          Interaktive, schematische Hauskarte mit waehlbaren Bereichen fuer Erdgeschoss, erstes
          Obergeschoss und zweites Obergeschoss.
        </desc>

        <rect
          fill="#f1eee5"
          height="192"
          stroke="#111111"
          strokeWidth="1.5"
          width="176"
          x="48"
          y="16"
        />

        {HOUSE_MAP_ZONES.map((zone) => {
          const isSelected = selectedZoneId === zone.id;

          return (
            <g
              aria-label={zone.label}
              aria-pressed={isSelected}
              key={zone.id}
              onClick={() => onSelect(zone.id)}
              onKeyDown={(event) => {
                if (!isKeyboardSelection(event)) {
                  return;
                }

                event.preventDefault();
                onSelect(zone.id);
              }}
              role="button"
              tabIndex={0}
            >
              <rect
                fill={isSelected ? "#c5d6ff" : "#ffffff"}
                height={zone.height}
                stroke="#111111"
                strokeWidth={isSelected ? "3" : "1.5"}
                width={zone.width}
                x={zone.x}
                y={zone.y}
              />
              <text
                aria-hidden="true"
                fill="#111111"
                fontFamily="inherit"
                fontSize="12"
                fontWeight="700"
                pointerEvents="none"
                textAnchor="middle"
                x={zone.x + zone.width / 2}
                y={zone.y + zone.height / 2 + 4}
              >
                {zone.shortLabel}
              </text>
            </g>
          );
        })}
      </svg>
    </section>
  );
}
