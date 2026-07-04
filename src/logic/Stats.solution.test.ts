import { describe, expect, it } from "vitest";
import { Stats } from "./Stats";
import { TodoItem } from "./TodoItem";

// AAA パターン: 各テストを Arrange（準備）/ Act（実行）/ Assert（検証）の3段で書く。
describe("解答例: Stats", () => {
  const stats = new Stats();

  it("completionRate: 空配列は 0", () => {
    // Arrange
    const items: TodoItem[] = [];
    // Act
    const rate = stats.completionRate(items);
    // Assert
    expect(rate).toBe(0);
  });

  it("completionRate: 2件中1件完了 → 0.5", () => {
    // Arrange
    const items = [
      new TodoItem({ id: "1", title: "a", done: true }),
      new TodoItem({ id: "2", title: "b" }),
    ];
    // Act
    const rate = stats.completionRate(items);
    // Assert
    expect(rate).toBe(0.5);
  });

  it("completionRate: 全件完了 → 1", () => {
    // Arrange
    const items = [
      new TodoItem({ id: "1", title: "a", done: true }),
      new TodoItem({ id: "2", title: "b", done: true }),
    ];
    // Act
    const rate = stats.completionRate(items);
    // Assert
    expect(rate).toBe(1);
  });

  it("remaining: 未完了件数を返す", () => {
    // Arrange
    const items = [
      new TodoItem({ id: "1", title: "a", done: true }),
      new TodoItem({ id: "2", title: "b" }),
      new TodoItem({ id: "3", title: "c" }),
    ];
    // Act
    const remaining = stats.remaining(items);
    // Assert
    expect(remaining).toBe(2);
  });

  it("overdueCount: 期限切れ件数を返す", () => {
    // Arrange
    const now = new Date("2024-06-01");
    const items = [
      new TodoItem({ id: "1", title: "overdue", dueDate: new Date("2024-01-01") }),
      new TodoItem({ id: "2", title: "future", dueDate: new Date("2025-01-01") }),
      new TodoItem({ id: "3", title: "no-due" }),
    ];
    // Act
    const count = stats.overdueCount(items, now);
    // Assert
    expect(count).toBe(1);
  });
});
