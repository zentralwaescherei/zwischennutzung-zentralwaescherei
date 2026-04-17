type Zone = { id: string; label: string };

type FloorSelectProps = {
  zones: Zone[];
  selectedZoneId: string | null;
  onChange: (zoneId: string | null) => void;
};

export function FloorSelect({ zones, selectedZoneId, onChange }: FloorSelectProps) {
  return (
    <label className="mono floor-select">
      <span className="floor-select__label">Bereich</span>
      <select
        aria-label="Bereich"
        className="floor-select__input"
        value={selectedZoneId ?? ""}
        onChange={(e) => onChange(e.target.value === "" ? null : e.target.value)}
      >
        <option value="">ALLE BEREICHE</option>
        {zones.map((z) => (
          <option key={z.id} value={z.id}>
            {z.label.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}
