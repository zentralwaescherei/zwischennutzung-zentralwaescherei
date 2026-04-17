import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import { HouseMap } from "@/components/map/HouseMap";

describe("HouseMap", () => {
  afterEach(() => {
    cleanup();
  });

  it("lets people select a zone with pointer input", () => {
    const handleSelect = vi.fn();

    render(<HouseMap selectedZoneId={null} onSelect={handleSelect} />);

    fireEvent.click(screen.getByRole("button", { name: /erdgeschoss/i }));

    expect(handleSelect).toHaveBeenCalledWith("eg");
  });

  it("lets people select a zone with keyboard input", () => {
    const handleSelect = vi.fn();

    render(<HouseMap selectedZoneId="eg" onSelect={handleSelect} />);

    const firstFloorZone = screen.getByRole("button", { name: /1\. obergeschoss/i });
    firstFloorZone.focus();
    fireEvent.keyDown(firstFloorZone, { key: "Enter" });

    expect(handleSelect).toHaveBeenCalledWith("og1");
  });

  it("offers a reset action and reflects the selected zone state", () => {
    const handleSelect = vi.fn();

    render(<HouseMap selectedZoneId="og2" onSelect={handleSelect} />);

    expect(screen.getByRole("button", { name: /2\. obergeschoss/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    fireEvent.click(screen.getByRole("button", { name: /alle bereiche/i }));

    expect(handleSelect).toHaveBeenCalledWith(null);
  });

  it("adds a zone-active class to the active zone element", () => {
    const { container } = render(<HouseMap selectedZoneId="eg" onSelect={() => {}} />);
    expect(container.querySelector('[data-zone="eg"].zone-active')).not.toBeNull();
  });
});
