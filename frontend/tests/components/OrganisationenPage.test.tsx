import { afterEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";

import OrganisationenPage from "@/app/organisationen/page";

describe("OrganisationenPage map filter wiring", () => {
  afterEach(() => {
    cleanup();
    window.history.replaceState(null, "", "/");
  });

  it("reads the initial zone from the URL query string", async () => {
    window.history.replaceState(null, "", "/organisationen?zone=og1");

    render(<OrganisationenPage />);

    expect(await screen.findByText("Filter aktiv: 1. Obergeschoss")).toBeInTheDocument();
    expect(screen.getByText("1 Organisation sichtbar")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Werkstatt" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Radio Zentral" })).toBeInTheDocument();
  });

  it("writes filter selections back to the URL and can clear them", async () => {
    window.history.replaceState(null, "", "/organisationen");
    render(<OrganisationenPage />);

    fireEvent.click(screen.getByRole("button", { name: "2. Obergeschoss" }));

    await waitFor(() => {
      expect(window.location.search).toBe("?zone=og2");
    });

    fireEvent.click(screen.getByRole("button", { name: "Alle Bereiche" }));

    await waitFor(() => {
      expect(window.location.search).toBe("");
    });
  });

  it("keeps filter label and shows empty state when no organisations match", async () => {
    window.history.replaceState(null, "", "/organisationen?zone=ug");

    render(<OrganisationenPage />);

    expect(await screen.findByText("Filter aktiv: Bereich ug")).toBeInTheDocument();
    expect(screen.getByText("0 Organisationen sichtbar")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Fuer den gewaehlten Bereich sind aktuell keine Organisationen eingetragen.",
      ),
    ).toBeInTheDocument();
  });
});
