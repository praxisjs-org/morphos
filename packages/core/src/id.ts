let counter = 0;

/**
 * Generates a unique, stable ID suitable for ARIA attributes (aria-labelledby,
 * aria-describedby, aria-controls, etc.).
 *
 * IDs are scoped to the current session — they reset if the module is reloaded.
 */
export function generateId(prefix = "morphos"): string {
  return `${prefix}-${String(++counter)}`;
}
