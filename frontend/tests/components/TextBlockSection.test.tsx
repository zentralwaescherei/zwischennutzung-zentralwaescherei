import { afterEach } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { TextBlockSection } from "@/components/content/TextBlockSection";
import { describe, expect, it } from "vitest";

describe("TextBlockSection", () => {
  afterEach(() => cleanup());

  it("renders title and rich text body", () => {
    render(
      <TextBlockSection
        sectionId="test-heading"
        title="Warum dieser Ort wichtig ist"
        bodyHtml="<p>Gemeinschaft und Kultur</p>"
      />,
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Warum dieser Ort wichtig ist");
    expect(screen.getByText("Gemeinschaft und Kultur")).toBeInTheDocument();
  });
});

describe("TextBlockSection variants", () => {
  afterEach(() => cleanup());

  it("renders the poster variant class", () => {
    const { container } = render(
      <TextBlockSection
        sectionId="t1"
        variant="poster"
        title="Titel"
        bodyHtml="<p>Body</p>"
      />,
    );
    expect(container.querySelector(".textblock--poster")).not.toBeNull();
  });

  it("renders the quiet variant class by default", () => {
    const { container } = render(
      <TextBlockSection sectionId="t1" title="Titel" bodyHtml="<p>Body</p>" />,
    );
    expect(container.querySelector(".textblock--quiet")).not.toBeNull();
  });
});
