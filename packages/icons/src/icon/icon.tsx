import { StatelessComponent } from "@praxisjs/core";
import { Component } from "@praxisjs/decorators";

import type { IconProps } from "./icon.types";

const FULL_SVG_RE = /^\s*<svg\b([^>]*)>([\s\S]*)<\/svg>\s*$/i;
const VIEW_BOX_ATTR_RE = /\bviewBox="([^"]*)"/i;
const FILL_ATTR_RE = /\bfill="([^"]*)"/i;
const STROKE_ATTR_RE = /\bstroke="([^"]*)"/i;

interface ResolvedMarkup {
  markup: string;
  viewBox: string;
  /** `fill`/`stroke` read off the source's own outer `<svg>` tag, e.g. Phosphor's `fill="currentColor"` — preserved so removing that tag doesn't silently drop it. */
  fill?: string;
  stroke?: string;
}

/** Splits a `svg` prop into inner markup and the presentation attributes it should render with. */
export function resolveMarkup(svg: string, fallbackViewBox: string): ResolvedMarkup {
  const match = FULL_SVG_RE.exec(svg);
  if (!match) {
    return { markup: svg, viewBox: fallbackViewBox };
  }
  const [, openingTag, inner] = match;
  const viewBoxMatch = VIEW_BOX_ATTR_RE.exec(openingTag);
  const fillMatch = FILL_ATTR_RE.exec(openingTag);
  const strokeMatch = STROKE_ATTR_RE.exec(openingTag);
  return {
    markup: inner,
    viewBox: viewBoxMatch?.[1] ?? fallbackViewBox,
    fill: fillMatch?.[1],
    stroke: strokeMatch?.[1],
  };
}

/**
 * Generic, framework-agnostic SVG icon primitive. Renders any raw markup —
 * a full `<svg>` string or bare inner markup — sized and colored via props.
 * `LucideIcon` and `PhosphorIcon` are thin adapters for those libraries'
 * data shapes; `Icon` is the escape hatch for anything else.
 */
@Component()
export class Icon extends StatelessComponent<IconProps> {
  render() {
    const {
      svg,
      viewBox = "0 0 24 24",
      size = 24,
      color,
      style,
      class: cls,
      id,
      "aria-label": ariaLabel,
    } = this.props;

    const { markup, viewBox: resolvedViewBox, fill, stroke } = resolveMarkup(svg, viewBox);

    return (
      <svg
        id={id}
        class={cls}
        viewBox={resolvedViewBox}
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
