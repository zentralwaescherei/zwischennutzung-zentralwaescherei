import { afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Scramble } from "@/components/motion/Scramble";

describe("Scramble", () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("eventually renders the target text", async () => {
    vi.useFakeTimers();
    render(<Scramble text="HALLO" durationMs={100} />);
    vi.advanceTimersByTime(200);
    expect(await screen.findByText("HALLO")).toBeInTheDocument();
  });

  it("renders the target immediately when reduced motion is preferred", () => {
    const mql = {
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      media: "(prefers-reduced-motion: reduce)",
    };
    vi.stubGlobal("matchMedia", () => mql);
    render(<Scramble text="HI" durationMs={10000} />);
    expect(screen.getByText("HI")).toBeInTheDocument();
  });
});
