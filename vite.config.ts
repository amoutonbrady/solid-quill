import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { resolve } from "path";

export default defineConfig({
  plugins: [solid()],
  build: {
    lib: {
      entry: resolve(__dirname, "src/solid-quill.tsx"),
      formats: ["es", "cjs"],
      name: "SolidQuill",
    },
    rollupOptions: {
      external: ["solid-js", "solid-js/web", "quill"],
    },
  },
});
