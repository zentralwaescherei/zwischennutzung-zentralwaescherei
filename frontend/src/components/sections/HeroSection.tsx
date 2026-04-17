import { Marquee } from "@/components/motion/Marquee";

type HeroSectionProps = {
  voteDateLabel: string;
};

export function HeroSection({ voteDateLabel }: HeroSectionProps) {
  return (
    <section id="start" aria-labelledby="hero-title" className="section section--hero">
      <Marquee text="ZWISCHEN-NUTZUNG · ZENTRAL-WAESCHEREI · ZUERICH · 2026 →" />
      <p className="mono hero-strap--sr">
        Zwischennutzung Zentralwäscherei, Zürich, 2026.
      </p>
      <h1 id="hero-title" className="display hero-title">
        <span className="hero-title__line">Zwischen&shy;nutzung</span>
        <span className="hero-title__line display--outline">Zentral&shy;wäscherei</span>
      </h1>
      <p className="mono hero-vote" aria-label={voteDateLabel}>
        {voteDateLabel}
      </p>
      <a className="hero-cta mono" href="#organisationen">
        → ORGANISATIONEN ENTDECKEN
      </a>
      <p className="mono hero-scroll" aria-hidden="true">
        SCROLL ↓ 01 / 05
      </p>
    </section>
  );
}
