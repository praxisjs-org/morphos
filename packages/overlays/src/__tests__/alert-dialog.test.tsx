// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render } from "@praxisjs/runtime";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../alert-dialog/alert-dialog";

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

describe("AlertDialog", () => {
  it("starts closed by default and open when defaultOpen is set", () => {
    const a = new AlertDialog();
    a.onBeforeMount?.();
    expect(a.isOpen).toBe(false);

    const b = new AlertDialog({ defaultOpen: true });
    b.onBeforeMount?.();
    expect(b.isOpen).toBe(true);
  });

  it("openDialog/closeDialog/toggle manage uncontrolled state and fire onOpenChange", () => {
    const onOpenChange = vi.fn();
    const a = new AlertDialog({ onOpenChange });
    a.onBeforeMount?.();

    a.openDialog();
    expect(a.isOpen).toBe(true);
    expect(onOpenChange).toHaveBeenLastCalledWith(true);

    a.closeDialog();
    expect(a.isOpen).toBe(false);
    expect(onOpenChange).toHaveBeenLastCalledWith(false);

    a.toggle();
    expect(a.isOpen).toBe(true);
    a.toggle();
    expect(a.isOpen).toBe(false);
  });

  it("renders its children when used as a JSX wrapper", () => {
    const container = mount(() => (
      <AlertDialog>
        <span>wrapped</span>
      </AlertDialog>
    ));
    expect(container.textContent).toBe("wrapped");
  });

  it("respects a controlled open prop but still emits onOpenChange", () => {
    const onOpenChange = vi.fn();
    const a = new AlertDialog({ open: false, onOpenChange });
    a.onBeforeMount?.();
    a.openDialog();
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(a.isOpen).toBe(false); // controlled — internal state unaffected

    a.closeDialog();
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(a.isOpen).toBe(false);

    a.toggle();
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(a.isOpen).toBe(false);
  });
});

describe("AlertDialogTrigger", () => {
  it("opens the dialog on click and reflects state via aria-expanded/data-open", () => {
    const alertDialog = new AlertDialog();
    alertDialog.onBeforeMount?.();
    const container = mount(() => (
      <AlertDialogTrigger alertDialog={alertDialog} id="t1" class="tr">
        Open
      </AlertDialogTrigger>
    ));
    const button = container.querySelector("button") as HTMLButtonElement;
    expect(button.id).toBe("t1");
    expect(button.className).toBe("tr");
    expect(button.getAttribute("aria-expanded")).toBe("false");
    expect(button.hasAttribute("data-open")).toBe(false);
    button.click();
    expect(alertDialog.isOpen).toBe(true);
    expect(button.getAttribute("aria-expanded")).toBe("true");
    expect(button.getAttribute("data-open")).toBe("");
  });
});

describe("AlertDialogContent", () => {
  it("renders nothing in the DOM while closed", () => {
    const alertDialog = new AlertDialog();
    alertDialog.onBeforeMount?.();
    mount(() => <AlertDialogContent alertDialog={alertDialog}>hi</AlertDialogContent>);
    expect(document.querySelector('[role="alertdialog"]')).toBeNull();
  });

  it("portals into document.body when open, applying focus trap and scroll lock", async () => {
    const alertDialog = new AlertDialog({ defaultOpen: true });
    alertDialog.onBeforeMount?.();
    mount(() => (
      <AlertDialogContent alertDialog={alertDialog} id="ad-1" class="c" aria-label="al" aria-labelledby="alb" aria-describedby="adb">
        <button>Cancel</button>
        <button>Confirm</button>
      </AlertDialogContent>
    ));
    await Promise.resolve();
    const dialog = document.querySelector('[role="alertdialog"]') as HTMLElement;
    expect(dialog).toBeTruthy();
    expect(dialog.id).toBe("ad-1");
    expect(dialog.className).toBe("c");
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    expect(dialog.getAttribute("aria-label")).toBe("al");
    expect(dialog.getAttribute("aria-labelledby")).toBe("alb");
    expect(dialog.getAttribute("aria-describedby")).toBe("adb");
    expect(dialog.getAttribute("data-open")).toBe("");
    expect(document.body.style.overflow).toBe("hidden");
    expect(document.activeElement?.tagName).toBe("BUTTON");
  });

  it("renders a backdrop that blocks the page behind it and closes the dialog on click by default", async () => {
    const alertDialog = new AlertDialog({ defaultOpen: true });
    alertDialog.onBeforeMount?.();
    mount(() => <AlertDialogContent alertDialog={alertDialog} />);
    await Promise.resolve();
    const backdrop = document.querySelector("[data-morphos-backdrop]");
    expect(backdrop).toBeTruthy();
    backdrop?.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    expect(alertDialog.isOpen).toBe(false);
  });

  it("clicking the backdrop does nothing when closeOnOutsideClick is false", async () => {
    const alertDialog = new AlertDialog({ defaultOpen: true, closeOnOutsideClick: false });
    alertDialog.onBeforeMount?.();
    mount(() => <AlertDialogContent alertDialog={alertDialog} />);
    await Promise.resolve();
    const backdrop = document.querySelector("[data-morphos-backdrop]");
    backdrop?.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
    expect(alertDialog.isOpen).toBe(true);
  });

  it("removes the backdrop when the dialog closes", async () => {
    const alertDialog = new AlertDialog({ defaultOpen: true });
    alertDialog.onBeforeMount?.();
    mount(() => <AlertDialogContent alertDialog={alertDialog} />);
    await Promise.resolve();
    expect(document.querySelector("[data-morphos-backdrop]")).toBeTruthy();
    alertDialog.closeDialog();
    await Promise.resolve();
    expect(document.querySelector("[data-morphos-backdrop]")).toBeNull();
  });

  it("generates a fallback id when none is provided", async () => {
    const alertDialog = new AlertDialog({ defaultOpen: true });
    alertDialog.onBeforeMount?.();
    mount(() => <AlertDialogContent alertDialog={alertDialog} />);
    await Promise.resolve();
    const dialog = document.querySelector('[role="alertdialog"]') as HTMLElement;
    expect(dialog.id).toMatch(/^alert-dialog-/);
  });

  it("opening later (not at initial mount) still applies the focus trap and scroll lock", async () => {
    const alertDialog = new AlertDialog();
    alertDialog.onBeforeMount?.();
    mount(() => (
      <AlertDialogContent alertDialog={alertDialog}>
        <button>Confirm</button>
      </AlertDialogContent>
    ));
    await Promise.resolve();
    expect(document.querySelector('[role="alertdialog"]')).toBeNull();
    alertDialog.openDialog();
    await Promise.resolve();
    expect(document.querySelector('[role="alertdialog"]')).toBeTruthy();
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("closing releases the scroll lock", async () => {
    const alertDialog = new AlertDialog({ defaultOpen: true });
    alertDialog.onBeforeMount?.();
    mount(() => <AlertDialogContent alertDialog={alertDialog} />);
    await Promise.resolve();
    expect(document.body.style.overflow).toBe("hidden");
    alertDialog.closeDialog();
    await Promise.resolve();
    expect(document.body.style.overflow).not.toBe("hidden");
  });

  it("Escape closes the dialog when closeOnEscape is true (default)", async () => {
    const alertDialog = new AlertDialog({ defaultOpen: true });
    alertDialog.onBeforeMount?.();
    mount(() => (
      <AlertDialogContent alertDialog={alertDialog}>
        <button>Confirm</button>
      </AlertDialogContent>
    ));
    await Promise.resolve();
    const dialog = document.querySelector('[role="alertdialog"]') as HTMLElement;
    dialog.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
    expect(alertDialog.isOpen).toBe(false);
  });

  it("Escape does nothing when closeOnEscape is false", async () => {
    const alertDialog = new AlertDialog({ defaultOpen: true, closeOnEscape: false });
    alertDialog.onBeforeMount?.();
    mount(() => <AlertDialogContent alertDialog={alertDialog} />);
    await Promise.resolve();
    const dialog = document.querySelector('[role="alertdialog"]') as HTMLElement;
    dialog.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
    expect(alertDialog.isOpen).toBe(true);
  });

  it("other keys do not close the dialog", async () => {
    const alertDialog = new AlertDialog({ defaultOpen: true });
    alertDialog.onBeforeMount?.();
    mount(() => <AlertDialogContent alertDialog={alertDialog} />);
    await Promise.resolve();
    const dialog = document.querySelector('[role="alertdialog"]') as HTMLElement;
    dialog.dispatchEvent(new KeyboardEvent("keydown", { key: "a", bubbles: true, cancelable: true }));
    expect(alertDialog.isOpen).toBe(true);
  });

  it("_applyConstraints tolerates a content ref that never resolved (defensive branch)", () => {
    const alertDialog = new AlertDialog({ defaultOpen: true });
    alertDialog.onBeforeMount?.();
    const content = new AlertDialogContent({ alertDialog });
    expect(() => {
      (content as unknown as { _applyConstraints: () => void })._applyConstraints();
    }).not.toThrow();
  });

  it("unmounting while open releases constraints without throwing", async () => {
    const alertDialog = new AlertDialog({ defaultOpen: true });
    alertDialog.onBeforeMount?.();
    const container = document.createElement("div");
    document.body.appendChild(container);
    const dispose = render(() => <AlertDialogContent alertDialog={alertDialog} />, container);
    await Promise.resolve();
    expect(() => { dispose(); }).not.toThrow();
    expect(document.body.style.overflow).not.toBe("hidden");
  });
});

describe("AlertDialogTitle", () => {
  it("defaults to an h2, supports a custom tag", () => {
    const container = mount(() => (
      <AlertDialogTitle id="t" class="ti">Delete?</AlertDialogTitle>
    ));
    const h2 = container.querySelector("h2");
    expect(h2?.id).toBe("t");
    expect(h2?.className).toBe("ti");
    expect(h2?.textContent).toBe("Delete?");

    const container2 = mount(() => <AlertDialogTitle as="h1">Title</AlertDialogTitle>);
    expect(container2.querySelector("h1")).toBeTruthy();
  });
});

describe("AlertDialogDescription", () => {
  it("renders a paragraph with id and class", () => {
    const container = mount(() => (
      <AlertDialogDescription id="d" class="de">Are you sure?</AlertDialogDescription>
    ));
    const p = container.querySelector("p");
    expect(p?.id).toBe("d");
    expect(p?.className).toBe("de");
    expect(p?.textContent).toBe("Are you sure?");
  });
});

describe("AlertDialogAction", () => {
  it("closes the dialog and calls onClick", () => {
    const alertDialog = new AlertDialog({ defaultOpen: true });
    alertDialog.onBeforeMount?.();
    const onClick = vi.fn();
    const container = mount(() => (
      <AlertDialogAction alertDialog={alertDialog} id="a" class="ac" onClick={onClick}>
        Confirm
      </AlertDialogAction>
    ));
    const button = container.querySelector("button") as HTMLButtonElement;
    expect(button.id).toBe("a");
    expect(button.className).toBe("ac");
    button.click();
    expect(alertDialog.isOpen).toBe(false);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("works without an onClick prop", () => {
    const alertDialog = new AlertDialog({ defaultOpen: true });
    alertDialog.onBeforeMount?.();
    const container = mount(() => <AlertDialogAction alertDialog={alertDialog}>Confirm</AlertDialogAction>);
    const button = container.querySelector("button") as HTMLButtonElement;
    expect(() => { button.click(); }).not.toThrow();
    expect(alertDialog.isOpen).toBe(false);
  });
});

describe("AlertDialogCancel", () => {
  it("closes the dialog and calls onClick", () => {
    const alertDialog = new AlertDialog({ defaultOpen: true });
    alertDialog.onBeforeMount?.();
    const onClick = vi.fn();
    const container = mount(() => (
      <AlertDialogCancel alertDialog={alertDialog} id="c" class="ca" onClick={onClick}>
        Cancel
      </AlertDialogCancel>
    ));
    const button = container.querySelector("button") as HTMLButtonElement;
    expect(button.id).toBe("c");
    expect(button.className).toBe("ca");
    button.click();
    expect(alertDialog.isOpen).toBe(false);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("works without an onClick prop", () => {
    const alertDialog = new AlertDialog({ defaultOpen: true });
    alertDialog.onBeforeMount?.();
    const container = mount(() => <AlertDialogCancel alertDialog={alertDialog}>Cancel</AlertDialogCancel>);
    const button = container.querySelector("button") as HTMLButtonElement;
    expect(() => { button.click(); }).not.toThrow();
  });
});
