import { StatefulComponent } from "@praxisjs/core";
import { Component, Emit, FunctionProp, Prop, Ref, State, type Ref as RefType  } from "@praxisjs/decorators";

import { generateId, Keys } from "@morphos/core";

import type { AutocompleteProps, AutocompleteSuggestion } from "./autocomplete.types";

const _defaultFilter = (suggestion: AutocompleteSuggestion, query: string): boolean => {
  const text = suggestion.label ?? suggestion.value;
  return text.toLowerCase().includes(query.toLowerCase());
};

@Component()
export class Autocomplete extends StatefulComponent {
  @Prop() suggestions: AutocompleteSuggestion[] = [];
  @Prop() value?: string;
  @Prop() defaultValue?: string;
  @Prop() placeholder?: string;
  @Prop() disabled = false;
  @FunctionProp() filterFn?: AutocompleteProps["filterFn"];
  @Prop() onValueChange?: AutocompleteProps["onValueChange"];
  @Prop() onSuggestionSelect?: AutocompleteProps["onSuggestionSelect"];
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() "aria-label"?: string;
  @Prop() "aria-labelledby"?: string;
  @Prop() "aria-describedby"?: string;

  @State() _open = false;
  @State() _value = "";
  @State() _activeIndex = -1;

  @Ref<HTMLInputElement>()
  inputRef!: RefType<HTMLInputElement>;

  private readonly _listId = generateId("autocomplete-list");
  private readonly _inputId = generateId("autocomplete-input");

  @Emit("onSuggestionSelect")
  private _emitSuggestionSelect(suggestion: AutocompleteSuggestion) {
    return suggestion;
  }

  @Emit("onValueChange")
  private _emitValueChange(value: string) {
    return value;
  }

  onBeforeMount() {
    this._open = false;
    this._value = this.defaultValue ?? this.value ?? "";
    this._activeIndex = -1;
  }

  private get _filteredSuggestions(): AutocompleteSuggestion[] {
    const fn = this.filterFn ?? _defaultFilter;
    return this.suggestions.filter((s) => fn(s, this._value));
  }

  private _close() {
    this._open = false;
    this._activeIndex = -1;
  }

  private _selectSuggestion(suggestion: AutocompleteSuggestion) {
    const displayValue = suggestion.label ?? suggestion.value;
    this._value = displayValue;
    this._emitSuggestionSelect(suggestion);
    this._emitValueChange(displayValue);
    this._close();
  }

  private readonly _handleInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    this._value = target.value;
    this._emitValueChange(this._value);
    this._open = this._value.length > 0;
    this._activeIndex = -1;
  };

  private readonly _handleKeyDown = (e: KeyboardEvent) => {
    const suggestions = this._filteredSuggestions;

    if (e.key === Keys.ArrowDown) {
      e.preventDefault();
      if (!this._open && this._value) {
        this._open = true;
        this._activeIndex = 0;
      } else {
        const next = this._activeIndex < suggestions.length - 1 ? this._activeIndex + 1 : 0;
        this._activeIndex = next;
      }
    } else if (e.key === Keys.ArrowUp) {
      e.preventDefault();
      const prev = this._activeIndex > 0 ? this._activeIndex - 1 : suggestions.length - 1;
      this._activeIndex = prev;
    } else if (e.key === Keys.Enter) {
      e.preventDefault();
      if (this._open && this._activeIndex >= 0 && this._activeIndex < suggestions.length) {
        this._selectSuggestion(suggestions[this._activeIndex]);
      }
    } else if (e.key === Keys.Escape) {
      e.preventDefault();
      this._close();
    } else if (e.key === Keys.Tab) {
      this._close();
    }
  };

  private readonly _handleListClick = (e: MouseEvent) => {
    if (!this._open) return;
    const li = (e.target as HTMLElement).closest("li");
    if (!li) return;
    const idx = parseInt(li.id.replace(`${this._listId}-option-`, ""), 10);
    if (Number.isNaN(idx) || idx < 0 || idx >= this._filteredSuggestions.length) return;
    this._selectSuggestion(this._filteredSuggestions[idx]);
  };

  render() {
    return (
      <div
        class={this.class}
        data-open={() => (this._open ? "" : undefined)}
        data-disabled={this.disabled ? "" : undefined}
        onClick={this._handleListClick}
      >
        <input
          ref={this.inputRef}
          id={this.id ?? this._inputId}
          type="text"
          role="combobox"
          value={() => this._value}
          placeholder={this.placeholder}
          disabled={this.disabled}
          aria-label={this["aria-label"]}
          aria-labelledby={this["aria-labelledby"]}
          aria-describedby={this["aria-describedby"]}
          aria-autocomplete={"list" as const}
          aria-expanded={() => (this._open ? "true" : "false")}
          aria-controls={this._listId}
          aria-activedescendant={() =>
            this._open && this._activeIndex >= 0
              ? `${this._listId}-option-${String(this._activeIndex)}`
              : undefined
          }
          onInput={this._handleInput}
          onKeyDown={this._handleKeyDown}
          onBlur={(e: FocusEvent) => {
            const related = e.relatedTarget as HTMLElement | null;
            if (related?.id === this._listId) return;
            this._close();
          }}
        />
        {() =>
          this._open
            ? (
              <ul
                id={this._listId}
                role="listbox"
                tabIndex={-1}
              >
                {() =>
                  this._filteredSuggestions.map((suggestion, index) => (
                    <li
                      key={suggestion.value}
                      id={`${this._listId}-option-${String(index)}`}
                      role="option"
                      aria-selected={() => (this._activeIndex === index ? "true" : "false")}
                      data-active={() => (this._activeIndex === index ? "" : undefined)}
                    >
                      {suggestion.label ?? suggestion.value}
                    </li>
                  ))
                }
              </ul>
            )
            : null
        }
      </div>
    );
  }
}
