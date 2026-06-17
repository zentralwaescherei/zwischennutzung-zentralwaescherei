import { afterEach } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Reveal } from "@/components/motion/Reveal";

describe("Reveal", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("renders children and adds a data-reveal attribute", () => {
    const { container } = render(<Reveal><p>child</p></Reveal>);
    expect(container.querySelector("[data-reveal]")).not.toBeNull();
  });

  it("is visible immediately when reduced motion is preferred", () => {
    const mql = {
      matches: true,
      media: "(prefers-reduced-motion: reduce)",
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    vi.stubGlobal("matchMedia", () => mql);
    const { container } = render(<Reveal><p>c</p></Reveal>);
    expect(container.querySelector("[data-reveal='in']")).not.toBeNull();
  });
});
