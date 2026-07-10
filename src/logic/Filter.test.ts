import { describe, expect, it } from "vitest";
import { Filter } from "./Filter";
import { TodoItem } from "./TodoItem";

function makeItems() {
  const a = new TodoItem({ id: "1", title: "active1" });
  const b = new TodoItem({ id: "2", title: "active2" });
  const c = new TodoItem({ id: "3", title: "done1", done: true });
  return [a, b, c];
}

// AAA パターン: 各テストを Arrange（準備）/ Act（実行）/ Assert（検証）の3段で書く。
describe("解答例: Filter", () => {
  const f = new Filter();

  it("all: 全件返す", () => {
    // Arrange
    const items = makeItems();
    // Act
    const result = f.apply(items, "all");
    // Assert
    expect(result).toHaveLength(3);
  });

  it("active: 未完了のみ返す", () => {
    // Arrange
    const items = makeItems();
    // Act
    const result = f.apply(items, "active");
    // Assert
    expect(result).toHaveLength(2);
    expect(result.every((i) => !i.done)).toBe(true);
  });

  it("completed: 完了のみ返す", () => {
    // Arrange
    const items = makeItems();
    // Act
    const result = f.apply(items, "completed");
    // Assert
    expect(result).toHaveLength(1);
    expect(result[0]!.done).toBe(true);
  });
});
