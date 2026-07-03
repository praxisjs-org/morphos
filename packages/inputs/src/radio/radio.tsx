import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import type { RadioProps } from "./radio.types";

@Component()
export class Radio extends StatelessComponent<RadioProps> {
  render() {
    const { value, group, disabled, children, class: cls, id } = this.props;
    const isDisabled = disabled ?? group.disabled;

    return (
      <label
        id={id}
        class={cls}
        data-disabled={isDisabled ? "" : undefined}
        data-checked={() => (group.selectedValue === value ? "" : undefined)}
      >
        <input
          type="radio"
          name={group.name}
          value={value}
          checked={() => group.selectedValue === value}
          disabled={isDisabled}
          aria-label={this.props["aria-label"]}
          aria-labelledby={this.props["aria-labelledby"]}
          onChange={() => { group.select(value); }}
        />
        {children}
      </label>
    );
  }
}
