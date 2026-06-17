"use client";

import { useEffect, useState } from "react";

import { Marquee } from "@/components/motion/Marquee";
import { Scramble } from "@/components/motion/Scramble";

type HeroSectionProps = {
  voteDateLabel: string;
};

export function HeroSection({ voteDateLabel }: HeroSectionProps) {
  const [scrambleAllowed, setScrambleAllowed] = useState(false);

  useEffect(() => {
    try {
      const done = sessionStorage.getItem("zw-hero-scrambled");
      if (!done) {
        setScrambleAllowed(true);
        sessionStorage.setItem("zw-hero-scrambled", "1");
      }
    } catch {
      // sessionStorage unavailable (SSR / private mode) — skip
    }
  }, []);

  return (
    <section id="start" aria-labelledby="hero-title" className="section section--hero">
      <Marquee text="ZWISCHEN-NUTZUNG · ZENTRAL-WAESCHEREI · ZUERICH · 2026 →" />
      <p className="mono hero-strap--sr">
        Zwischennutzung Zentralwäscherei, Zürich, 2026.
      </p>
      <h1 id="hero-title" className="display hero-title">
        <span className="hero-title__line">Zwischen&shy;nutzung</span>
        <span className="hero-title__line display--outline">
          {scrambleAllowed ? <Scramble text="Zentralwaescherei" /> : "Zentralwaescherei"}
        </span>
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
