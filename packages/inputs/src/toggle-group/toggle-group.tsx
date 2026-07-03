import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { Component, Emit, Prop, State } from "@praxisjs/decorators";

import type { ToggleGroupItemProps, ToggleGroupProps } from "./toggle-group.types";

@Component()
export class ToggleGroup extends StatefulComponent {
  @Prop() type!: ToggleGroupProps["type"];
  @Prop() value?: string | string[];
  @Prop() defaultValue?: string | string[];
  @Prop() disabled = false;
  @Prop() orientation: ToggleGroupProps["orientation"] = "horizontal";
  @Prop() onValueChange?: ToggleGroupProps["onValueChange"];
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() children?: ToggleGroupProps["children"];
  @Prop() "aria-label"?: string;
  @Prop() "aria-labelledby"?: string;

  @State() _value: string | string[] | undefined = undefined;

  onBeforeMount() {
    this._value = this.defaultValue ?? (this.type === "multiple" ? [] : undefined);
  }

  private get _resolvedValue(): string | string[] | undefined {
    return this.value ?? this._value;
  }

  isPressed(value: string): boolean {
    const resolved = this._resolvedValue;
    if (Array.isArray(resolved)) return resolved.includes(value);
    return resolved === value;
  }

  @Emit("onValueChange")
  toggle(value: string): string | string[] {
    if (this.type === "single") {
      const next = this._resolvedValue === value ? undefined : value;
      if (this.value === undefined) this._value = next;
      return next ?? "";
    }

    const current = Array.isArray(this._resolvedValue) ? [...this._resolvedValue] : [];
    const idx = current.indexOf(value);
    const next = idx === -1 ? [...current, value] : current.filter((v) => v !== value);
    if (this.value === undefined) this._value = next;
    return next;
  }

  render() {
    return (
      <div
        id={this.id}
        role="group"
        class={this.class}
        aria-label={this["aria-label"]}
        aria-labelledby={this["aria-labelledby"]}
        aria-disabled={this.disabled ? ("true" as const) : undefined}
        aria-orientation={() => this.orientation}
        data-type={() => this.type}
        data-orientation={() => this.orientation}
        data-disabled={this.disabled ? "" : undefined}
      >
        {this.children}
      </div>
    );
  }
}

@Component()
export class ToggleGroupItem extends StatelessComponent<ToggleGroupItemProps> {
  render() {
    const { group, value, disabled, children, class: cls, id } = this.props;
    const isDisabled = disabled ?? group.disabled;

    return (
      <button
        id={id}
        type="button"
        class={cls}
        disabled={isDisabled}
        aria-pressed={() => (group.isPressed(value) ? "true" : "false")}
        aria-label={this.props["aria-label"]}
        aria-labelledby={this.props["aria-labelledby"]}
        data-pressed={() => (group.isPressed(value) ? "" : undefined)}
        data-disabled={isDisabled ? "" : undefined}
        onClick={() => { if (!isDisabled) group.toggle(value); }}
      >
        {children}
      </button>
    );
  }
}
