import { describe, expect, it } from "vitest";

import { byFloorArea } from "@/lib/filter/byFloorArea";

describe("byFloorArea", () => {
  it("returns all organisations when no zone is selected", () => {
    const organisations = [
      { id: "1", floorArea: { svgZoneId: "eg" } },
      { id: "2", floorArea: { svgZoneId: "og1" } },
    ];

    expect(byFloorArea(organisations, null)).toHaveLength(2);
  });

  it("returns only organisations that match the selected zone", () => {
    const organisations = [
      { id: "1", floorArea: { svgZoneId: "eg" } },
      { id: "2", floorArea: { svgZoneId: "og1" } },
      { id: "3", floorArea: { svgZoneId: "og2" } },
    ];

    expect(byFloorArea(organisations, "eg").map((organisation) => organisation.id)).toEqual([
      "1",
    ]);
  });
});
