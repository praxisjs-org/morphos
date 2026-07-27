import type { StorybookConfig } from "@praxisjs/storybook";
import type { InlineConfig } from "vite";

import { iconsPlugin } from "@morphos/icons/vite";

const config = {
  stories: ["../stories/**/*.stories.@(ts|tsx)"],
  addons: [],
  framework: {
    name: "@praxisjs/storybook",
    options: {},
  },
  async viteFinal(viteConfig: InlineConfig) {
    // Prepended, not appended: this must run before the framework's own decorator-lowering
    // plugin, while `@RegisterIconProvider(...)` is still literal decorator syntax in the
    // source text — lowering strips the `@` first, and the regex below wouldn't match after.
    viteConfig.plugins = [iconsPlugin(), ...(viteConfig.plugins ?? [])];
    return viteConfig;
  },
} satisfies StorybookConfig & {
  viteFinal: (viteConfig: InlineConfig) => Promise<InlineConfig>;
};

export default config;
