import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";
import type { SVGAttributes } from "@praxisjs/jsx";

import { resolveMarkup } from "./resolve-markup";
import { getIconProvider } from "../provider/provider-store";
import { getIconResolver, type IconNode } from "../provider/registry";

import type { IconProps } from "./icon.types";

function renderIconNodeShape(node: IconNode[number], key: number) {
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
 * Renders an icon by name. The configured provider (set app-wide via `@IconProvider`,
 * or overridden per instance with the `provider` prop) decides which icon set
 * `name` resolves against. `@IconProvider` is mandatory — applied somewhere in every
 * app, no exceptions — including for the built-in `"lucide"` set (`LucideSource`,
 * just a pre-configured `IconSource`). There is no implicit default provider.
 */
@Component()
export class Icon extends StatelessComponent<IconProps> {
  render() {
    const {
      name,
      provider = getIconProvider(),
      size = 24,
      color,
      strokeWidth = 2,
      absoluteStrokeWidth = false,
      style,
      class: cls,
      id,
      "aria-label": ariaLabel,
    } = this.props;

    if (provider === undefined) {
      console.warn(
        `[@morphos/icons] No icon provider is configured. Apply @IconProvider(...) to your root ` +
          `component (LucideSource for the built-in "lucide" set, or a custom @RegisterIconProvider ` +
          `class) before rendering any <Icon> — it's mandatory, there's no default provider.`,
      );
      return null;
    }

    const resolver = getIconResolver(provider);
    if (resolver === undefined) {
      console.warn(
        `[@morphos/icons] No provider registered as "${provider}". Apply @IconProvider(...) to your ` +
          `root component (LucideSource for the built-in "lucide" set), or register a custom one ` +
          `with @RegisterIconProvider.`,
      );
      return null;
    }
    const data = resolver(name);
    if (data === undefined) {
      console.warn(`[@morphos/icons] No icon named "${name}" for provider "${provider}".`);
      return null;
    }

    if ("nodes" in data) {
      const resolvedStrokeWidth = absoluteStrokeWidth
        ? (Number(strokeWidth) * 24) / Number(size)
        : Number(strokeWidth);

      return (
        <svg
          id={id}
          class={cls}
          viewBox={data.viewBox ?? "0 0 24 24"}
          width={size}
          height={size}
          fill="none"
          stroke={color ?? "currentColor"}
          style={style}
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
          {data.nodes.map((n, index) => renderIconNodeShape(n, index))}
        </svg>
      );
    }

    const { markup, viewBox, fill, stroke } = resolveMarkup(data.svg, data.viewBox ?? "0 0 24 24");

    return (
      <svg
        id={id}
        class={cls}
        viewBox={viewBox}
        width={size}
        height={size}
        color={color}
        fill={fill}
        stroke={stroke}
        style={style}
        role={ariaLabel ? "img" : undefined}
        aria-label={ariaLabel}
        aria-hidden={ariaLabel ? undefined : ("true" as const)}
        ref={(el: SVGSVGElement | null) => {
          if (el) el.innerHTML = markup;
        }}
      />
    );
  }
}
