// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render } from "@praxisjs/runtime";

import { Select } from "../select/select";
import type { SelectOption } from "../select/select.types";

const OPTIONS: SelectOption[] = [
  { value: "a", label: "Apple" },
  { value: "b", label: "Banana" },
  { value: "c", label: "Cherry", disabled: true },
];

function mount(node: () => unknown): HTMLDivElement {
  const container = document.createElement("div");
  document.body.appendChild(container);
  render(node as () => Node, container);
  return container;
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Select render", () => {
  it("renders a closed trigger with placeholder text and no native select when name is unset", () => {
    const container = mount(() => <Select options={OPTIONS} placeholder="Pick one" id="s1" class="sel" />);
    const root = container.querySelector("#s1") as HTMLElement;
    expect(root.className).toBe("sel");
    expect(root.hasAttribute("data-open")).toBe(false);
    expect(root.hasAttribute("data-disabled")).toBe(false);
    expect(container.querySelector("select")).toBeNull();
    const trigger = container.querySelector('[role="combobox"]') as HTMLButtonElement;
    expect(trigger.textContent).toBe("Pick one");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(trigger.getAttribute("data-placeholder")).toBe("");
    expect(container.querySelector('[role="listbox"]')).toBeNull();
  });

  it("renders a hidden native select mirroring options and value when name is set", () => {
    const container = mount(() => (
      <Select options={OPTIONS} name="fruit" defaultValue="b" required />
    ));
    const select = container.querySelector("select") as HTMLSelectElement;
    expect(select.name).toBe("fruit");
    expect(select.required).toBe(true);
    expect(select.disabled).toBe(false);
    expect(select.value).toBe("b");
    expect(select.querySelectorAll("option")).toHaveLength(3);
  });

  it("shows the selected label instead of the placeholder once a value is set", () => {
    const container = mount(() => <Select options={OPTIONS} defaultValue="a" placeholder="Pick one" />);
    const trigger = container.querySelector('[role="combobox"]') as HTMLButtonElement;
    expect(trigger.textContent).toBe("Apple");
    expect(trigger.getAttribute("data-placeholder")).toBeNull();
  });

  it("disabled disables the trigger and native select, and blocks opening", () => {
    const container = mount(() => <Select options={OPTIONS} name="fruit" disabled />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.getAttribute("data-disabled")).toBe("");
    const trigger = container.querySelector('[role="combobox"]') as HTMLButtonElement;
    expect(trigger.disabled).toBe(true);
    const select = container.querySelector("select") as HTMLSelectElement;
    expect(select.disabled).toBe(true);
    trigger.click();
    expect(container.querySelector('[role="listbox"]')).toBeNull();
  });

  it("_open_ is a no-op while disabled, even called directly (defensive guard)", () => {
    const instance = new Select({ options: OPTIONS, disabled: true });
    instance.onBeforeMount?.();
    (instance as unknown as { _open_: () => void })._open_();
    expect((instance as unknown as { _open: boolean })._open).toBe(false);
  });

  it("clicking the trigger opens the listbox with options rendered, and clicking again closes it", () => {
    const container = mount(() => <Select options={OPTIONS} />);
    const trigger = container.querySelector('[role="combobox"]') as HTMLButtonElement;
    trigger.click();
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    const listbox = container.querySelector('[role="listbox"]');
    expect(listbox).toBeTruthy();
    expect(container.querySelectorAll('[role="option"]')).toHaveLength(3);

    trigger.click();
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(container.querySelector('[role="listbox"]')).toBeNull();
  });

  it("clicking an enabled option selects it, closes the list, and mirrors into the hidden select", () => {
    const onValueChange = vi.fn();
    const container = mount(() => <Select options={OPTIONS} name="fruit" onValueChange={onValueChange} />);
    const trigger = container.querySelector('[role="combobox"]') as HTMLButtonElement;
    trigger.click();
    const options = container.querySelectorAll('[role="option"]');
    (options[1] as HTMLElement).click();
    expect(onValueChange).toHaveBeenCalledWith("b");
    expect(container.querySelector('[role="listbox"]')).toBeNull();
    expect(trigger.textContent).toBe("Banana");
    const select = container.querySelector("select") as HTMLSelectElement;
    expect(select.value).toBe("b");
  });

  it("clicking a disabled option does nothing", () => {
    const onValueChange = vi.fn();
    const container = mount(() => <Select options={OPTIONS} onValueChange={onValueChange} />);
    const trigger = container.querySelector('[role="combobox"]') as HTMLButtonElement;
    trigger.click();
    const options = container.querySelectorAll('[role="option"]');
    (options[2] as HTMLElement).click();
    expect(onValueChange).not.toHaveBeenCalled();
    expect(container.querySelector('[role="listbox"]')).toBeTruthy();
  });

  it("in controlled mode, selecting an option emits but does not change the displayed value", () => {
    const onValueChange = vi.fn();
    const container = mount(() => <Select options={OPTIONS} value="a" onValueChange={onValueChange} />);
    const trigger = container.querySelector('[role="combobox"]') as HTMLButtonElement;
    trigger.click();
    const options = container.querySelectorAll('[role="option"]');
    (options[1] as HTMLElement).click();
    expect(onValueChange).toHaveBeenCalledWith("b");
    expect(trigger.textContent).toBe("Apple");
  });

  it("is not clearable by default; clearable renders a clear button only once a value is selected", () => {
    const container = mount(() => <Select options={OPTIONS} clearable defaultValue="a" />);
    const clearBtn = container.querySelector('[data-clear]');
    expect(clearBtn).toBeTruthy();
  });

  it("omits the clear button when clearable but nothing is selected", () => {
    const container = mount(() => <Select options={OPTIONS} clearable />);
    expect(container.querySelector('[data-clear]')).toBeNull();
  });

  it("omits the clear button when not clearable, even with a value", () => {
    const container = mount(() => <Select options={OPTIONS} defaultValue="a" />);
    expect(container.querySelector('[data-clear]')).toBeNull();
  });

  it("clicking clear resets the value, calls onClear, and does not open/close the listbox", () => {
    const onClear = vi.fn();
    const onValueChange = vi.fn();
    const container = mount(() => (
      <Select options={OPTIONS} clearable defaultValue="a" onClear={onClear} onValueChange={onValueChange} />
    ));
    const trigger = container.querySelector('[role="combobox"]') as HTMLButtonElement;
    expect(trigger.textContent).toBe("Apple");
    const clearBtn = container.querySelector('[data-clear]') as HTMLButtonElement;
    clearBtn.click();
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(onValueChange).not.toHaveBeenCalled();
    expect(trigger.getAttribute("data-placeholder")).toBe("");
  });

  it("clearing in controlled mode still emits onClear without touching the controlled value", () => {
    const onClear = vi.fn();
    const container = mount(() => <Select options={OPTIONS} clearable value="a" onClear={onClear} />);
    const clearBtn = container.querySelector('[data-clear]') as HTMLButtonElement;
    clearBtn.click();
    expect(onClear).toHaveBeenCalledTimes(1);
    const trigger = container.querySelector('[role="combobox"]') as HTMLButtonElement;
    expect(trigger.textContent).toBe("Apple");
  });

  it("Enter/Space on the trigger opens the listbox", () => {
    const container = mount(() => <Select options={OPTIONS} />);
    const trigger = container.querySelector('[role="combobox"]') as HTMLButtonElement;
    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
    expect(container.querySelector('[role="listbox"]')).toBeTruthy();
  });

  it("ArrowDown on the trigger opens the listbox", () => {
    const container = mount(() => <Select options={OPTIONS} />);
    const trigger = container.querySelector('[role="combobox"]') as HTMLButtonElement;
    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    expect(container.querySelector('[role="listbox"]')).toBeTruthy();
  });

  it("other keys on the trigger are ignored", () => {
    const container = mount(() => <Select options={OPTIONS} />);
    const trigger = container.querySelector('[role="combobox"]') as HTMLButtonElement;
    trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "a", bubbles: true, cancelable: true }));
    expect(container.querySelector('[role="listbox"]')).toBeNull();
  });

  it("ArrowDown/ArrowUp in the listbox move the active option, skipping disabled ones, with wraparound", () => {
    const container = mount(() => <Select options={OPTIONS} />);
    const trigger = container.querySelector('[role="combobox"]') as HTMLButtonElement;
    trigger.click();
    const listbox = container.querySelector('[role="listbox"]') as HTMLElement;

    listbox.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    let options = container.querySelectorAll('[role="option"]');
    expect(options[1].getAttribute("data-active")).toBe("");

    listbox.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    options = container.querySelectorAll('[role="option"]');
    expect(options[0].getAttribute("data-active")).toBe("");

    listbox.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true, cancelable: true }));
    options = container.querySelectorAll('[role="option"]');
    expect(options[1].getAttribute("data-active")).toBe("");
  });

  it("Home/End in the listbox jump to the first/last enabled option", () => {
    const container = mount(() => <Select options={OPTIONS} />);
    const trigger = container.querySelector('[role="combobox"]') as HTMLButtonElement;
    trigger.click();
    const listbox = container.querySelector('[role="listbox"]') as HTMLElement;

    listbox.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true, cancelable: true }));
    let options = container.querySelectorAll('[role="option"]');
    expect(options[1].getAttribute("data-active")).toBe("");

    listbox.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true, cancelable: true }));
    options = container.querySelectorAll('[role="option"]');
    expect(options[0].getAttribute("data-active")).toBe("");
  });

  it("Enter/Space in the listbox selects the active option", () => {
    const onValueChange = vi.fn();
    const container = mount(() => <Select options={OPTIONS} onValueChange={onValueChange} />);
    const trigger = container.querySelector('[role="combobox"]') as HTMLButtonElement;
    trigger.click();
    const listbox = container.querySelector('[role="listbox"]') as HTMLElement;
    listbox.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true, cancelable: true }));
    listbox.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
    expect(onValueChange).toHaveBeenCalledWith("b");
    expect(container.querySelector('[role="listbox"]')).toBeNull();
  });

  it("Enter in the listbox is a no-op when there is no active option (e.g. no options at all)", () => {
    const onValueChange = vi.fn();
    const container = mount(() => <Select options={[]} onValueChange={onValueChange} />);
    const trigger = container.querySelector('[role="combobox"]') as HTMLButtonElement;
    trigger.click();
    const listbox = container.querySelector('[role="listbox"]') as HTMLElement;
    expect(() => {
      listbox.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }));
    }).not.toThrow();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("an unrecognized key in the listbox is ignored", () => {
    const container = mount(() => <Select options={OPTIONS} />);
    const trigger = container.querySelector('[role="combobox"]') as HTMLButtonElement;
    trigger.click();
    const listbox = container.querySelector('[role="listbox"]') as HTMLElement;
    listbox.dispatchEvent(new KeyboardEvent("keydown", { key: "a", bubbles: true, cancelable: true }));
    expect(container.querySelector('[role="listbox"]')).toBeTruthy();
  });

  it("Escape in the listbox closes it and refocuses the trigger", async () => {
    const container = mount(() => <Select options={OPTIONS} />);
    const trigger = container.querySelector('[role="combobox"]') as HTMLButtonElement;
    trigger.click();
    const listbox = container.querySelector('[role="listbox"]') as HTMLElement;
    listbox.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true, cancelable: true }));
    expect(container.querySelector('[role="listbox"]')).toBeNull();
    await Promise.resolve();
    await Promise.resolve();
    expect(document.activeElement).toBe(trigger);
  });

  it("Tab in the listbox closes it without refocusing the trigger", async () => {
    const container = mount(() => <Select options={OPTIONS} />);
    const trigger = container.querySelector('[role="combobox"]') as HTMLButtonElement;
    trigger.click();
    const listbox = container.querySelector('[role="listbox"]') as HTMLElement;
    listbox.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true }));
    expect(container.querySelector('[role="listbox"]')).toBeNull();
    await Promise.resolve();
    await Promise.resolve();
    expect(document.activeElement).not.toBe(trigger);
  });

  it("blurring the listbox to somewhere other than the trigger closes it", () => {
    const container = mount(() => <Select options={OPTIONS} />);
    const trigger = container.querySelector('[role="combobox"]') as HTMLButtonElement;
    trigger.click();
    const listbox = container.querySelector('[role="listbox"]') as HTMLElement;
    const other = document.createElement("div");
    other.id = "elsewhere";
    document.body.appendChild(other);
    listbox.dispatchEvent(new FocusEvent("blur", { relatedTarget: other }));
    expect(container.querySelector('[role="listbox"]')).toBeNull();
  });

  it("blurring the listbox back to the trigger keeps it open", () => {
    const container = mount(() => <Select options={OPTIONS} />);
    const trigger = container.querySelector('[role="combobox"]') as HTMLButtonElement;
    trigger.click();
    const listbox = container.querySelector('[role="listbox"]') as HTMLElement;
    listbox.dispatchEvent(new FocusEvent("blur", { relatedTarget: trigger }));
    expect(container.querySelector('[role="listbox"]')).toBeTruthy();
  });

  it("mousedown inside the document while open, outside the root, closes it without refocusing the trigger", async () => {
    const container = mount(() => <Select options={OPTIONS} />);
    await Promise.resolve();
    const trigger = container.querySelector('[role="combobox"]') as HTMLButtonElement;
    trigger.click();
    expect(container.querySelector('[role="listbox"]')).toBeTruthy();

    const outside = document.createElement("div");
    document.body.appendChild(outside);
    outside.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect(container.querySelector('[role="listbox"]')).toBeNull();
  });

  it("mousedown on the listbox itself prevents default (avoids stealing focus from the trigger)", () => {
    const container = mount(() => <Select options={OPTIONS} />);
    const trigger = container.querySelector('[role="combobox"]') as HTMLButtonElement;
    trigger.click();
    const listbox = container.querySelector('[role="listbox"]') as HTMLElement;
    const evt = new MouseEvent("mousedown", { bubbles: true, cancelable: true });
    listbox.dispatchEvent(evt);
    expect(evt.defaultPrevented).toBe(true);
  });

  it("mousedown inside the root while open does not close it", async () => {
    const container = mount(() => <Select options={OPTIONS} />);
    await Promise.resolve();
    const trigger = container.querySelector('[role="combobox"]') as HTMLButtonElement;
    trigger.click();
    trigger.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    expect(container.querySelector('[role="listbox"]')).toBeTruthy();
  });

  it("mousedown elsewhere while closed is a no-op", async () => {
    mount(() => <Select options={OPTIONS} />);
    await Promise.resolve();
    const outside = document.createElement("div");
    document.body.appendChild(outside);
    expect(() => {
      outside.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    }).not.toThrow();
  });

  it("removes the document mousedown listener on unmount", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const dispose = render(() => <Select options={OPTIONS} />, container);
    const removeSpy = vi.spyOn(document, "removeEventListener");
    dispose();
    expect(removeSpy).toHaveBeenCalledWith("mousedown", expect.any(Function));
    removeSpy.mockRestore();
  });
});
