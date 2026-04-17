import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "@/app/page";

describe("HomePage", () => {
  it("shows a house map quick-access link", () => {
    render(<HomePage />);

    expect(screen.getByRole("link", { name: /hauskarte/i })).toHaveAttribute(
      "href",
      "/organisationen",
    );
  });
});
