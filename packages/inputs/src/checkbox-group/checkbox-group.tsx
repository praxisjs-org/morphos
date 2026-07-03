import { StatefulComponent, StatelessComponent } from "@praxisjs/core";
import { Component, Emit, Prop, State } from "@praxisjs/decorators";

import type { CheckboxGroupItemProps, CheckboxGroupProps } from "./checkbox-group.types";

@Component()
export class CheckboxGroup extends StatefulComponent {
  @Prop() value?: string[];
  @Prop() defaultValue?: string[];
  @Prop() disabled = false;
  @Prop() required = false;
  @Prop() name?: string;
  @Prop() orientation: CheckboxGroupProps["orientation"] = "vertical";
  @Prop() onValueChange?: CheckboxGroupProps["onValueChange"];
  @Prop() class?: string;
  @Prop() id?: string;
  @Prop() children?: CheckboxGroupProps["children"];
  @Prop() "aria-label"?: string;
  @Prop() "aria-labelledby"?: string;
  @Prop() "aria-describedby"?: string;

  @State() _value: string[] = [];

  onBeforeMount() {
    this._value = this.defaultValue ?? [];
  }

  private get _resolvedValue(): string[] {
    return this.value ?? this._value;
  }

  isChecked(value: string): boolean {
    return this._resolvedValue.includes(value);
  }

  @Emit("onValueChange")
  toggle(value: string): string[] {
    const current = [...this._resolvedValue];
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
        aria-describedby={this["aria-describedby"]}
        aria-required={this.required ? ("true" as const) : undefined}
        aria-disabled={this.disabled ? ("true" as const) : undefined}
        aria-orientation={() => this.orientation}
        data-disabled={this.disabled ? "" : undefined}
        data-orientation={() => this.orientation}
      >
        {this.children}
      </div>
    );
  }
}

@Component()
export class CheckboxGroupItem extends StatelessComponent<CheckboxGroupItemProps> {
  render() {
    const { group, value, disabled, children, class: cls, id } = this.props;
    const isDisabled = disabled ?? group.disabled;

    return (
      <label
        id={id}
        class={cls}
        data-disabled={isDisabled ? "" : undefined}
        data-checked={() => (group.isChecked(value) ? "" : undefined)}
      >
        <input
          type="checkbox"
          name={group.name}
          value={value}
          checked={() => group.isChecked(value)}
          disabled={isDisabled}
          required={group.required}
          aria-label={this.props["aria-label"]}
          aria-labelledby={this.props["aria-labelledby"]}
          onChange={() => { group.toggle(value); }}
        />
        {children}
      </label>
    );
  }
}
