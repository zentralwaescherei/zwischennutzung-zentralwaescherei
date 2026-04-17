import { render, screen } from "@testing-library/react";
import { TextBlockSection } from "@/components/content/TextBlockSection";
import { describe, expect, it } from "vitest";

describe("TextBlockSection", () => {
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
