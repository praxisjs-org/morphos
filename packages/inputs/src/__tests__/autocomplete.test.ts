import { describe, it, expect, vi } from "vitest";

import { Autocomplete } from "../autocomplete/autocomplete";
import type { AutocompleteSuggestion } from "../autocomplete/autocomplete.types";

interface AutocompleteInternal {
  _open: boolean;
  _value: string;
  _activeIndex: number;
  _filteredSuggestions: AutocompleteSuggestion[];
  _close: () => void;
  _selectSuggestion: (s: AutocompleteSuggestion) => void;
  _handleInput: (e: Event) => void;
  _handleKeyDown: (e: KeyboardEvent) => void;
  onBeforeMount: () => void;
}

const SUGGESTIONS: AutocompleteSuggestion[] = [
  { value: "tokyo", label: "Tokyo" },
  { value: "london", label: "London" },
  { value: "paris", label: "Paris" },
];

function make(props: Record<string, unknown> = {}): AutocompleteInternal {
  const ac = new Autocomplete({ suggestions: SUGGESTIONS, ...props });
  (ac as unknown as AutocompleteInternal).onBeforeMount();
  return ac as unknown as AutocompleteInternal;
}

describe("Autocomplete", () => {
  it("initialises with default state", () => {
    const ac = make();
    expect(ac._open).toBe(false);
    expect(ac._value).toBe("");
    expect(ac._activeIndex).toBe(-1);
  });

  it("initialises _value from defaultValue", () => {
    const ac = make({ defaultValue: "Tokyo" });
    expect(ac._value).toBe("Tokyo");
  });

  describe("_filteredSuggestions", () => {
    it("returns all suggestions when value is empty", () => {
      const ac = make();
      expect(ac._filteredSuggestions).toHaveLength(3);
    });

    it("filters by label substring (case-insensitive)", () => {
      const ac = make();
      ac._value = "tok";
      expect(ac._filteredSuggestions).toHaveLength(1);
      expect(ac._filteredSuggestions[0].value).toBe("tokyo");
    });

    it("uses custom filterFn when provided", () => {
      const filterFn = vi.fn(() => false);
      const ac = make({ filterFn });
      ac._value = "x";
      expect(ac._filteredSuggestions).toHaveLength(0);
      expect(filterFn).toHaveBeenCalled();
    });
  });

  describe("_selectSuggestion", () => {
    it("sets _value to suggestion label", () => {
      const ac = make();
      ac._open = true;
      ac._selectSuggestion(SUGGESTIONS[0]);
      expect(ac._value).toBe("Tokyo");
    });

    it("falls back to value when label is absent", () => {
      const ac = make();
      ac._selectSuggestion({ value: "no-label" });
      expect(ac._value).toBe("no-label");
    });

    it("closes the dropdown", () => {
      const ac = make();
      ac._open = true;
      ac._selectSuggestion(SUGGESTIONS[0]);
      expect(ac._open).toBe(false);
      expect(ac._activeIndex).toBe(-1);
    });

    it("calls onSuggestionSelect with the full suggestion", () => {
      const onSuggestionSelect = vi.fn();
      const ac = make({ onSuggestionSelect });
      ac._selectSuggestion(SUGGESTIONS[1]);
      expect(onSuggestionSelect).toHaveBeenCalledOnce();
      expect(onSuggestionSelect).toHaveBeenCalledWith(SUGGESTIONS[1]);
    });

    it("calls onValueChange with the display value", () => {
      const onValueChange = vi.fn();
      const ac = make({ onValueChange });
      ac._selectSuggestion(SUGGESTIONS[0]);
      expect(onValueChange).toHaveBeenCalledWith("Tokyo");
    });

    it("calls both callbacks when both are provided", () => {
      const onSuggestionSelect = vi.fn();
      const onValueChange = vi.fn();
      const ac = make({ onSuggestionSelect, onValueChange });
      ac._selectSuggestion(SUGGESTIONS[2]);
      expect(onSuggestionSelect).toHaveBeenCalledWith(SUGGESTIONS[2]);
      expect(onValueChange).toHaveBeenCalledWith("Paris");
    });
  });

  describe("_handleInput", () => {
    it("opens dropdown when value is non-empty", () => {
      const ac = make();
      const event = { target: { value: "tok" } } as unknown as Event;
      ac._handleInput(event);
      expect(ac._open).toBe(true);
      expect(ac._value).toBe("tok");
    });

    it("closes dropdown when value is cleared", () => {
      const ac = make();
      ac._open = true;
      const event = { target: { value: "" } } as unknown as Event;
      ac._handleInput(event);
      expect(ac._open).toBe(false);
    });

    it("calls onValueChange", () => {
      const onValueChange = vi.fn();
      const ac = make({ onValueChange });
      const event = { target: { value: "par" } } as unknown as Event;
      ac._handleInput(event);
      expect(onValueChange).toHaveBeenCalledWith("par");
    });

    it("resets _activeIndex", () => {
      const ac = make();
      ac._activeIndex = 2;
      const event = { target: { value: "x" } } as unknown as Event;
      ac._handleInput(event);
      expect(ac._activeIndex).toBe(-1);
    });
  });

  describe("_close", () => {
    it("resets open state and active index", () => {
      const ac = make();
      ac._open = true;
      ac._activeIndex = 1;
      ac._close();
      expect(ac._open).toBe(false);
      expect(ac._activeIndex).toBe(-1);
    });
  });
});
