import { StatefulComponent } from "@praxisjs/core";
import { Component, Emit, Prop, State } from "@praxisjs/decorators";

import { isActivationKey } from "@morphos/core";

import type { SwitchProps } from "./switch.types";

@Component()
export class Switch extends StatefulComponent {
  @Prop() checked?: boolean;
  @Prop() defaultChecked = false;
  @Prop() disabled = false;
  @Prop() name?: string;
  @Prop() value?: string;
  @Prop() onCheckedChange?: SwitchProps["onCheckedChange"];
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() children?: SwitchProps["children"];
  @Prop() "aria-label"?: string;
  @Prop() "aria-labelledby"?: string;
  @Prop() "aria-describedby"?: string;

  @State() _checked = false;

  onBeforeMount() {
    this._checked = this.defaultChecked;
  }

  get isChecked(): boolean {
    return this.checked ?? this._checked;
  }

  @Emit("onCheckedChange")
  private _toggle() {
    const next = !this.isChecked;
    if (this.checked === undefined) {
      this._checked = next;
    }
    return next;
  }

  private readonly _handleClick = () => {
    if (!this.disabled) this._toggle();
  };

  private readonly _handleKeyDown = (event: KeyboardEvent) => {
    if (!this.disabled && isActivationKey(event)) {
      event.preventDefault();
      this._toggle();
    }
  };

  render() {
    return (
      <div style={{ display: "contents" }}>
        <button
          id={this.id}
          type="button"
          role="switch"
          class={this.class}
          disabled={this.disabled}
          aria-checked={() => (this.isChecked ? "true" : "false")}
          aria-label={this["aria-label"]}
          aria-labelledby={this["aria-labelledby"]}
          aria-describedby={this["aria-describedby"]}
          data-checked={() => (this.isChecked ? "" : undefined)}
          data-disabled={this.disabled ? "" : undefined}
          onClick={this._handleClick}
          onKeyDown={this._handleKeyDown}
        >
          {this.children}
        </button>
        {() =>
          this.name && (
            <input
              type="checkbox"
              name={this.name}
              value={this.value}
              checked={() => this.isChecked}
              tabIndex={-1}
              aria-hidden={"true" as const}
              style={{ display: "none" }}
            />
          )
        }
      </div>
    );
  }
}
