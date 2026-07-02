import { describe, it } from "vitest";
import { Validator } from "./Validator";

describe("Validator", () => {
  // ここに it(...) を書いてカバレッジ％を上げよう（見本は TodoItem.test.ts）
  it.todo("空タイトルは NG になる");
  it.todo("101文字のタイトルは NG になる");
  it.todo("期限が null のときは OK になる");
  it.todo("期限が過去のときは NG になる");
});
