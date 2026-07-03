// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render } from "@praxisjs/runtime";

import { Toolbar, ToolbarButton, ToolbarSeparator } from "../toolbar/toolbar";

afterEach(() => {
  document.body.innerHTML = "";
});

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  document.body.appendChild(container);
  render(node as () => Node, container);
  return container;
}

describe("Toolbar", () => {
  it("renders role=toolbar with horizontal orientation by default", () => {
    const container = mount(() => (
      <Toolbar id="tb-1" class="tb" aria-label="al" aria-labelledby="alb">
        <div>x</div>
      </Toolbar>
    ));
    const root = container.querySelector('[role="toolbar"]');
    expect(root?.id).toBe("tb-1");
    expect(root?.className).toBe("tb");
    expect(root?.getAttribute("aria-label")).toBe("al");
    expect(root?.getAttribute("aria-labelledby")).toBe("alb");
    expect(root?.getAttribute("aria-orientation")).toBe("horizontal");
    expect(root?.getAttribute("data-orientation")).toBe("horizontal");
  });

  it("wires a real keydown DOM event to handleKeyDown", () => {
    const container = mount(() => <Toolbar orientation="horizontal" />);
    const root = container.querySelector('[role="toolbar"]') as HTMLElement;
    expect(() => {
      root.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true, cancelable: true }));
    }).not.toThrow();
  });

  it("supports vertical orientation", () => {
    const container = mount(() => <Toolbar orientation="vertical" />);
    const root = container.querySelector('[role="toolbar"]');
    expect(root?.getAttribute("aria-orientation")).toBe("vertical");
    expect(root?.getAttribute("data-orientation")).toBe("vertical");
  });

  it("registerItem/unregisterItem manage the tracked items list", () => {
    const toolbar = new Toolbar();
    toolbar.onBeforeMount?.();
    const a = document.createElement("button");
    const b = document.createElement("button");
    toolbar.registerItem(a);
    toolbar.registerItem(a); // duplicate registration is a no-op
    toolbar.registerItem(b);
    expect(toolbar._items).toEqual([a, b]);
    toolbar.unregisterItem(a);
    expect(toolbar._items).toEqual([b]);
    toolbar.unregisterItem(a); // already removed — no-op, doesn't throw
    expect(toolbar._items).toEqual([b]);
  });

  it("ArrowRight/ArrowLeft move focus horizontally with wraparound", async () => {
    const toolbar = new Toolbar({ orientation: "horizontal" });
    toolbar.onBeforeMount?.();
    const container = mount(() => (
      <>
        <ToolbarButton toolbar={toolbar}>1</ToolbarButton>
        <ToolbarButton toolbar={toolbar}>2</ToolbarButton>
        <ToolbarButton toolbar={toolbar}>3</ToolbarButton>
      </>
    ));
    await Promise.resolve(); // onMount registers buttons with the toolbar in a microtask
    const buttons = Array.from(container.querySelectorAll("button")) as HTMLButtonElement[];

    toolbar.handleKeyDown(new KeyboardEvent("keydown", { key: "ArrowRight", cancelable: true }));
    expect(document.activeElement).toBe(buttons[1]);

    toolbar.handleKeyDown(new KeyboardEvent("keydown", { key: "ArrowRight", cancelable: true }));
    toolbar.handleKeyDown(new KeyboardEvent("keydown", { key: "ArrowRight", cancelable: true }));
    expect(document.activeElement).toBe(buttons[0]); // wrapped around

    toolbar.handleKeyDown(new KeyboardEvent("keydown", { key: "ArrowLeft", cancelable: true }));
    expect(document.activeElement).toBe(buttons[2]); // wrapped the other way
  });

  it("ArrowDown/ArrowUp move focus vertically; horizontal keys and unrelated keys are ignored", async () => {
    const toolbar = new Toolbar({ orientation: "vertical" });
    toolbar.onBeforeMount?.();
    const container = mount(() => (
      <>
        <ToolbarButton toolbar={toolbar}>1</ToolbarButton>
        <ToolbarButton toolbar={toolbar}>2</ToolbarButton>
      </>
    ));
    await Promise.resolve();
    const buttons = Array.from(container.querySelectorAll("button")) as HTMLButtonElement[];

    toolbar.handleKeyDown(new KeyboardEvent("keydown", { key: "ArrowDown", cancelable: true }));
    expect(document.activeElement).toBe(buttons[1]);

    toolbar.handleKeyDown(new KeyboardEvent("keydown", { key: "ArrowUp", cancelable: true }));
    expect(document.activeElement).toBe(buttons[0]);

    // Horizontal-only keys should be no-ops in vertical mode (else branch).
    toolbar.handleKeyDown(new KeyboardEvent("keydown", { key: "ArrowRight", cancelable: true }));
    expect(document.activeElement).toBe(buttons[0]);

    // Any unrelated key also hits the else/no-op branch.
    toolbar.handleKeyDown(new KeyboardEvent("keydown", { key: "a", cancelable: true }));
    expect(document.activeElement).toBe(buttons[0]);
  });
});

describe("ToolbarButton", () => {
  it("registers itself with the toolbar on mount and unregisters on unmount", async () => {
    const toolbar = new Toolbar();
    toolbar.onBeforeMount?.();
    const container = document.createElement("div");
    document.body.appendChild(container);
    const dispose = render(() => (
      <ToolbarButton toolbar={toolbar} id="b1" class="btn" aria-label="al">
        Click
      </ToolbarButton>
    ), container);
    await Promise.resolve();
    expect(toolbar._items).toHaveLength(1);
    const button = container.querySelector("button") as HTMLButtonElement;
    expect(button.id).toBe("b1");
    expect(button.className).toBe("btn");
    expect(button.getAttribute("aria-label")).toBe("al");
    expect(button.tabIndex).toBe(0); // focusedIndex 0 === its own index 0
    dispose();
    expect(toolbar._items).toHaveLength(0);
  });

  it("disabled buttons do not register with the toolbar and are not clickable", async () => {
    const toolbar = new Toolbar();
    toolbar.onBeforeMount?.();
    const onClick = vi.fn();
    const container = mount(() => (
      <ToolbarButton toolbar={toolbar} disabled onClick={onClick}>
        X
      </ToolbarButton>
    ));
    await Promise.resolve();
    expect(toolbar._items).toHaveLength(0);
    const button = container.querySelector("button") as HTMLButtonElement;
    expect(button.getAttribute("aria-disabled")).toBe("true");
    expect(button.getAttribute("data-disabled")).toBe("");
    button.click();
    expect(onClick).not.toHaveBeenCalled();
  });

  it("onClick's disabled guard is exercised directly (native disabled buttons don't dispatch click)", () => {
    const toolbar = new Toolbar();
    toolbar.onBeforeMount?.();
    const onClick = vi.fn();
    const btn = new ToolbarButton({ toolbar, disabled: true, onClick });
    (btn as unknown as { _handleClick: () => void })._handleClick();
    expect(onClick).not.toHaveBeenCalled();
  });

  it("tabIndex resolves to -1 when the button ref has not resolved yet (defensive branch)", () => {
    const toolbar = new Toolbar();
    toolbar.onBeforeMount?.();
    const btn = new ToolbarButton({ toolbar });
    // No render() happened, so buttonRef.current is still unset.
    expect((btn as unknown as { _computeTabIndex: () => number })._computeTabIndex()).toBe(-1);
  });

  it("onUnmount tolerates a button whose ref never resolved (defensive branch)", () => {
    const toolbar = new Toolbar();
    toolbar.onBeforeMount?.();
    const btn = new ToolbarButton({ toolbar });
    expect(() => { btn.onUnmount?.(); }).not.toThrow();
  });

  it("clicking an enabled button fires onClick", () => {
    const toolbar = new Toolbar();
    toolbar.onBeforeMount?.();
    const onClick = vi.fn();
    const container = mount(() => (
      <ToolbarButton toolbar={toolbar} onClick={onClick}>X</ToolbarButton>
    ));
    const button = container.querySelector("button") as HTMLButtonElement;
    button.click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("a non-focused button has tabIndex -1", () => {
    const toolbar = new Toolbar();
    toolbar.onBeforeMount?.();
    const container = mount(() => (
      <>
        <ToolbarButton toolbar={toolbar}>1</ToolbarButton>
        <ToolbarButton toolbar={toolbar}>2</ToolbarButton>
      </>
    ));
    const buttons = Array.from(container.querySelectorAll("button")) as HTMLButtonElement[];
    expect(buttons[1].tabIndex).toBe(-1);
  });
});

describe("ToolbarSeparator", () => {
  it("is oriented perpendicular to the toolbar (horizontal toolbar -> vertical separator)", () => {
    const toolbar = new Toolbar({ orientation: "horizontal" });
    toolbar.onBeforeMount?.();
    const container = mount(() => <ToolbarSeparator toolbar={toolbar} id="sep" class="s" />);
    const sep = container.querySelector('[role="separator"]');
    expect(sep?.id).toBe("sep");
    expect(sep?.className).toBe("s");
    expect(sep?.getAttribute("aria-orientation")).toBe("vertical");
    expect(sep?.getAttribute("data-orientation")).toBe("vertical");
  });

  it("is horizontal when the toolbar is vertical", () => {
    const toolbar = new Toolbar({ orientation: "vertical" });
    toolbar.onBeforeMount?.();
    const container = mount(() => <ToolbarSeparator toolbar={toolbar} />);
    const sep = container.querySelector('[role="separator"]');
    expect(sep?.getAttribute("aria-orientation")).toBe("horizontal");
    expect(sep?.getAttribute("data-orientation")).toBe("horizontal");
  });
});
