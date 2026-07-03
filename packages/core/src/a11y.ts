/**
 * Keys commonly handled by accessible interactive components.
 * Centralised here so each component doesn't define its own set.
 */
export const Keys = {
  Enter: "Enter",
  Space: " ",
  Escape: "Escape",
  Tab: "Tab",
  ArrowUp: "ArrowUp",
  ArrowDown: "ArrowDown",
  ArrowLeft: "ArrowLeft",
  ArrowRight: "ArrowRight",
  Home: "Home",
  End: "End",
  PageUp: "PageUp",
  PageDown: "PageDown",
} as const;

export type Key = (typeof Keys)[keyof typeof Keys];

/**
 * Returns whether the given keyboard event corresponds to an activation action
 * (Enter or Space), which should trigger the same behavior as a click on
 * interactive elements like buttons, checkboxes, and menu items.
 */
export function isActivationKey(event: KeyboardEvent): boolean {
  return event.key === Keys.Enter || event.key === Keys.Space;
}

/**
 * Returns whether the given keyboard event is a vertical navigation key
 * (ArrowUp / ArrowDown / Home / End).
 */
export function isVerticalNavKey(event: KeyboardEvent): boolean {
  return (
    event.key === Keys.ArrowUp ||
    event.key === Keys.ArrowDown ||
    event.key === Keys.Home ||
    event.key === Keys.End
  );
}

/**
 * Returns whether the given keyboard event is a horizontal navigation key
 * (ArrowLeft / ArrowRight).
 */
export function isHorizontalNavKey(event: KeyboardEvent): boolean {
  return event.key === Keys.ArrowLeft || event.key === Keys.ArrowRight;
}

/**
 * Wraps an index around the bounds of an array.
 * Used for circular keyboard navigation (e.g. arrow-key cycling through items).
 */
export function wrapIndex(index: number, length: number): number {
  return ((index % length) + length) % length;
}

/**
 * Traps focus within a container element. Returns a cleanup function that
 * removes the event listener when the trap is no longer needed (e.g. on unmount
 * or when the dialog closes).
 */
export function trapFocus(container: HTMLElement): () => void {
  const focusable = getFocusableElements(container);

  if (focusable.length === 0) return () => undefined;

  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  first.focus();

  const handler = (event: KeyboardEvent) => {
    if (event.key !== Keys.Tab) return;

    if (event.shiftKey) {
      if (document.activeElement === first) {
        event.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  container.addEventListener("keydown", handler);
  return () => { container.removeEventListener("keydown", handler); };
}

/**
 * Returns all focusable elements within a container, in DOM order.
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((el) => !el.hasAttribute("hidden"));
}

/**
 * Prevents body scroll while a modal is open. Returns a cleanup function that
 * restores the original overflow style.
 */
export function lockScroll(): () => void {
  const original = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  return () => { document.body.style.overflow = original; };
}
