// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";

import {
  isActivationKey,
  isHorizontalNavKey,
  isVerticalNavKey,
  wrapIndex,
  getFocusableElements,
  trapFocus,
  lockScroll,
  Keys,
} from "../a11y";

function makeKeyEvent(key: string, shift = false): KeyboardEvent {
  return new KeyboardEvent("keydown", { key, shiftKey: shift, bubbles: true });
}

describe("isActivationKey", () => {
  it("returns true for Enter", () => {
    expect(isActivationKey(makeKeyEvent(Keys.Enter))).toBe(true);
  });

  it("returns true for Space", () => {
    expect(isActivationKey(makeKeyEvent(Keys.Space))).toBe(true);
  });

  it("returns false for other keys", () => {
    expect(isActivationKey(makeKeyEvent(Keys.Escape))).toBe(false);
  });
});

describe("isVerticalNavKey", () => {
  it("returns true for ArrowUp and ArrowDown", () => {
    expect(isVerticalNavKey(makeKeyEvent(Keys.ArrowUp))).toBe(true);
    expect(isVerticalNavKey(makeKeyEvent(Keys.ArrowDown))).toBe(true);
  });

  it("returns true for Home and End", () => {
    expect(isVerticalNavKey(makeKeyEvent(Keys.Home))).toBe(true);
    expect(isVerticalNavKey(makeKeyEvent(Keys.End))).toBe(true);
  });

  it("returns false for ArrowLeft", () => {
    expect(isVerticalNavKey(makeKeyEvent(Keys.ArrowLeft))).toBe(false);
  });
});

describe("isHorizontalNavKey", () => {
  it("returns true for ArrowLeft and ArrowRight", () => {
    expect(isHorizontalNavKey(makeKeyEvent(Keys.ArrowLeft))).toBe(true);
    expect(isHorizontalNavKey(makeKeyEvent(Keys.ArrowRight))).toBe(true);
  });

  it("returns false for ArrowUp", () => {
    expect(isHorizontalNavKey(makeKeyEvent(Keys.ArrowUp))).toBe(false);
  });
});

describe("wrapIndex", () => {
  it("wraps past the end", () => {
    expect(wrapIndex(3, 3)).toBe(0);
    expect(wrapIndex(4, 3)).toBe(1);
  });

  it("wraps below zero", () => {
    expect(wrapIndex(-1, 3)).toBe(2);
    expect(wrapIndex(-4, 3)).toBe(2);
  });

  it("returns the same index when within bounds", () => {
    expect(wrapIndex(1, 3)).toBe(1);
    expect(wrapIndex(0, 3)).toBe(0);
  });
});

describe("getFocusableElements", () => {
  it("returns buttons inside a container", () => {
    const container = document.createElement("div");
    container.innerHTML = `<button>A</button><button disabled>B</button><button>C</button>`;
    document.body.appendChild(container);

    const focusable = getFocusableElements(container);
    // disabled button is excluded
    expect(focusable).toHaveLength(2);

    document.body.removeChild(container);
  });
});

describe("trapFocus", () => {
  it("returns a cleanup function", () => {
    const container = document.createElement("div");
    container.innerHTML = `<button>A</button><button>B</button>`;
    document.body.appendChild(container);

    const cleanup = trapFocus(container);
    expect(typeof cleanup).toBe("function");
    cleanup();

    document.body.removeChild(container);
  });

  it("returns a noop when there are no focusable elements", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const cleanup = trapFocus(container);
    expect(() => { cleanup(); }).not.toThrow();

    document.body.removeChild(container);
  });

  it("focuses the first focusable element immediately", () => {
    const container = document.createElement("div");
    container.innerHTML = `<button id="a">A</button><button id="b">B</button>`;
    document.body.appendChild(container);

    trapFocus(container);
    expect(document.activeElement?.id).toBe("a");

    document.body.removeChild(container);
  });

  it("Tab on the last element wraps focus to the first", () => {
    const container = document.createElement("div");
    container.innerHTML = `<button id="a">A</button><button id="b">B</button>`;
    document.body.appendChild(container);
    const [a, b] = Array.from(container.querySelectorAll("button"));

    trapFocus(container);
    b.focus();
    const event = makeKeyEvent(Keys.Tab);
    container.dispatchEvent(event);
    expect(document.activeElement).toBe(a);

    document.body.removeChild(container);
  });

  it("Shift+Tab on the first element wraps focus to the last", () => {
    const container = document.createElement("div");
    container.innerHTML = `<button id="a">A</button><button id="b">B</button>`;
    document.body.appendChild(container);
    const [a, b] = Array.from(container.querySelectorAll("button"));

    trapFocus(container);
    a.focus();
    const event = makeKeyEvent(Keys.Tab, true);
    container.dispatchEvent(event);
    expect(document.activeElement).toBe(b);

    document.body.removeChild(container);
  });

  it("Tab away from a middle element does not wrap", () => {
    const container = document.createElement("div");
    container.innerHTML = `<button id="a">A</button><button id="b">B</button><button id="c">C</button>`;
    document.body.appendChild(container);
    const [, b] = Array.from(container.querySelectorAll("button"));

    trapFocus(container);
    b.focus();
    container.dispatchEvent(makeKeyEvent(Keys.Tab));
    expect(document.activeElement).toBe(b);

    document.body.removeChild(container);
  });

  it("Shift+Tab away from a middle element does not wrap", () => {
    const container = document.createElement("div");
    container.innerHTML = `<button id="a">A</button><button id="b">B</button><button id="c">C</button>`;
    document.body.appendChild(container);
    const [, b] = Array.from(container.querySelectorAll("button"));

    trapFocus(container);
    b.focus();
    container.dispatchEvent(makeKeyEvent(Keys.Tab, true));
    expect(document.activeElement).toBe(b);

    document.body.removeChild(container);
  });

  it("non-Tab keys are ignored", () => {
    const container = document.createElement("div");
    container.innerHTML = `<button id="a">A</button><button id="b">B</button>`;
    document.body.appendChild(container);
    const [, b] = Array.from(container.querySelectorAll("button"));

    trapFocus(container);
    b.focus();
    container.dispatchEvent(makeKeyEvent("Escape"));
    expect(document.activeElement).toBe(b);

    document.body.removeChild(container);
  });

  it("cleanup removes the keydown listener", () => {
    const container = document.createElement("div");
    container.innerHTML = `<button id="a">A</button><button id="b">B</button>`;
    document.body.appendChild(container);
    const [a, b] = Array.from(container.querySelectorAll("button"));

    const cleanup = trapFocus(container);
    cleanup();
    b.focus();
    container.dispatchEvent(makeKeyEvent(Keys.Tab));
    // No listener anymore, so focus does not wrap back to `a`.
    expect(document.activeElement).not.toBe(a);

    document.body.removeChild(container);
  });
});

describe("lockScroll", () => {
  it("sets overflow hidden and restores on cleanup", () => {
    document.body.style.overflow = "";
    const unlock = lockScroll();

    expect(document.body.style.overflow).toBe("hidden");

    unlock();
    expect(document.body.style.overflow).toBe("");
  });

  it("restores the original overflow value", () => {
    document.body.style.overflow = "auto";
    const unlock = lockScroll();

    unlock();
    expect(document.body.style.overflow).toBe("auto");

    document.body.style.overflow = "";
  });
});

describe("Keys constant", () => {
  it("exposes the expected keys", () => {
    expect(Keys.Enter).toBe("Enter");
    expect(Keys.Escape).toBe("Escape");
    expect(Keys.Tab).toBe("Tab");
    expect(Keys.ArrowUp).toBe("ArrowUp");
    expect(Keys.Space).toBe(" ");

    vi.restoreAllMocks();
  });
});
