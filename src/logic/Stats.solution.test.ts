import { describe, expect, it } from "vitest";
import { Stats } from "./Stats";
import { TodoItem } from "./TodoItem";

describe("解答例: Stats", () => {
  const stats = new Stats();

  it("completionRate: 空配列は 0", () => {
    expect(stats.completionRate([])).toBe(0);
  });

  it("completionRate: 2件中1件完了 → 0.5", () => {
    const items = [
      new TodoItem({ id: "1", title: "a", done: true }),
      new TodoItem({ id: "2", title: "b" }),
    ];
    expect(stats.completionRate(items)).toBe(0.5);
  });

  it("completionRate: 全件完了 → 1", () => {
    const items = [
      new TodoItem({ id: "1", title: "a", done: true }),
      new TodoItem({ id: "2", title: "b", done: true }),
    ];
    expect(stats.completionRate(items)).toBe(1);
  });

  it("remaining: 未完了件数を返す", () => {
    const items = [
      new TodoItem({ id: "1", title: "a", done: true }),
      new TodoItem({ id: "2", title: "b" }),
      new TodoItem({ id: "3", title: "c" }),
    ];
    expect(stats.remaining(items)).toBe(2);
  });

  it("overdueCount: 期限切れ件数を返す", () => {
    const now = new Date("2024-06-01");
    const items = [
      new TodoItem({ id: "1", title: "overdue", dueDate: new Date("2024-01-01") }),
      new TodoItem({ id: "2", title: "future", dueDate: new Date("2025-01-01") }),
      new TodoItem({ id: "3", title: "no-due" }),
    ];
    expect(stats.overdueCount(items, now)).toBe(1);
  });
});
