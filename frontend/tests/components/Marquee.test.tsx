import { afterEach } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Marquee } from "@/components/motion/Marquee";

describe("Marquee", () => {
  afterEach(() => cleanup());

  it("renders the text twice to enable a seamless loop", () => {
    const { container } = render(<Marquee text="HELLO" />);
    const spans = container.querySelectorAll(".marquee__track > span");
    expect(spans).toHaveLength(2);
    expect(spans[0]).toHaveTextContent("HELLO");
  });
});
