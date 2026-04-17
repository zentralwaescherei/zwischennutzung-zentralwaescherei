import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

import { VoteModeStrap } from "@/components/voting/VoteModeStrap";

describe("VoteModeStrap", () => {
  afterEach(() => cleanup());

  it("renders when enabled", () => {
    render(<VoteModeStrap enabled label="Abstimmung Juni 2026" latestPostSlug="a" />);
    expect(screen.getByRole("complementary")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /zum aktuellsten beitrag/i }),
    ).toHaveAttribute("href", "/blog/a");
  });

  it("renders nothing when disabled", () => {
    const { container } = render(
      <VoteModeStrap enabled={false} label="x" latestPostSlug="a" />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
