import { StatefulComponent } from "@praxisjs/core";
import { Component, Emit, Prop, State } from "@praxisjs/decorators";

import type { SliderProps } from "./slider.types";

@Component()
export class Slider extends StatefulComponent {
  @Prop() value?: number;
  @Prop() defaultValue?: number;
  @Prop() min = 0;
  @Prop() max = 100;
  @Prop() step = 1;
  @Prop() disabled = false;
  @Prop() name?: string;
  @Prop() orientation: SliderProps["orientation"] = "horizontal";
  @Prop() onValueChange?: SliderProps["onValueChange"];
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() "aria-label"?: string;
  @Prop() "aria-labelledby"?: string;
  @Prop() "aria-describedby"?: string;

  @State() _value = 0;

  onBeforeMount() {
    this._value = this.defaultValue ?? this.min;
  }

  get currentValue(): number {
    return this.value ?? this._value;
  }

  private get _percentage(): number {
    const range = this.max - this.min;
    if (range === 0) return 0;
    return ((this.currentValue - this.min) / range) * 100;
  }

  @Emit("onValueChange")
  private _setValue(value: number): number {
    const clamped = Math.min(this.max, Math.max(this.min, value));
    if (this.value === undefined) this._value = clamped;
    return clamped;
  }

  private readonly _handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    this._setValue(parseFloat(target.value));
  };

  render() {
    return (
      <div
        role="presentation"
        class={this.class}
        data-orientation={() => this.orientation}
        data-disabled={this.disabled ? "" : undefined}
        data-value={() => String(this.currentValue)}
        style={() => ({ "--slider-value": `${String(this._percentage)}%` })}
      >
        <input
          id={this.id}
          type="range"
          name={this.name}
          min={this.min}
          max={this.max}
          step={this.step}
          value={() => this.currentValue}
          disabled={this.disabled}
          aria-label={this["aria-label"]}
          aria-labelledby={this["aria-labelledby"]}
          aria-describedby={this["aria-describedby"]}
          aria-orientation={() => this.orientation}
          aria-valuemin={() => this.min}
          aria-valuemax={() => this.max}
          aria-valuenow={() => this.currentValue}
          onInput={this._handleChange}
        />
      </div>
    );
  }
}
