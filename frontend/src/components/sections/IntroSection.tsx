type IntroSectionProps = {
  title: string;
  bodyHtml: string;
  ctaLabel?: string;
  ctaUrl?: string;
};

export function IntroSection({ title, bodyHtml, ctaLabel, ctaUrl }: IntroSectionProps) {
  return (
    <section id="intro" aria-labelledby="intro-title" className="section section--intro">
      <div className="intro-grid">
        <p className="mono intro-meta" aria-hidden="true">
          02 — INTRO
        </p>
        <h2 id="intro-title" className="display intro-title">
          {title}
        </h2>
        <div
          className="intro-body"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
        {ctaUrl && ctaLabel ? (
          <a className="intro-cta mono" href={ctaUrl}>
            {ctaLabel} →
          </a>
        ) : null}
      </div>
    </section>
  );
}
