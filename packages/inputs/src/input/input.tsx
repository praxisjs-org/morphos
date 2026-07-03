import { StatefulComponent } from "@praxisjs/core";
import { Component, Emit, Prop, State } from "@praxisjs/decorators";

import type { InputProps } from "./input.types";

@Component()
export class Input extends StatefulComponent {
  @Prop() type: InputProps["type"] = "text";
  @Prop() value?: string;
  @Prop() defaultValue?: string;
  @Prop() placeholder?: string;
  @Prop() disabled?: boolean;
  @Prop() readonly?: boolean;
  @Prop() required?: boolean;
  @Prop() invalid?: boolean;
  @Prop() name?: string;
  @Prop() autoComplete?: string;
  @Prop() maxLength?: number;
  @Prop() minLength?: number;
  @Prop() onInput?: InputProps["onInput"];
  @Prop() onChange?: InputProps["onChange"];
  @Prop() onFocus?: InputProps["onFocus"];
  @Prop() onBlur?: InputProps["onBlur"];
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() "aria-label"?: string;
  @Prop() "aria-labelledby"?: string;
  @Prop() "aria-describedby"?: string;

  @State() _focused = false;

  /** Resolves the active value — controlled when `value` prop is set. */
  private get _value(): string | undefined {
    return this.value ?? this.defaultValue;
  }

  // Bodies intentionally just reference their params: @Emit forwards the
  // original call arguments to the prop callback when the method returns
  // undefined, which is how these preserve their two-argument signatures.
  @Emit("onInput")
  private _emitInput(value: string, event: Event): void {
    void value;
    void event;
  }

  @Emit("onChange")
  private _emitChange(value: string, event: Event): void {
    void value;
    void event;
  }

  @Emit("onFocus")
  private _emitFocus(event: FocusEvent): void {
    void event;
  }

  @Emit("onBlur")
  private _emitBlur(event: FocusEvent): void {
    void event;
  }

  private readonly _handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    this._emitInput(target.value, event);
  };

  private readonly _handleChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    this._emitChange(target.value, event);
  };

  private readonly _handleFocus = (event: FocusEvent) => {
    this._focused = true;
    this._emitFocus(event);
  };

  private readonly _handleBlur = (event: FocusEvent) => {
    this._focused = false;
    this._emitBlur(event);
  };

  render() {
    return (
      <input
        id={this.id}
        type={this.type}
        value={() => this._value}
        placeholder={this.placeholder}
        disabled={this.disabled}
        readOnly={this.readonly}
        required={this.required}
        name={this.name}
        autoComplete={this.autoComplete}
        maxLength={this.maxLength}
        minLength={this.minLength}
        class={this.class}
        aria-label={this["aria-label"]}
        aria-labelledby={this["aria-labelledby"]}
        aria-describedby={this["aria-describedby"]}
        aria-invalid={this.invalid ? ("true" as const) : undefined}
        aria-required={this.required ? ("true" as const) : undefined}
        data-disabled={this.disabled ? "" : undefined}
        data-invalid={() => (this.invalid ? "" : undefined)}
        data-focused={() => (this._focused ? "" : undefined)}
        onInput={this._handleInput}
        onChange={this._handleChange}
        onFocus={this._handleFocus}
        onBlur={this._handleBlur}
      />
    );
  }
}
