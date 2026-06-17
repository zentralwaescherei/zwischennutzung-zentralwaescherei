import { afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HeroSection } from "@/components/sections/HeroSection";

describe("HeroSection", () => {
  afterEach(() => cleanup());

  it("renders the poster headline with both lines", () => {
    render(<HeroSection voteDateLabel="Abstimmung Juni 2026" />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toMatch(/zwischen/i);
    expect(h1.textContent).toMatch(/zentral/i);
  });

  it("renders CTA linking to #organisationen", () => {
    render(<HeroSection voteDateLabel="Abstimmung Juni 2026" />);
    const cta = screen.getByRole("link", { name: /organisationen entdecken/i });
    expect(cta).toHaveAttribute("href", "#organisationen");
  });

  it("anchor id is start", () => {
    const { container } = render(<HeroSection voteDateLabel="Abstimmung Juni 2026" />);
    expect(container.querySelector("section#start")).not.toBeNull();
  });
});
