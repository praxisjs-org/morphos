const FULL_SVG_RE = /^\s*<svg\b([^>]*)>([\s\S]*)<\/svg>\s*$/i;
const VIEW_BOX_ATTR_RE = /\bviewBox="([^"]*)"/i;
const FILL_ATTR_RE = /\bfill="([^"]*)"/i;
const STROKE_ATTR_RE = /\bstroke="([^"]*)"/i;

export interface ResolvedMarkup {
  markup: string;
  viewBox: string;
  /** `fill`/`stroke` read off the source's own outer `<svg>` tag, if it had one. */
  fill?: string;
  stroke?: string;
}

/**
 * Splits raw icon markup into inner content plus the presentation attributes it
 * should render with. `svg` may be a full `<svg>...</svg>` string — its `viewBox`,
 * `fill`, and `stroke` are read off the outer tag before it's discarded — or bare
 * inner markup, in which case `fallbackViewBox` is used as-is.
 */
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
