import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { SVGAttributes } from "@praxisjs/jsx";

import type { IconNode, LucideIconProps } from "./lucide-icon.types";

function renderShape(node: IconNode[number], key: number) {
  const [tag, attrs] = node;
  const shapeProps = attrs as SVGAttributes;
  switch (tag) {
    case "path":
      return <path key={key} {...shapeProps} />;
    case "circle":
      return <circle key={key} {...shapeProps} />;
    case "rect":
      return <rect key={key} {...shapeProps} />;
    case "line":
      return <line key={key} {...shapeProps} />;
    case "polyline":
      return <polyline key={key} {...shapeProps} />;
    case "ellipse":
      return <ellipse key={key} {...shapeProps} />;
    default:
      return null;
  }
}

/**
 * Renders icon data from the `lucide` package's node-array format. Consumers
 * install `lucide` themselves and pass an icon through: `import { Plus } from
 * "lucide"` then `<LucideIcon icon={Plus} />`.
 */
@Component()
export class LucideIcon extends StatelessComponent<LucideIconProps> {
  render() {
    const {
      icon,
      size = 24,
      color,
      strokeWidth = 2,
      absoluteStrokeWidth = false,
      class: cls,
      id,
      "aria-label": ariaLabel,
    } = this.props;

    const resolvedStrokeWidth = absoluteStrokeWidth
      ? (Number(strokeWidth) * 24) / Number(size)
      : Number(strokeWidth);

    return (
      <svg
        id={id}
        class={cls}
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="none"
        stroke={color ?? "currentColor"}
        role={ariaLabel ? "img" : undefined}
        aria-label={ariaLabel}
        aria-hidden={ariaLabel ? undefined : ("true" as const)}
        ref={(el: SVGSVGElement | null) => {
          if (!el) return;
          el.setAttribute("stroke-width", String(resolvedStrokeWidth));
          el.setAttribute("stroke-linecap", "round");
          el.setAttribute("stroke-linejoin", "round");
        }}
      >
        {icon.map((node, index) => renderShape(node, index))}
      </svg>
    );
  }
}
