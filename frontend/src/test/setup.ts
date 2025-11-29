import "@testing-library/dom";
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
});

class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// @ts-expect-error - JSDOM doesn't define this
if (typeof global.ResizeObserver === "undefined") {
  // @ts-expect-error - JSDOM doesn't define this
  global.ResizeObserver = MockResizeObserver;
}

const HTMLElementProto = window.HTMLElement.prototype;

if (!HTMLElementProto.scrollIntoView) {
  HTMLElementProto.scrollIntoView = vi.fn();
}

if (!HTMLElementProto.hasPointerCapture) {
  HTMLElementProto.hasPointerCapture = vi.fn();
}

if (!HTMLElementProto.releasePointerCapture) {
  HTMLElementProto.releasePointerCapture = vi.fn();
}
