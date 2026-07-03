import { resolve } from "path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@morphos/core": resolve(__dirname, "packages/core/src/index.ts"),
      "@morphos/inputs": resolve(__dirname, "packages/inputs/src/index.ts"),
      "@morphos/overlays": resolve(__dirname, "packages/overlays/src/index.ts"),
      "@morphos/layout": resolve(__dirname, "packages/layout/src/index.ts"),
      "@morphos/feedback": resolve(__dirname, "packages/feedback/src/index.ts"),
    },
  },
  test: {
    environment: "node",
    include: ["packages/**/src/__tests__/**/*.test.{ts,tsx}"],
    // Process @praxisjs/* through Vite's server — their dist uses extensionless imports
    // (moduleResolution: bundler) which Node.js ESM rejects at runtime.
    server: {
      deps: {
        inline: [/@praxisjs\/.*/],
      },
    },
    coverage: {
      provider: "v8",
      include: ["packages/**/src/**/*.{ts,tsx}"],
      exclude: ["packages/**/src/__tests__/**", "packages/**/src/index.ts"],
    },
  },
});
