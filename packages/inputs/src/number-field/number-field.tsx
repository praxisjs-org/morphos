import { StatefulComponent } from "@praxisjs/core";
import { Component, Emit, Prop, State } from "@praxisjs/decorators";

import type { NumberFieldProps } from "./number-field.types";

@Component()
export class NumberField extends StatefulComponent {
  @Prop() value?: number;
  @Prop() defaultValue?: number;
  @Prop() min?: number;
  @Prop() max?: number;
  @Prop() step = 1;
  @Prop() disabled = false;
  @Prop() required = false;
  @Prop() name?: string;
  @Prop() formatOptions?: NumberFieldProps["formatOptions"];
  @Prop() onValueChange?: NumberFieldProps["onValueChange"];
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() "aria-label"?: string;
  @Prop() "aria-labelledby"?: string;
  @Prop() "aria-describedby"?: string;

  @State() _value: number | undefined = undefined;

  onBeforeMount() {
    this._value = this.defaultValue;
  }

  get currentValue(): number | undefined {
    return this.value ?? this._value;
  }

  private _clamp(n: number): number {
    let result = n;
    if (this.min !== undefined) result = Math.max(this.min, result);
    if (this.max !== undefined) result = Math.min(this.max, result);
    return result;
  }

  /** Rounds to the decimal precision of `step`, avoiding float drift (e.g. 29.99 + 0.01 !== 30.000000000000004) from repeated increment/decrement. */
  private _round(n: number): number {
    const str = String(this.step);
    const dot = str.indexOf(".");
    const precision = dot === -1 ? 0 : str.length - dot - 1;
    const factor = 10 ** precision;
    return Math.round(n * factor) / factor;
  }

  private get _displayValue(): string {
    const val = this.currentValue;
    if (val === undefined) return "";
    if (this.formatOptions) {
      return new Intl.NumberFormat(undefined, this.formatOptions).format(val);
    }
    return String(val);
  }

  @Emit("onValueChange")
  private _setValue(value: number): number {
    const clamped = this._clamp(value);
    if (this.value === undefined) this._value = clamped;
    return clamped;
  }

  increment() {
    const current = this.currentValue ?? 0;
    this._setValue(this._round(current + this.step));
  }

  decrement() {
    const current = this.currentValue ?? 0;
    this._setValue(this._round(current - this.step));
  }

  private readonly _handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const parsed = parseFloat(target.value.replace(/[^0-9.\-]/g, ""));
    if (!isNaN(parsed)) this._setValue(parsed);
  };

  render() {
    return (
      <div
        class={this.class}
        data-disabled={this.disabled ? "" : undefined}
      >
        <button
          type="button"
          aria-label="Decrement"
          disabled={() => this.disabled || (this.min !== undefined && (this.currentValue ?? 0) <= this.min)}
          onClick={() => { this.decrement(); }}
        >
          -
        </button>
        <input
          id={this.id}
          type="text"
          inputMode={"decimal" as const}
          role="spinbutton"
          name={this.name}
          value={() => this._displayValue}
          disabled={this.disabled}
          required={this.required}
          aria-label={this["aria-label"]}
          aria-labelledby={this["aria-labelledby"]}
          aria-describedby={this["aria-describedby"]}
          aria-valuenow={() => this.currentValue}
          aria-valuemin={() => this.min}
          aria-valuemax={() => this.max}
          aria-required={this.required ? ("true" as const) : undefined}
          onChange={this._handleChange}
        />
        <button
          type="button"
          aria-label="Increment"
          disabled={() => this.disabled || (this.max !== undefined && (this.currentValue ?? 0) >= this.max)}
          onClick={() => { this.increment(); }}
        >
          +
        </button>
      </div>
    );
  }
}
