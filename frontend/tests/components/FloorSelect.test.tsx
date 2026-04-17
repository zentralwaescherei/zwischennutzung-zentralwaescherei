import { afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { FloorSelect } from "@/components/map/FloorSelect";

const zones = [
  { id: "eg", label: "Erdgeschoss" },
  { id: "og1", label: "1. Obergeschoss" },
];

describe("FloorSelect", () => {
  afterEach(() => cleanup());

  it("renders zones as options plus an 'all' entry", () => {
    render(<FloorSelect zones={zones} selectedZoneId={null} onChange={() => {}} />);
    expect(screen.getByRole("option", { name: /alle bereiche/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /erdgeschoss/i })).toBeInTheDocument();
  });

  it("calls onChange with the selected zone id", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<FloorSelect zones={zones} selectedZoneId={null} onChange={onChange} />);
    await user.selectOptions(screen.getByRole("combobox", { name: /bereich/i }), "og1");
    expect(onChange).toHaveBeenCalledWith("og1");
  });
});
