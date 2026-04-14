import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { dynamicManifestPlugin } from "./vite-plugins/dynamicManifest";
import { getAppManifest } from "./pwa/manifest";

export default defineConfig(({ mode }) => {
  const BASE = mode === "gh-pages" ? "/explorer/" : "/";

  return {
    worker: {
      format: "es",
    },
    plugins: [
      tailwindcss(),
      dynamicManifestPlugin(getAppManifest(BASE), "manifest.json"),
    ],

    server: { port: 3000 },
    build: {
      outDir: "dist",
      emptyOutDir: true,
      rollupOptions: {
        input: {
          main: "./index.html",
          sw: "./pwa/service-worker.ts",
        },
        output: {
          entryFileNames(chunkInfo) {
            if (chunkInfo.name === "sw") return "sw.js";
            return "[hash].js";
          },
        },
      },
    },
    base: BASE,
    resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
    define: { __BUILD_TIMESTAMP__: `"${new Date().toISOString()}"` },
    optimizeDeps: {
      exclude: ["taglib-wasm"],
    },
  };
});
