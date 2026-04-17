import { afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ZeugnisseSection, type SectionTestimony } from "@/components/sections/ZeugnisseSection";

const testimonies: SectionTestimony[] = [
  { id: "1", quote: "Erstes Zitat", displayLabel: "Anwohnerin", isApproved: true },
  { id: "2", quote: "Zweites Zitat", displayLabel: "Kulturarbeiter", isApproved: true },
  { id: "3", quote: "Nicht freigegeben", displayLabel: "X", isApproved: false },
];

describe("ZeugnisseSection", () => {
  afterEach(() => cleanup());

  it("renders the first approved testimony as the opener", () => {
    render(<ZeugnisseSection testimonies={testimonies} introHtml="<p>i</p>" />);
    expect(screen.getByText(/erstes zitat/i)).toBeInTheDocument();
  });

  it("hides non-approved testimonies", () => {
    render(<ZeugnisseSection testimonies={testimonies} introHtml="<p>i</p>" />);
    expect(screen.queryByText(/nicht freigegeben/i)).not.toBeInTheDocument();
  });

  it("assigns deterministic rotation classes to cards", () => {
    const { container } = render(
      <ZeugnisseSection
        testimonies={[
          { id: "1", quote: "A", displayLabel: "X", isApproved: true },
          { id: "2", quote: "B", displayLabel: "X", isApproved: true },
          { id: "3", quote: "C", displayLabel: "X", isApproved: true },
          { id: "4", quote: "D", displayLabel: "X", isApproved: true },
        ]}
        introHtml="<p>i</p>"
      />
    );
    const cards = container.querySelectorAll("[data-rot]");
    expect(cards.length).toBeGreaterThan(0);
    const rotations = Array.from(cards).map((c) => c.getAttribute("data-rot"));
    expect(new Set(rotations).size).toBeGreaterThan(1);
  });
});
