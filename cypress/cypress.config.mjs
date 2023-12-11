import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    defaultCommandTimeout: 6000,
    viewportWidth: 1600,
    viewportHeight: 800,
    experimentalStudio: true,
  },
});
