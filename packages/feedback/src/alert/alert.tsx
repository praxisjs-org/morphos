import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import type { AlertProps } from "./alert.types";

@Component()
export class Alert extends StatelessComponent<AlertProps> {
  render() {
    const {
      variant = "info",
      live = variant === "error" ? "assertive" : "polite",
      title,
      children,
      class: cls,
      id,
    } = this.props;

    return (
      <div
        id={id}
        role="alert"
        aria-live={live}
        aria-atomic={"true" as const}
        class={cls}
        data-variant={variant}
      >
        {title && <strong>{title}</strong>}
        {children}
      </div>
    );
  }
}
