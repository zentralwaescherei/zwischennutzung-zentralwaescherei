import { afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SiteFooter } from "@/components/layout/SiteFooter";

describe("SiteFooter", () => {
  afterEach(() => cleanup());

  it("renders KOLOFON headline", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("heading", { name: /kolofon/i })).toBeInTheDocument();
  });

  it("links to Impressum and Datenschutz", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("link", { name: /impressum/i })).toHaveAttribute("href", "/impressum");
    expect(screen.getByRole("link", { name: /datenschutz/i })).toHaveAttribute("href", "/datenschutz");
  });
});
