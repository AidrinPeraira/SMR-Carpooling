import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true, //no need to import in everyfile,
    globalSetup: "./tests/integration/global.setup.ts",
    environment: "node",
    include: ["tests/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
    exclude: ["**/node_modules/**", "**/.git/**"],
  },
});
