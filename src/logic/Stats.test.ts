import { describe, it } from "vitest";
import { Stats } from "./Stats";

describe("Stats", () => {
  // ここに it(...) を書いてカバレッジ％を上げよう（見本は TodoItem.test.ts）
  it.todo("空配列のとき completionRate は 0");
  it.todo("2件中1件完了のとき completionRate は 0.5");
  it.todo("remaining で未完了件数が返る");
  it.todo("overdueCount で期限切れ件数が返る");
});
