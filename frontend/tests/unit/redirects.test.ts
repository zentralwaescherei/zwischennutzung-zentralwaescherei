import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => {
  return {
    permanentRedirect: (to: string) => {
      throw new Error(`REDIRECT:${to}`);
    },
  };
});

describe("legacy route redirects", () => {
  it("/organisationen redirects to /#organisationen", async () => {
    const mod = await import("@/app/organisationen/page");
    expect(() => (mod.default as () => unknown)()).toThrow("REDIRECT:/#organisationen");
  });

  it("/zeugnisse redirects to /#zeugnisse", async () => {
    const mod = await import("@/app/zeugnisse/page");
    expect(() => (mod.default as () => unknown)()).toThrow("REDIRECT:/#zeugnisse");
  });

  it("/blog redirects to /#blog", async () => {
    const mod = await import("@/app/blog/page");
    expect(() => (mod.default as () => unknown)()).toThrow("REDIRECT:/#blog");
  });
});
