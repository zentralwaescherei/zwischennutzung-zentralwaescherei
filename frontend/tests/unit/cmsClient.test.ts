import { describe, expect, it } from "vitest";

import { buildStrapiUrl } from "@/lib/cms/client";

describe("buildStrapiUrl", () => {
  it("builds an absolute API URL from the CMS base URL", () => {
    expect(buildStrapiUrl("/api/organisations")).toBe(
      "http://localhost:1337/api/organisations",
    );
  });
});
