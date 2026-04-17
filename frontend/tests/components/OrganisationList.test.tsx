import React from "react";
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";

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
  afterEach(() => {
    cleanup();
  });

  it("moves focus into the detail sheet and shows the website link", () => {
    render(<OrganisationList organisations={organisations} />);

    expect(screen.getByRole("heading", { name: "Werkstatt" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /website/i })).toHaveAttribute(
      "href",
      "https://example.org",
    );

    fireEvent.click(screen.getByRole("button", { name: /details werkstatt/i }));

    const dialog = screen.getByRole("dialog", { name: /werkstatt/i });
    const closeButton = within(dialog).getByRole("button", {
      name: /schliessen werkstatt/i,
    });
    const websiteLink = within(dialog).getByRole("link", {
      name: /website besuchen/i,
    });

    expect(dialog).toBeInTheDocument();
    expect(closeButton).toHaveFocus();
    expect(within(dialog).getByText("Erdgeschoss")).toBeInTheDocument();
    expect(
      within(dialog).getByText(
        /offene infrastruktur fuer gemeinsames reparieren und bauen/i,
      ),
    ).toBeInTheDocument();
    expect(websiteLink).toHaveAttribute("href", "https://example.org");
  });

  it("keeps tab focus inside the detail sheet", () => {
    render(<OrganisationList organisations={organisations} />);

    fireEvent.click(screen.getByRole("button", { name: /details werkstatt/i }));

    const dialog = screen.getByRole("dialog", { name: /werkstatt/i });
    const closeButton = within(dialog).getByRole("button", {
      name: /schliessen werkstatt/i,
    });
    const websiteLink = within(dialog).getByRole("link", {
      name: /website besuchen/i,
    });

    websiteLink.focus();
    fireEvent.keyDown(dialog, { key: "Tab" });
    expect(closeButton).toHaveFocus();

    closeButton.focus();
    fireEvent.keyDown(dialog, { key: "Tab", shiftKey: true });
    expect(websiteLink).toHaveFocus();
  });

  it("closes the detail sheet with the close button and Escape", () => {
    render(<OrganisationList organisations={organisations} />);

    fireEvent.click(screen.getByRole("button", { name: /details werkstatt/i }));
    fireEvent.click(screen.getByRole("button", { name: /schliessen werkstatt/i }));

    expect(screen.queryByRole("dialog", { name: /werkstatt/i })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /details werkstatt/i }));
    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("dialog", { name: /werkstatt/i })).not.toBeInTheDocument();
  });
});
