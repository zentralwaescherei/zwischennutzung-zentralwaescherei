"use client";

import { useEffect, useState } from "react";

import { useMatchMedia } from "@/lib/useMatchMedia";

type Props = { text: string; durationMs?: number };

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789▚▜▌";

function randomChar() {
  return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
}

export function Scramble({ text, durationMs = 600 }: Props) {
  const reduced = useMatchMedia("(prefers-reduced-motion: reduce)");
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (reduced) {
      setDisplay(text);
      return;
    }
    let start: number | null = null;
    let raf = 0;
    const tick = (now: number) => {
      if (start === null) start = now;
      const p = Math.min(1, (now - start) / durationMs);
      const revealUntil = Math.floor(p * text.length);
      const next = Array.from(text)
        .map((ch, i) => (i < revealUntil || ch === " " ? ch : randomChar()))
        .join("");
      setDisplay(next);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, durationMs, reduced]);

  return <span data-scramble>{display}</span>;
}
