"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { useMatchMedia } from "@/lib/useMatchMedia";

type Props = { children: ReactNode; rootMargin?: string; threshold?: number };

export function Reveal({ children, rootMargin = "0px 0px -10% 0px", threshold = 0.2 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useMatchMedia("(prefers-reduced-motion: reduce)");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (reduced) {
      setVisible(true);
      return;
    }
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            obs.disconnect();
          }
        });
      },
      { rootMargin, threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reduced, rootMargin, threshold]);

  return (
    <div ref={ref} data-reveal={visible ? "in" : "out"}>
      {children}
    </div>
  );
}
