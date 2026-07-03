import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import type { FormProps } from "./form.types";

@Component()
export class Form extends StatelessComponent<FormProps> {
  render() {
    const {
      action,
      method,
      noValidate,
      onSubmit,
      onReset,
      children,
      class: cls,
      id,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      "aria-describedby": ariaDescribedby,
    } = this.props;

    return (
      <form
        id={id}
        class={cls}
        action={action}
        method={method}
        noValidate={noValidate}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        onSubmit={onSubmit}
        onReset={onReset}
      >
        {children}
      </form>
    );
  }
}
