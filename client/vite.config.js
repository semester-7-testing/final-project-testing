import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [svelte()],
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "src"),
    },
  },
});
