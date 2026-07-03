import { describe, it, expect, vi } from "vitest";

import { Combobox } from "../combobox/combobox";
import type { ComboboxOption } from "../combobox/combobox.types";

interface ComboboxInternal {
  _open: boolean;
  _value: string | undefined;
  _query: string;
  _activeIndex: number;
  _filteredOptions: ComboboxOption[];
  _open_: () => void;
  _close: () => void;
  _select: (o: ComboboxOption) => void;
  _handleKeyDown: (e: KeyboardEvent) => void;
  onBeforeMount: () => void;
}

const OPTIONS: ComboboxOption[] = [
  { value: "fr", label: "France" },
  { value: "de", label: "Germany" },
  { value: "jp", label: "Japan" },
  { value: "xx", label: "Disabled", disabled: true },
];

function make(props: Record<string, unknown> = {}): ComboboxInternal {
  const cb = new Combobox({ options: OPTIONS, ...props });
  (cb as unknown as ComboboxInternal).onBeforeMount();
  return cb as unknown as ComboboxInternal;
}

describe("Combobox", () => {
  it("initialises with default state", () => {
    const cb = make();
    expect(cb._open).toBe(false);
    expect(cb._value).toBeUndefined();
    expect(cb._query).toBe("");
    expect(cb._activeIndex).toBe(-1);
  });

  it("initialises _value from defaultValue", () => {
    const cb = make({ defaultValue: "de" });
    expect(cb._value).toBe("de");
  });

  describe("_filteredOptions", () => {
    it("returns all options when query is empty", () => {
      const cb = make();
      expect(cb._filteredOptions).toHaveLength(4);
    });

    it("filters by label substring (case-insensitive)", () => {
      const cb = make();
      cb._query = "ger";
      expect(cb._filteredOptions).toHaveLength(1);
      expect(cb._filteredOptions[0].value).toBe("de");
    });

    it("uses custom filterFn when provided", () => {
      const filterFn = vi.fn(() => true);
      const cb = make({ filterFn });
      cb._query = "x";
      const results = cb._filteredOptions;
      expect(results).toHaveLength(4);
      expect(filterFn).toHaveBeenCalled();
    });
  });

  describe("_select", () => {
    it("sets _value in uncontrolled mode", () => {
      const cb = make();
      cb._select(OPTIONS[1]);
      expect(cb._value).toBe("de");
    });

    it("does not override _value in controlled mode (value prop set)", () => {
      const cb = make({ value: "fr" });
      cb._select(OPTIONS[1]);
      expect(cb._value).toBeUndefined();
    });

    it("closes the dropdown after selection", () => {
      const cb = make();
      cb._open = true;
      cb._activeIndex = 1;
      cb._select(OPTIONS[0]);
      expect(cb._open).toBe(false);
      expect(cb._activeIndex).toBe(-1);
    });

    it("shows the selected option label in the input after selection", () => {
      const cb = make();
      cb._query = "fra";
      cb._select(OPTIONS[0]);
      expect(cb._query).toBe("France");
    });

    it("calls onValueChange with the option value", () => {
      const onValueChange = vi.fn();
      const cb = make({ onValueChange });
      cb._select(OPTIONS[2]);
      expect(onValueChange).toHaveBeenCalledWith("jp");
    });

    it("does not call onValueChange for disabled options", () => {
      const onValueChange = vi.fn();
      const cb = make({ onValueChange });
      cb._select(OPTIONS[3]);
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("does not close dropdown for disabled options", () => {
      const cb = make();
      cb._open = true;
      cb._select(OPTIONS[3]);
      expect(cb._open).toBe(true);
    });
  });

  describe("_open_", () => {
    it("opens the dropdown", () => {
      const cb = make();
      cb._open_();
      expect(cb._open).toBe(true);
    });

    it("does nothing when disabled", () => {
      const cb = make({ disabled: true });
      cb._open_();
      expect(cb._open).toBe(false);
    });

    it("sets activeIndex to match selected value", () => {
      const cb = make({ defaultValue: "de" });
      cb._open_();
      expect(cb._activeIndex).toBe(1);
    });
  });

  describe("_close", () => {
    it("resets open state, active index and query", () => {
      const cb = make();
      cb._open = true;
      cb._activeIndex = 2;
      cb._query = "ger";
      cb._close();
      expect(cb._open).toBe(false);
      expect(cb._activeIndex).toBe(-1);
      expect(cb._query).toBe("");
    });
  });
});
