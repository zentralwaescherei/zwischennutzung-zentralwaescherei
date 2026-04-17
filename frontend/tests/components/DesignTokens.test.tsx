import { describe, expect, it } from "vitest";

import { posterThemeClass } from "@/styles/theme";

describe("posterThemeClass", () => {
  it("uses neo-poster-minimal theme classname", () => {
    expect(posterThemeClass).toBe("theme-neo-poster-minimal");
  });
});
