// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render } from "@praxisjs/runtime";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../dialog/dialog";

afterEach(() => {
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  document.body.appendChild(container);
  render(node as () => Node, container);
  return container;
}

describe("Dialog", () => {
  it("renders its children when used as a JSX wrapper", () => {
    const container = mount(() => (
      <Dialog>
        <span>wrapped</span>
      </Dialog>
    ));
    expect(container.textContent).toBe("wrapped");
  });
});

describe("DialogTrigger", () => {
  it("opens the dialog on click and reflects state via aria-expanded/data-open", () => {
    const dialog = new Dialog();
    dialog.onBeforeMount?.();
    const container = mount(() => (
      <DialogTrigger dialog={dialog} id="t1" class="tr">
        Open
      </DialogTrigger>
    ));
    const button = container.querySelector("button") as HTMLButtonElement;
    expect(button.id).toBe("t1");
    expect(button.className).toBe("tr");
    expect(button.getAttribute("aria-haspopup")).toBe("dialog");
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(button.hasAttribute("data-open")).toBe(false);
    button.click();
    expect(dialog.isOpen).toBe(true);
    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(button.getAttribute("data-open")).toBe("");
  });
});

describe("DialogContent", () => {
  it("renders nothing in the DOM while closed", () => {
    const dialog = new Dialog();
    dialog.onBeforeMount?.();
    mount(() => <DialogContent dialog={dialog}>hi</DialogContent>);
    expect(document.querySelector('[role="dialog"]')).toBeNull();
  });

  it("portals into document.body when open, applying focus trap, scroll lock and a backdrop", async () => {
    const dialog = new Dialog({ defaultOpen: true });
    dialog.onBeforeMount?.();
    mount(() => (
      <DialogContent dialog={dialog} id="d-1" class="c" aria-label="al" aria-labelledby="alb" aria-describedby="adb">
        <button>Close</button>
      </DialogContent>
    ));
    await Promise.resolve();
    const content = document.querySelector('[role="dialog"]') as HTMLElement;
    expect(content).toBeTruthy();
    expect(content.id).toBe("d-1");
    expect(content.className).toBe("c");
    expect(content.getAttribute("aria-modal")).toBe("true");
    expect(content.getAttribute("aria-label")).toBe("al");
    expect(content.getAttribute("aria-labelledby")).toBe("alb");
    expect(content.getAttribute("aria-describedby")).toBe("adb");
    expect(content.getAttribute("data-open")).toBe("");
    expect(document.querySelector("[data-morphos-backdrop]")).toBeTruthy();
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.activeElement?.tagName).toBe("BUTTON");
  });

  it("generates a fallback id when none is provided", async () => {
    const dialog = new Dialog({ defaultOpen: true });
    dialog.onBeforeMount?.();
    mount(() => <DialogContent dialog={dialog} />);
    await Promise.resolve();
    const content = document.querySelector('[role="dialog"]') as HTMLElement;
    expect(content.id).toMatch(/^dialog-/);
  });

  it("opening later (not at initial mount) still applies the focus trap and scroll lock", async () => {
    const dialog = new Dialog();
    dialog.onBeforeMount?.();
    mount(() => (
      <DialogContent dialog={dialog}>
        <button>Close</button>
      </DialogContent>
    ));
    await Promise.resolve();
    expect(document.querySelector('[role="dialog"]')).toBeNull();
    dialog.openDialog();
    await Promise.resolve();
    expect(document.querySelector('[role="dialog"]')).toBeTruthy();
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("closing releases the scroll lock", async () => {
    const dialog = new Dialog({ defaultOpen: true });
    dialog.onBeforeMount?.();
    mount(() => <DialogContent dialog={dialog} />);
    await Promise.resolve();
    expect(document.body.style.overflow).toBe("hidden");
    dialog.closeDialog();
    await Promise.resolve();
    expect(document.body.style.overflow).not.toBe("hidden");
  });

  it("clicking the backdrop closes the dialog when closeOnBackdropClick is true (default)", async () => {
    const dialog = new Dialog({ defaultOpen: true });
    dialog.onBeforeMount?.();
    mount(() => <DialogContent dialog={dialog} />);
    await Promise.resolve();
    const backdrop = document.querySelector("[data-morphos-backdrop]") as HTMLElement;
    backdrop.click();
    expect(dialog.isOpen).toBe(false);
  });

  it("clicking the backdrop does nothing when closeOnBackdropClick is false", async () => {
    const dialog = new Dialog({ defaultOpen: true, closeOnBackdropClick: false });
    dialog.onBeforeMount?.();
    mount(() => <DialogContent dialog={dialog} />);
    await Promise.resolve();
    const backdrop = document.querySelector("[data-morphos-backdrop]") as HTMLElement;
    backdrop.click();
    expect(dialog.isOpen).toBe(true);
  });

  it("Escape closes the dialog when closeOnEscape is true (default)", async () => {
    const dialog = new Dialog({ defaultOpen: true });
    dialog.onBeforeMount?.();
    mount(() => (
      <DialogContent dialog={dialog}>
        <button>Close</button>
      </DialogContent>
    ));
    await Promise.resolve();
    const content = document.querySelector('[role="dialog"]') as HTMLElement;
    content.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
    expect(dialog.isOpen).toBe(false);
  });

  it("Escape does nothing when closeOnEscape is false", async () => {
    const dialog = new Dialog({ defaultOpen: true, closeOnEscape: false });
    dialog.onBeforeMount?.();
    mount(() => <DialogContent dialog={dialog} />);
    await Promise.resolve();
    const content = document.querySelector('[role="dialog"]') as HTMLElement;
    content.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
    expect(dialog.isOpen).toBe(true);
  });

  it("other keys do not close the dialog", async () => {
    const dialog = new Dialog({ defaultOpen: true });
    dialog.onBeforeMount?.();
    mount(() => <DialogContent dialog={dialog} />);
    await Promise.resolve();
    const content = document.querySelector('[role="dialog"]') as HTMLElement;
    content.dispatchEvent(new KeyboardEvent("keydown", { key: "a", bubbles: true, cancelable: true }));
    expect(dialog.isOpen).toBe(true);
  });

  it("_applyConstraints tolerates a content ref that never resolved (defensive branch)", () => {
    const dialog = new Dialog({ defaultOpen: true });
    dialog.onBeforeMount?.();
    const content = new DialogContent({ dialog });
    expect(() => {
      (content as unknown as { _applyConstraints: () => void })._applyConstraints();
    }).not.toThrow();
  });

  it("unmounting while open releases constraints without throwing", async () => {
    const dialog = new Dialog({ defaultOpen: true });
    dialog.onBeforeMount?.();
    const container = document.createElement("div");
    document.body.appendChild(container);
    const dispose = render(() => <DialogContent dialog={dialog} />, container);
    await Promise.resolve();
    expect(() => { dispose(); }).not.toThrow();
    expect(document.body.style.overflow).not.toBe("hidden");
  });
});

describe("DialogTitle", () => {
  it("defaults to an h2, supports a custom tag", () => {
    const container = mount(() => <DialogTitle id="t" class="ti">Title</DialogTitle>);
    const h2 = container.querySelector("h2");
    expect(h2?.id).toBe("t");
    expect(h2?.className).toBe("ti");
    expect(h2?.textContent).toBe("Title");

    const container2 = mount(() => <DialogTitle as="h1">Title</DialogTitle>);
    expect(container2.querySelector("h1")).toBeTruthy();
  });
});

describe("DialogDescription", () => {
  it("renders a paragraph with id and class", () => {
    const container = mount(() => (
      <DialogDescription id="d" class="de">Description</DialogDescription>
    ));
    const p = container.querySelector("p");
    expect(p?.id).toBe("d");
    expect(p?.className).toBe("de");
    expect(p?.textContent).toBe("Description");
  });
});

describe("DialogClose", () => {
  it("closes the dialog on click, with aria-label and id/class support", () => {
    const dialog = new Dialog({ defaultOpen: true });
    dialog.onBeforeMount?.();
    const container = mount(() => (
      <DialogClose dialog={dialog} id="c" class="ca">
        Close
      </DialogClose>
    ));
    const button = container.querySelector("button") as HTMLButtonElement;
    expect(button.id).toBe("c");
    expect(button.className).toBe("ca");
    expect(button.getAttribute("aria-label")).toBe("Close dialog");
    button.click();
    expect(dialog.isOpen).toBe(false);
  });
});
