import { describe, expect, it } from "vitest";
import { TodoItem } from "./TodoItem";

// AAA パターン: 各テストを Arrange（準備）/ Act（実行）/ Assert（検証）の3段で書く。
describe("解答例: TodoItem", () => {
  it("既定値: done=false, priority=mid, dueDate=null", () => {
    // Arrange & Act: 既定値でインスタンスを生成（生成そのものが検証対象）
    const item = new TodoItem({ id: "1", title: "牛乳を買う" });
    // Assert
    expect(item.done).toBe(false);
    expect(item.priority).toBe("mid");
    expect(item.dueDate).toBeNull();
  });

  it("toggle で done が反転する", () => {
    // Arrange
    const item = new TodoItem({ id: "1", title: "x" });
    // Act
    item.toggle();
    // Assert
    expect(item.done).toBe(true);
    // Act（2回目）
    item.toggle();
    // Assert（2回目）
    expect(item.done).toBe(false);
  });

  it("isOverdue: 期限が過去なら true", () => {
    // Arrange
    const item = new TodoItem({ id: "1", title: "x", dueDate: new Date("2020-01-01") });
    // Act
    const overdue = item.isOverdue(new Date("2020-02-01"));
    // Assert
    expect(overdue).toBe(true);
  });

  it("isOverdue: 完了済みは常に false", () => {
    // Arrange
    const item = new TodoItem({ id: "1", title: "x", done: true, dueDate: new Date("2020-01-01") });
    // Act
    const overdue = item.isOverdue(new Date("2020-02-01"));
    // Assert
    expect(overdue).toBe(false);
  });

  it("isOverdue: 期限なしは false", () => {
    // Arrange
    const item = new TodoItem({ id: "1", title: "x" });
    // Act
    const overdue = item.isOverdue(new Date("2020-02-01"));
    // Assert
    expect(overdue).toBe(false);
  });

  it("priorityWeight: high=3, mid=2, low=1", () => {
    // Arrange
    const high = new TodoItem({ id: "1", title: "x", priority: "high" });
    const mid = new TodoItem({ id: "1", title: "x", priority: "mid" });
    const low = new TodoItem({ id: "1", title: "x", priority: "low" });
    // Act
    const weights = [high.priorityWeight(), mid.priorityWeight(), low.priorityWeight()];
    // Assert
    expect(weights).toEqual([3, 2, 1]);
  });
});
