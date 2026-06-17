import { vi } from "vitest";

// @testing-library/dom detects fake timers by looking for a `jest` global whose
// `setTimeout` has `_isMockFunction` or a `clock` property (sinon-style). Vitest
// uses sinon-style fake timers (so `setTimeout.clock` is set when fake timers
// are active) but does not define a `jest` global. Without this shim,
// @testing-library/react's asyncWrapper hangs on an unflushed `setTimeout(cb, 0)`
// because `jestFakeTimersAreEnabled()` returns false and the 0-delay timer
// scheduled to drain microtasks is never advanced.
//
// Exposing a minimal `jest` shim that delegates to `vi` is enough to make the
// detection pass and to satisfy the `jest.advanceTimersByTime(0)` call inside
// the asyncWrapper drain.
const jestShim = {
  advanceTimersByTime: (ms: number) => vi.advanceTimersByTime(ms),
};

(globalThis as unknown as { jest: typeof jestShim }).jest = jestShim;
