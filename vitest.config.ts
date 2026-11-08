import { resolve } from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom",
    globals: true,
    include: ["src/**/*.test.{ts,tsx}"],
    server: {
      deps: {
        inline: [/solid-js/],
      },
    },
  },
  resolve: {
    conditions: ["browser", "development"],
    alias: {
      "~": resolve(import.meta.dirname, "./src"),
    },
  },
});
