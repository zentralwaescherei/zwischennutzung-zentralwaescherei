import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { OrganisationList } from "@/components/organisations/OrganisationList";

const organisations = [
  {
    id: "1",
    name: "Werkstatt",
    shortDescription: "Offene Infrastruktur fuer gemeinsames Reparieren und Bauen.",
    websiteUrl: "https://example.org",
    floorArea: {
      slug: "eg",
      name: "Erdgeschoss",
      svgZoneId: "eg",
    },
  },
];

describe("OrganisationList", () => {
  it("renders organisations and opens the detail sheet", () => {
    render(<OrganisationList organisations={organisations} />);

    expect(screen.getByRole("heading", { name: "Werkstatt" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /website/i })).toHaveAttribute(
      "href",
      "https://example.org",
    );

    fireEvent.click(screen.getByRole("button", { name: /details werkstatt/i }));

    const dialog = screen.getByRole("dialog", { name: /werkstatt/i });

    expect(dialog).toBeInTheDocument();
    expect(within(dialog).getByText("Erdgeschoss")).toBeInTheDocument();
    expect(
      within(dialog).getByText(
        /offene infrastruktur fuer gemeinsames reparieren und bauen/i,
      ),
    ).toBeInTheDocument();
  });
});
