import { defineConfig } from "cypress";

export const users = {
  adminUser: {
    email: "admin@test.sk",
    password: "admin123",
  },
  commonUser: {
    email: "test@test.sk",
    password: "admin123",
  },
};

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    defaultCommandTimeout: 6000,
    viewportWidth: 1600,
    viewportHeight: 800,
    experimentalStudio: true,
  },
});
