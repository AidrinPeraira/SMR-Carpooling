import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true, //no need to import in everyfile,
    environment: "node",
  },
});
