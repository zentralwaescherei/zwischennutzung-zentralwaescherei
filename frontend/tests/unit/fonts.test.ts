import { describe, expect, it } from "vitest";

import { monumentDisplay, monumentMono } from "@/lib/fonts";

describe("fonts module", () => {
  it("exposes a display font with a CSS variable", () => {
    expect(monumentDisplay.variable).toBe("--font-monument-display");
    expect(typeof monumentDisplay.className).toBe("string");
  });

  it("exposes a mono font with a CSS variable", () => {
    expect(monumentMono.variable).toBe("--font-monument-mono");
    expect(typeof monumentMono.className).toBe("string");
  });
});
