import { afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { OrganisationsSection } from "@/components/sections/OrganisationsSection";
import type { Organisation } from "@/lib/cms/types";

const orgs: Organisation[] = [
  {
    id: "a", slug: "a", name: "A", shortDescription: "A desc",
    websiteUrl: "https://example.org/a",
    floorArea: { id: "eg", name: "Erdgeschoss", slug: "eg", svgZoneId: "eg", sortOrder: 1 },
    logoOrImage: null, isFeatured: false, categoryTags: [],
  },
  {
    id: "b", slug: "b", name: "B", shortDescription: "B desc",
    websiteUrl: "https://example.org/b",
    floorArea: { id: "og1", name: "1. OG", slug: "og1", svgZoneId: "og1", sortOrder: 2 },
    logoOrImage: null, isFeatured: false, categoryTags: [],
  },
];

describe("OrganisationsSection", () => {
  afterEach(() => cleanup());

  it("renders all orgs when no zone selected", () => {
    render(<OrganisationsSection organisations={orgs} initialZoneId={null} />);
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("filters via FloorSelect change", async () => {
    const user = userEvent.setup();
    render(<OrganisationsSection organisations={orgs} initialZoneId={null} />);
    await user.selectOptions(screen.getByRole("combobox", { name: /bereich/i }), "og1");
    expect(screen.queryByText("A")).not.toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("shows empty-state copy when nothing matches", async () => {
    const user = userEvent.setup();
    render(<OrganisationsSection organisations={[orgs[0]]} initialZoneId={null} />);
    await user.selectOptions(screen.getByRole("combobox", { name: /bereich/i }), "og1");
    expect(screen.getByText(/keine organisationen/i)).toBeInTheDocument();
  });

  it("applies initialZoneId on mount", () => {
    render(<OrganisationsSection organisations={orgs} initialZoneId="eg" />);
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.queryByText("B")).not.toBeInTheDocument();
  });
});
