import { StatefulComponent } from "@praxisjs/core";
import { Component, Emit, Prop, Ref, State, Watch, type Ref as RefType  } from "@praxisjs/decorators";

import type { CheckboxProps } from "./checkbox.types";

@Component()
export class Checkbox extends StatefulComponent {
  @Prop() checked?: boolean;
  @Prop() defaultChecked = false;
  @Prop() indeterminate = false;
  @Prop() disabled = false;
  @Prop() required = false;
  @Prop() name?: string;
  @Prop() value?: string;
  @Prop() onCheckedChange?: CheckboxProps["onCheckedChange"];
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() children?: CheckboxProps["children"];
  @Prop() "aria-label"?: string;
  @Prop() "aria-labelledby"?: string;
  @Prop() "aria-describedby"?: string;

  /** Internal checked state used in uncontrolled mode. */
  @State() _checked = false;

  @Ref<HTMLInputElement>()
  inputRef!: RefType<HTMLInputElement>;

  @Emit("onCheckedChange")
  private _emitCheckedChange(checked: boolean) {
    return checked;
  }

  @Watch("indeterminate")
  private _syncIndeterminate() {
    const el = this.inputRef.current;
    if (el) el.indeterminate = this.indeterminate;
  }

  onBeforeMount() {
    this._checked = this.defaultChecked;
  }

  onMount() {
    if (this.inputRef.current) this.inputRef.current.indeterminate = this.indeterminate;
  }

  /** Resolves current checked state — prefers controlled `checked` prop. */
  private get _isChecked(): boolean {
    return this.checked ?? this._checked;
  }

  private readonly _handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (this.checked === undefined) {
      this._checked = target.checked;
    }
    this._emitCheckedChange(target.checked);
  };

  render() {
    return (
      <input
        ref={this.inputRef}
        id={this.id}
        type="checkbox"
        name={this.name}
        value={this.value}
        checked={() => this._isChecked}
        disabled={this.disabled}
        required={this.required}
        class={this.class}
        aria-label={this["aria-label"]}
        aria-labelledby={this["aria-labelledby"]}
        aria-describedby={this["aria-describedby"]}
        aria-checked={() => (this.indeterminate ? "mixed" : this._isChecked ? "true" : "false")}
        aria-required={this.required ? ("true" as const) : undefined}
        data-checked={() => (this._isChecked ? "" : undefined)}
        data-indeterminate={() => (this.indeterminate ? "" : undefined)}
        data-disabled={this.disabled ? "" : undefined}
        onChange={this._handleChange}
      />
    );
  }
}
