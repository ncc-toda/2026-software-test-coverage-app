import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/logic/**/*.test.ts"],
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      provider: "v8",
      all: true, // 未テストの logic クラスも 0% 行としてレポートに出す(塗り絵の対象を見せる)
      include: ["src/logic/**/*.ts"],
      exclude: ["src/logic/**/*.test.ts", "src/logic/types.ts"],
      reporter: ["text", "html"],
      reportsDirectory: "./coverage",
    },
  },
});
