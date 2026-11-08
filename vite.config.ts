import { solidStart } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    hmr: {
      overlay: false,
    },
  },
  optimizeDeps: {
    include: ["@solidjs/start > source-map-js"],
  },
  plugins: [solidStart({ ssr: false, middleware: "./src/middleware.ts" }), nitro(), tailwindcss()],
});
