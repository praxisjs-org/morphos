import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import type { ButtonProps } from "./button.types";

@Component()
export class Button extends StatelessComponent<ButtonProps> {
  render() {
    const {
      as: Tag = "button",
      type,
      disabled,
      href,
      tabIndex,
      onClick,
      children,
      class: cls,
      id,
      "aria-label": ariaLabel,
      "aria-pressed": ariaPressed,
      "aria-expanded": ariaExpanded,
      "aria-controls": ariaControls,
      "aria-haspopup": ariaHaspopup,
    } = this.props;

    return (
      <Tag
        id={id}
        type={Tag === "button" ? (type ?? "button") : undefined}
        href={Tag === "a" ? href : undefined}
        disabled={Tag === "button" ? disabled : undefined}
        tabIndex={tabIndex}
        class={cls}
        onClick={onClick}
        aria-label={ariaLabel}
        aria-pressed={ariaPressed}
        aria-expanded={ariaExpanded}
        aria-controls={ariaControls}
        aria-haspopup={ariaHaspopup}
        aria-disabled={disabled && Tag !== "button" ? "true" : undefined}
        data-disabled={disabled ? "" : undefined}
      >
        {children}
      </Tag>
    );
  }
}
