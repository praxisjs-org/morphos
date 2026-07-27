import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { CSSProperties } from "@praxisjs/jsx";

import { Icon } from "../icon/icon";

import type { PhosphorIconProps } from "./phosphor-icon.types";

/**
 * Renders a raw SVG asset from `@phosphor-icons/core`, e.g.:
 * `import plusRegular from "@phosphor-icons/core/assets/regular/plus.svg?raw"`
 * then `<PhosphorIcon svg={plusRegular} />`. Pick the weight (`regular`,
 * `bold`, `duotone`, ...) by choosing which asset file to import.
 */
@Component()
export class PhosphorIcon extends StatelessComponent<PhosphorIconProps> {
  render() {
    const { svg, size, color, mirrored = false, style, class: cls, id, "aria-label": ariaLabel } = this.props;

    const mergedStyle: string | CSSProperties | undefined = mirrored
      ? { ...(typeof style === "object" ? style : undefined), transform: "scaleX(-1)" }
      : style;

    return (
      <Icon
        id={id}
        class={cls}
        svg={svg}
        size={size}
        color={color}
        style={mergedStyle}
        aria-label={ariaLabel}
      />
    );
  }
}
