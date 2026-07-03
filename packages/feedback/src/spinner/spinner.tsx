import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import type { SpinnerProps } from "./spinner.types";

@Component()
export class Spinner extends StatelessComponent<SpinnerProps> {
  render() {
    const { class: cls, id, "aria-label": ariaLabel = "Loading" } = this.props;
    return (
      <span
        id={id}
        role="status"
        class={cls}
        aria-label={ariaLabel}
        aria-live={"polite" as const}
        aria-busy={"true" as const}
      />
    );
  }
}
