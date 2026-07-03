import { StatefulComponent } from "@praxisjs/core";
import { Component, Emit, Prop, State } from "@praxisjs/decorators";

import type { ToggleProps } from "./toggle.types";

@Component()
export class Toggle extends StatefulComponent {
  @Prop() pressed?: boolean;
  @Prop() defaultPressed = false;
  @Prop() disabled = false;
  @Prop() onPressedChange?: ToggleProps["onPressedChange"];
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() children?: ToggleProps["children"];
  @Prop() "aria-label"?: string;
  @Prop() "aria-labelledby"?: string;
  @Prop() "aria-describedby"?: string;

  @State() _pressed = false;

  onBeforeMount() {
    this._pressed = this.defaultPressed;
  }

  get isPressed(): boolean {
    return this.pressed ?? this._pressed;
  }

  @Emit("onPressedChange")
  private _toggle() {
    const next = !this.isPressed;
    if (this.pressed === undefined) {
      this._pressed = next;
    }
    return next;
  }

  private readonly _handleClick = () => {
    if (!this.disabled) this._toggle();
  };

  render() {
    return (
      <button
        id={this.id}
        type="button"
        class={this.class}
        disabled={this.disabled}
        aria-pressed={() => (this.isPressed ? "true" : "false")}
        aria-label={this["aria-label"]}
        aria-labelledby={this["aria-labelledby"]}
        aria-describedby={this["aria-describedby"]}
        data-pressed={() => (this.isPressed ? "" : undefined)}
        data-disabled={this.disabled ? "" : undefined}
        onClick={this._handleClick}
      >
        {this.children}
      </button>
    );
  }
}
