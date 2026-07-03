import { StatefulComponent } from "@praxisjs/core";
import { Component, Emit, Prop, Ref, State, type Ref as RefType } from "@praxisjs/decorators";

import { generateId, isActivationKey, Keys, wrapIndex } from "@morphos/core";

import type { SelectOption, SelectProps } from "./select.types";

@Component()
export class Select extends StatefulComponent {
  @Prop() options: SelectOption[] = [];
  @Prop() value?: string;
  @Prop() defaultValue?: string;
  @Prop() placeholder?: string;
  @Prop() disabled = false;
  @Prop() required = false;
  @Prop() name?: string;
  @Prop() clearable = false;
  @Prop() onValueChange?: SelectProps["onValueChange"];
  @Prop() onClear?: SelectProps["onClear"];
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() "aria-label"?: string;
  @Prop() "aria-labelledby"?: string;
  @Prop() "aria-describedby"?: string;

  @State() _open = false;
  @State() _value: string | undefined = undefined;
  @State() _activeIndex = -1;

  @Ref<HTMLElement>()
  private readonly _rootRef!: RefType<HTMLElement>;

  @Ref<HTMLButtonElement>()
  private readonly _triggerRef!: RefType<HTMLButtonElement>;

  private readonly _triggerId = generateId("select-trigger");
  private readonly _listboxId = generateId("select-listbox");

  onBeforeMount() {
    this._open = false;
    this._value = this.defaultValue;
    this._activeIndex = -1;
  }

  private readonly _handleDocumentMouseDown = (e: MouseEvent) => {
    if (!this._open) return;
    if (
      this._rootRef.current &&
      e.target instanceof Node &&
      this._rootRef.current.contains(e.target)
    ) return;
    this._close(false);
  };

  onMount() {
    document.addEventListener("mousedown", this._handleDocumentMouseDown);
  }

  onUnmount() {
    document.removeEventListener("mousedown", this._handleDocumentMouseDown);
  }

  private get _selectedValue(): string | undefined {
    return this.value ?? this._value;
  }

  private get _selectedLabel(): string {
    return (
      this.options.find((o) => o.value === this._selectedValue)?.label ??
      this.placeholder ??
      ""
    );
  }

  private _open_() {
    if (this.disabled) return;
    this._open = true;
    const idx = this.options.findIndex((o) => o.value === this._selectedValue);
    this._activeIndex = idx >= 0 ? idx : 0;
    queueMicrotask(() => {
      document.getElementById(this._listboxId)?.focus();
    });
  }

  private _close(refocusTrigger = true) {
    this._open = false;
    this._activeIndex = -1;
    if (refocusTrigger) {
      queueMicrotask(() => { this._triggerRef.current?.focus(); });
    }
  }

  @Emit("onValueChange")
  private _emitValueChange(value: string) {
    return value;
  }

  // @Emit calls the prop callback directly when the method has no return
  // value and no arguments to forward.
  @Emit("onClear")
  private _emitClear(): void {
    return;
  }

  private _select(option: SelectOption) {
    if (option.disabled) return;
    if (this.value === undefined) {
      this._value = option.value;
    }
    this._emitValueChange(option.value);
    this._close(true);
  }

  private _clear() {
    if (this.value === undefined) {
      this._value = undefined;
    }
    this._emitClear();
  }

  private readonly _handleTriggerKeyDown = (event: KeyboardEvent) => {
    if (isActivationKey(event) || event.key === Keys.ArrowDown) {
      event.preventDefault();
      this._open_();
    }
  };

  private readonly _handleListboxKeyDown = (event: KeyboardEvent) => {
    const enabled = this.options.filter((o) => !o.disabled);

    if (event.key === Keys.ArrowDown) {
      event.preventDefault();
      const next = wrapIndex(this._activeIndex + 1, enabled.length);
      this._activeIndex = this.options.indexOf(enabled[next]);
    } else if (event.key === Keys.ArrowUp) {
      event.preventDefault();
      const prev = wrapIndex(this._activeIndex - 1, enabled.length);
      this._activeIndex = this.options.indexOf(enabled[prev]);
    } else if (event.key === Keys.Home) {
      event.preventDefault();
      this._activeIndex = this.options.indexOf(enabled[0]);
    } else if (event.key === Keys.End) {
      event.preventDefault();
      this._activeIndex = this.options.indexOf(enabled[enabled.length - 1]);
    } else if (isActivationKey(event)) {
      event.preventDefault();
      const active = this.options[this._activeIndex] as SelectOption | undefined;
      if (active) this._select(active);
    } else if (event.key === Keys.Escape) {
      event.preventDefault();
      this._close(true);
    } else if (event.key === Keys.Tab) {
      this._close(false);
    }
  };

  render() {
    return (
      <div
        id={this.id}
        class={this.class}
        ref={this._rootRef}
        data-open={() => (this._open ? "" : undefined)}
        data-disabled={this.disabled ? "" : undefined}
      >
        {this.name && (
          <select
            name={this.name}
            value={() => this._selectedValue ?? ""}
            required={this.required}
            disabled={this.disabled}
            aria-hidden={"true" as const}
            tabIndex={-1}
            style={{ position: "absolute", opacity: "0", pointerEvents: "none" }}
          >
            {this.options.map((o) => (
              <option key={o.value} value={o.value} selected={() => o.value === this._selectedValue}>
                {o.label}
              </option>
            ))}
          </select>
        )}

        <button
          ref={this._triggerRef}
          id={this._triggerId}
          type="button"
          role="combobox"
          disabled={this.disabled}
          aria-haspopup={"listbox" as const}
          aria-expanded={() => (this._open ? "true" : "false")}
          aria-controls={this._listboxId}
          aria-label={this["aria-label"]}
          aria-labelledby={this["aria-labelledby"]}
          aria-describedby={this["aria-describedby"]}
          aria-required={this.required ? ("true" as const) : undefined}
          data-placeholder={() => (!this._selectedValue ? "" : undefined)}
          onClick={() => { if (this._open) this._close(false); else this._open_(); }}
          onKeyDown={this._handleTriggerKeyDown}
        >
          {() => this._selectedLabel}
        </button>

        {() =>
          this.clearable && !!this._selectedValue && (
            <button
              type="button"
              aria-label="Clear selection"
              data-clear=""
              onClick={(e: MouseEvent) => {
                e.stopPropagation();
                this._clear();
              }}
            >
              ×
            </button>
          )
        }

        {() =>
          this._open && (
            <ul
              id={this._listboxId}
              role="listbox"
              aria-labelledby={this._triggerId}
              tabIndex={-1}
              onMouseDown={(e: MouseEvent) => { e.preventDefault(); }}
              onKeyDown={this._handleListboxKeyDown}
              onBlur={(e: FocusEvent) => {
                const related = e.relatedTarget as HTMLElement | null;
                if (related?.id === this._triggerId) return;
                this._close(false);
              }}
            >
              {this.options.map((option, index) => (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={() => (option.value === this._selectedValue ? "true" : "false")}
                  aria-disabled={option.disabled ? ("true" as const) : undefined}
                  data-active={() => (this._activeIndex === index ? "" : undefined)}
                  data-selected={() =>
                    option.value === this._selectedValue ? "" : undefined
                  }
                  data-disabled={option.disabled ? "" : undefined}
                  onClick={() => { this._select(option); }}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          )
        }
      </div>
    );
  }
}
