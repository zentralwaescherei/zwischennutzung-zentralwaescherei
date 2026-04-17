"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { FloorSelect } from "@/components/map/FloorSelect";
import {
  HouseMap,
  HOUSE_MAP_ZONES,
  getHouseMapZoneLabel,
} from "@/components/map/HouseMap";
import { OrganisationList } from "@/components/organisations/OrganisationList";
import type { Organisation } from "@/lib/cms/types";
import { byFloorArea } from "@/lib/filter/byFloorArea";

type Props = {
  organisations: Organisation[];
  initialZoneId: string | null;
};

export function OrganisationsSection({ organisations, initialZoneId }: Props) {
  const [zone, setZone] = useState<string | null>(initialZoneId);
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    const params = new URLSearchParams(window.location.search);
    if (zone) params.set("zone", zone);
    else params.delete("zone");
    const qs = params.toString();
    const url = `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash || "#organisationen"}`;
    window.history.replaceState(null, "", url);
  }, [zone]);

  const filtered = useMemo(() => byFloorArea(organisations, zone), [organisations, zone]);

  const zones = useMemo(
    () => HOUSE_MAP_ZONES.map((z) => ({ id: z.id, label: z.label })),
    [],
  );

  const label = getHouseMapZoneLabel(zone);

  return (
    <section id="organisationen" aria-labelledby="org-title" className="section section--org">
      <div className="org-header">
        <p className="mono org-header__number" aria-hidden="true">03 / HAUS</p>
        <h2 id="org-title" className="display display--outline org-header__title">
          Organisationen
        </h2>
        <div className="org-header__chip mono" aria-live="polite">
          {zone ? (
            <>
              ZONE: {label ?? zone}{" "}
              <button type="button" aria-label="Filter entfernen" onClick={() => setZone(null)}>
                ✕
              </button>
            </>
          ) : (
            "ALLE"
          )}
        </div>
      </div>

      <div className="org-body">
        <div className="org-map">
          <FloorSelect zones={zones} selectedZoneId={zone} onChange={setZone} />
          <HouseMap onSelect={setZone} selectedZoneId={zone} />
        </div>
        <div className="org-list">
          {filtered.length === 0 ? (
            <p className="mono org-empty">
              KEINE ORGANISATIONEN IN DIESEM BEREICH —{" "}
              <button type="button" onClick={() => setZone(null)}>
                ALLE ANZEIGEN →
              </button>
            </p>
          ) : (
            <OrganisationList organisations={filtered} />
          )}
        </div>
      </div>
    </section>
  );
}
