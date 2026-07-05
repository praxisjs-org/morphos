import { jsx } from "@praxisjs/jsx/jsx-runtime";
import type { Preview } from "storybook/internal/types";

import "@morphos/styles/index.css";
import "./docs-theme.css";

export { renderToCanvas } from "@praxisjs/storybook";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /date$/i,
      },
    },
    layout: "centered",
  },

  initialGlobals: {
    style: "default",
  },

  globalTypes: {
    style: {
      name: "Style",
      description: "@morphos/styles' own tokens ('default') vs. the docs site's theme ('morphos')",
      toolbar: {
        icon: "paintbrush",
        items: [
          { value: "default", title: "Default" },
          { value: "morphos", title: "Morphos" },
        ],
        dynamicTitle: true,
      },
    },
  },

  // Retheme the @morphos/styles design tokens (see docs-theme.css) when the
  // "morphos" style option is selected, without every story having to apply
  // the class itself. Toggled on <body> (rather than a wrapper element) so
  // the docs-like page background paints behind the story too.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  decorators: [
    (Story: () => Node, context: any) => {
      document.body.classList.toggle("morphos-theme-docs", context.globals.style === "morphos");
      return Story();
    },
  ],

  // Default render: component from meta + args from controls
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render(args: Record<string, unknown>, context: any) {
    const Cmp = context.component as new (...a: unknown[]) => unknown;
    if (!Cmp) return null;
    return jsx(Cmp, args) as unknown as Node;
  },
};

export default preview;
