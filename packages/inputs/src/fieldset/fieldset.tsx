import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import type { FieldsetProps } from "./fieldset.types";

@Component()
export class Fieldset extends StatelessComponent<FieldsetProps> {
  render() {
    const {
      disabled,
      legend,
      children,
      class: cls,
      id,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      "aria-describedby": ariaDescribedby,
    } = this.props;

    return (
      <fieldset
        id={id}
        class={cls}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        data-disabled={disabled ? "" : undefined}
      >
        {legend && <legend>{legend}</legend>}
        {children}
      </fieldset>
    );
  }
}
