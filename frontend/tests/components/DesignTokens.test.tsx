import { describe, expect, it } from "vitest";

import {
  posterThemeClass,
  posterColors,
  posterFonts,
} from "@/styles/theme";

describe("posterThemeClass", () => {
  it("uses neo-poster-minimal theme classname", () => {
    expect(posterThemeClass).toBe("theme-neo-poster-minimal");
  });
});

describe("posterColors", () => {
  it("exposes bone, ink, acid, cobalt tokens", () => {
    expect(posterColors).toEqual({
      bone: "#F5F1E6",
      ink: "#0B0B0B",
      acid: "#F2FF3D",
      cobalt: "#0A1CFF",
    });
  });
});

describe("posterFonts", () => {
  it("declares display and mono families", () => {
    expect(posterFonts.display).toContain("Monument");
    expect(posterFonts.mono).toContain("Mono");
  });
});
