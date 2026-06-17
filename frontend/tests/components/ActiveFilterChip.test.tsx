import { afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ActiveFilterChip } from "@/components/motion/ActiveFilterChip";

describe("ActiveFilterChip", () => {
  afterEach(() => cleanup());

  it("shows zone label and a clear button", async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    render(<ActiveFilterChip label="KELLER" onClear={onClear} />);
    expect(screen.getByText(/zone:/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /filter entfernen/i }));
    expect(onClear).toHaveBeenCalledOnce();
  });

  it("falls back to ALLE when label is null", () => {
    render(<ActiveFilterChip label={null} onClear={() => {}} />);
    expect(screen.getByText("ALLE")).toBeInTheDocument();
  });
});
