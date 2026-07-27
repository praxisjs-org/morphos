const FILE_BASENAME_RE = /([^/]+)\.[^./]+$/;

/**
 * Normalizes an icons map so it works whether it's already keyed by nice names
 * (`{ Logo: "<path.../>" }`) or by the file paths Vite's `import.meta.glob`
 * uses as keys (`{ "./icons/brand/logo.svg": "<path.../>" }`) — a key
 * containing `/` is reduced to its basename, without extension; anything else
 * passes through as-is. `IconSource` runs `defaultIcons` through
 * this automatically, so it's rarely called directly — mainly useful if you're
 * building the glob-to-icons plumbing yourself instead of using
 * `@morphos/icons/vite`.
 */
export function iconsFromGlob(modules: Record<string, string>): Record<string, string> {
  const icons: Record<string, string> = {};
  for (const [key, svg] of Object.entries(modules)) {
    const name = key.includes("/") ? FILE_BASENAME_RE.exec(key)?.[1] : key;
    if (name) icons[name] = svg;
  }
  return icons;
}
