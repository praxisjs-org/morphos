import { StatefulComponent } from "@praxisjs/core";
import { Component, Emit, FunctionProp, Prop, Ref, State, type Ref as RefType  } from "@praxisjs/decorators";

import { generateId, Keys } from "@morphos/core";

import type { ComboboxOption, ComboboxProps } from "./combobox.types";

const _defaultFilter = (option: ComboboxOption, query: string): boolean =>
  option.label.toLowerCase().includes(query.toLowerCase());

@Component()
export class Combobox extends StatefulComponent {
  @Prop() options: ComboboxOption[] = [];
  @Prop() value?: string;
  @Prop() defaultValue?: string;
  @Prop() placeholder?: string;
  @Prop() disabled = false;
  @Prop() required = false;
  @Prop() name?: string;
  @FunctionProp() filterFn?: ComboboxProps["filterFn"];
  @Prop() onValueChange?: ComboboxProps["onValueChange"];
  @Prop() onQueryChange?: ComboboxProps["onQueryChange"];
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() "aria-label"?: string;
  @Prop() "aria-labelledby"?: string;
  @Prop() "aria-describedby"?: string;

  @State() _open = false;
  @State() _value: string | undefined = undefined;
  @State() _query = "";
  @State() _activeIndex = -1;

  @Ref<HTMLInputElement>()
  inputRef!: RefType<HTMLInputElement>;

  readonly triggerId = generateId("combobox-trigger");
  readonly listboxId = generateId("combobox-listbox");

  @Emit("onValueChange")
  private _emitValueChange(value: string) {
    return value;
  }

  @Emit("onQueryChange")
  private _emitQueryChange(query: string) {
    return query;
  }

  onBeforeMount() {
    this._open = false;
    this._value = this.defaultValue;
    this._activeIndex = -1;
    this._query = this._labelFor(this._selectedValue);
  }

  private get _selectedValue(): string | undefined {
    return this.value ?? this._value;
  }

  private _labelFor(value: string | undefined): string {
    return this.options.find((o) => o.value === value)?.label ?? "";
  }

  private get _filteredOptions(): ComboboxOption[] {
    const fn = this.filterFn ?? _defaultFilter;
    return this.options.filter((o) => fn(o, this._query));
  }

  /** Opens the listbox, resetting the query so the full option list is browsable rather than filtered by a leftover selected label. */
  private _open_() {
    if (this.disabled) return;
    this._open = true;
    this._query = "";
    const idx = this._filteredOptions.findIndex((o) => o.value === this._selectedValue);
    this._activeIndex = idx >= 0 ? idx : 0;
  }

  /** Closes the listbox, resetting the query to reflect the current selection (if any) rather than blanking it. */
  private _close() {
    this._open = false;
    this._activeIndex = -1;
    this._query = this._labelFor(this._selectedValue);
  }

  private _select(option: ComboboxOption) {
    if (option.disabled) return;
    if (this.value === undefined) {
      this._value = option.value;
    }
    this._emitValueChange(option.value);
    this._close();
  }

  private readonly _handleKeyDown = (e: KeyboardEvent) => {
    const options = this._filteredOptions;

    if (e.key === Keys.ArrowDown) {
      e.preventDefault();
      if (!this._open) {
        this._open_();
      } else {
        const next = this._activeIndex < options.length - 1 ? this._activeIndex + 1 : 0;
        this._activeIndex = next;
      }
    } else if (e.key === Keys.ArrowUp) {
      e.preventDefault();
      if (!this._open) {
        this._open_();
        this._activeIndex = options.length - 1;
      } else {
        const prev = this._activeIndex > 0 ? this._activeIndex - 1 : options.length - 1;
        this._activeIndex = prev;
      }
    } else if (e.key === Keys.Enter) {
      e.preventDefault();
      if (this._open && this._activeIndex >= 0 && this._activeIndex < options.length) {
        this._select(options[this._activeIndex]);
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
    const idx = parseInt(li.getAttribute("data-index") ?? "-1", 10);
    if (Number.isNaN(idx) || idx < 0 || idx >= this._filteredOptions.length) return;
    this._select(this._filteredOptions[idx]);
  };

  render() {
    return (
      <div
        class={this.class}
        role="combobox"
        aria-expanded={() => (this._open ? "true" : "false")}
        aria-haspopup={"listbox" as const}
        aria-owns={this.listboxId}
        data-open={() => (this._open ? "" : undefined)}
        data-disabled={this.disabled ? "" : undefined}
        onClick={this._handleListClick}
      >
        {this.name && (
          <input
            type="hidden"
            name={this.name}
            value={() => this._selectedValue ?? ""}
            required={this.required}
          />
        )}
        <input
          ref={this.inputRef}
          id={this.id ?? this.triggerId}
          type="text"
          value={() => this._query}
          placeholder={this.placeholder}
          disabled={this.disabled}
          aria-label={this["aria-label"]}
          aria-labelledby={this["aria-labelledby"]}
          aria-describedby={this["aria-describedby"]}
          aria-autocomplete={"list" as const}
          aria-controls={this.listboxId}
          aria-required={this.required ? ("true" as const) : undefined}
          onInput={(e: Event) => {
            const typed = (e.target as HTMLInputElement).value;
            if (!this._open) this._open_();
            this._query = typed;
            this._emitQueryChange(this._query);
            if (this._query === "") {
              this._value = undefined;
              this._emitValueChange("");
            }
          }}
          onKeyDown={this._handleKeyDown}
          onFocus={() => { if (!this._open) this._open_(); }}
          onBlur={(e: FocusEvent) => {
            const related = e.relatedTarget as HTMLElement | null;
            if (related?.id === this.listboxId) return;
            this._close();
          }}
        />
        {() =>
          this._open
            ? (
              <ul
                id={this.listboxId}
                role="listbox"
                aria-label={this["aria-label"]}
                tabIndex={-1}
              >
                {() =>
                  this._filteredOptions.map((option, index) => (
                    <li
                      key={option.value}
                      role="option"
                      data-index={String(index)}
                      aria-selected={() => (option.value === this._selectedValue ? "true" : "false")}
                      aria-disabled={option.disabled ? ("true" as const) : undefined}
                      data-active={() => (this._activeIndex === index ? "" : undefined)}
                      data-selected={() => (option.value === this._selectedValue ? "" : undefined)}
                      data-disabled={option.disabled ? "" : undefined}
                    >
                      {option.label}
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
