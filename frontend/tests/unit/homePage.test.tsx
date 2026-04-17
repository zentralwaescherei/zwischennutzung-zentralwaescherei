import { afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "@/app/page";

describe("HomePage (one-pager)", () => {
  afterEach(() => cleanup());

  it("renders all five anchor sections in order", () => {
    const { container } = render(<HomePage />);
    const ids = Array.from(container.querySelectorAll("section[id]")).map((s) => s.id);
    expect(ids).toEqual(["start", "intro", "organisationen", "zeugnisse", "blog"]);
  });

  it("shows hero headline", () => {
    render(<HomePage />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });
});
