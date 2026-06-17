import localFont from "next/font/local";

export const monumentDisplay = localFont({
  src: [
    { path: "../../public/fonts/monument-grotesk-regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/monument-grotesk-heavy.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-monument-display",
  display: "swap",
  preload: true,
});

export const monumentMono = localFont({
  src: [
    { path: "../../public/fonts/monument-grotesk-mono-regular.woff2", weight: "400", style: "normal" },
  ],
  variable: "--font-monument-mono",
  display: "swap",
  preload: true,
});
