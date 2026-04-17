import { vi } from "vitest";

import "@testing-library/jest-dom/vitest";

// next/font/local is a compile-time helper transformed by Next's SWC plugin;
// the runtime module file is empty. Provide a minimal stub so unit tests can
// import modules that call localFont() directly.
vi.mock("next/font/local", () => ({
  default: (options: { variable?: string }) => ({
    className: "mock-monument",
    style: { fontFamily: "mock-monument" },
    variable: options.variable ?? "",
  }),
}));
