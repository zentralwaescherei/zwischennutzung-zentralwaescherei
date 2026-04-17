import { afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { IntroSection } from "@/components/sections/IntroSection";

describe("IntroSection", () => {
  afterEach(() => cleanup());

  it("renders heading and body", () => {
    render(
      <IntroSection
        title="Ein Haus mit vielen Stimmen"
        bodyHtml="<p>Intro Inhalt.</p>"
      />,
    );
    expect(screen.getByRole("heading", { level: 2, name: /ein haus/i })).toBeInTheDocument();
    expect(screen.getByText(/intro inhalt/i)).toBeInTheDocument();
  });

  it("renders anchor id intro", () => {
    const { container } = render(
      <IntroSection title="t" bodyHtml="<p>b</p>" />,
    );
    expect(container.querySelector("section#intro")).not.toBeNull();
  });
});
