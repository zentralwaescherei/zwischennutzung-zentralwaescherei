export function byFloorArea<T extends { floorArea: { svgZoneId: string } }>(
  organisations: T[],
  zoneId: string | null,
): T[] {
  if (!zoneId) {
    return organisations;
  }

  return organisations.filter((organisation) => organisation.floorArea.svgZoneId === zoneId);
}
