import Link from "next/link";
import type { CSSProperties } from "react";

type StyleVariant = "neutral" | "accent";

export type TextBlockVariant = "poster" | "quiet";

export type TextBlockSectionProps = {
  title: string;
  bodyHtml: string;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
  styleVariant?: StyleVariant | null;
  variant?: TextBlockVariant | null;
  /** Stable id for heading/aria; defaults from title */
  sectionId?: string;
};

function defaultSectionId(title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slug ? `text-block-${slug}` : "text-block";
}

const sectionStyle = (variant: StyleVariant): CSSProperties => ({
  display: "grid",
  gap: "1rem",
  maxWidth: "48rem",
  padding: variant === "accent" ? "1.5rem" : 0,
  border: variant === "accent" ? "1px solid #111111" : undefined,
  backgroundColor: variant === "accent" ? "#c5d6ff" : "transparent",
});

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
  lineHeight: 1.15,
  letterSpacing: "-0.02em",
};

const bodyStyle: CSSProperties = {
  margin: 0,
  lineHeight: 1.65,
  fontSize: "1.0625rem",
};

const ctaStyle: CSSProperties = {
  fontWeight: 600,
  color: "#111111",
  textDecoration: "underline",
  textUnderlineOffset: "0.15em",
};

export function TextBlockSection({ title, bodyHtml, ctaLabel, ctaUrl, styleVariant, variant, sectionId }: TextBlockSectionProps) {
  const styleVariantResolved: StyleVariant = styleVariant === "accent" ? "accent" : "neutral";
  const blockVariant: TextBlockVariant = variant === "poster" ? "poster" : "quiet";
  const headingId = sectionId ?? defaultSectionId(title);

  return (
    <section
      aria-labelledby={headingId}
      className={`textblock textblock--${blockVariant}`}
      style={sectionStyle(styleVariantResolved)}
    >
      <h2 id={headingId} style={titleStyle}>
        {title}
      </h2>
      <div dangerouslySetInnerHTML={{ __html: bodyHtml }} style={bodyStyle} />
      {ctaLabel && ctaUrl ? (
        <p style={{ margin: 0 }}>
          <Link href={ctaUrl} style={ctaStyle}>
            {ctaLabel}
          </Link>
        </p>
      ) : null}
    </section>
  );
}
