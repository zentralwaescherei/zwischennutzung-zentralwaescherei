import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { SiteHeader } from "@/components/layout/SiteHeader";

describe("SiteHeader", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders a skip link targeting #main", () => {
    render(<SiteHeader />);
    const skip = screen.getByRole("link", { name: /zum inhalt springen/i });
    expect(skip).toHaveAttribute("href", "#main");
  });

  it("renders four anchor nav items pointing to section ids", () => {
    render(<SiteHeader />);
    const nav = screen.getByRole("navigation", { name: /hauptnavigation/i });
    const links = Array.from(nav.querySelectorAll("a")).map((a) => a.getAttribute("href"));
    expect(links).toEqual(["#start", "#organisationen", "#zeugnisse", "#blog"]);
  });
});
