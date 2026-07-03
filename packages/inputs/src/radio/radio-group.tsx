import { StatefulComponent } from "@praxisjs/core";
import { Component, Emit, Prop, State } from "@praxisjs/decorators";

import type { RadioGroupProps } from "./radio.types";

@Component()
export class RadioGroup extends StatefulComponent {
  @Prop() value?: string;
  @Prop() defaultValue?: string;
  @Prop() name?: string;
  @Prop() disabled = false;
  @Prop() required = false;
  @Prop() orientation: RadioGroupProps["orientation"] = "vertical";
  @Prop() onValueChange?: RadioGroupProps["onValueChange"];
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() children?: RadioGroupProps["children"];
  @Prop() "aria-label"?: string;
  @Prop() "aria-labelledby"?: string;

  @State() _value: string | undefined = undefined;

  onBeforeMount() {
    this._value = this.defaultValue;
  }

  /** Resolves the active value — controlled when `value` prop is set. */
  get selectedValue(): string | undefined {
    return this.value ?? this._value;
  }

  /** Called by child Radio components when they are selected. */
  @Emit("onValueChange")
  select(value: string) {
    if (this.value === undefined) this._value = value;
    return value;
  }

  render() {
    return (
      <div
        id={this.id}
        role="radiogroup"
        class={this.class}
        aria-label={this["aria-label"]}
        aria-labelledby={this["aria-labelledby"]}
        aria-orientation={() => this.orientation}
        aria-required={this.required ? ("true" as const) : undefined}
        aria-disabled={this.disabled ? ("true" as const) : undefined}
        data-disabled={this.disabled ? "" : undefined}
        data-orientation={() => this.orientation}
      >
        {this.children}
      </div>
    );
  }
}
