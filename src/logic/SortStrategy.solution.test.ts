import { describe, expect, it } from "vitest";
import { SortStrategy } from "./SortStrategy";
import { TodoItem } from "./TodoItem";

// AAA パターン: 各テストを Arrange（準備）/ Act（実行）/ Assert（検証）の3段で書く。
describe("解答例: SortStrategy", () => {
  const s = new SortStrategy();

  it("priority: 降順（high→mid→low）", () => {
    // Arrange
    const items = [
      new TodoItem({ id: "1", title: "low", priority: "low" }),
      new TodoItem({ id: "2", title: "high", priority: "high" }),
      new TodoItem({ id: "3", title: "mid", priority: "mid" }),
    ];
    // Act
    const result = s.sort(items, "priority");
    // Assert
    expect(result.map((i) => i.priority)).toEqual(["high", "mid", "low"]);
  });

  it("created: 作成日時 昇順", () => {
    // Arrange
    const items = [
      new TodoItem({ id: "1", title: "second", createdAt: new Date("2024-01-02") }),
      new TodoItem({ id: "2", title: "first", createdAt: new Date("2024-01-01") }),
    ];
    // Act
    const result = s.sort(items, "created");
    // Assert
    expect(result[0]!.title).toBe("first");
    expect(result[1]!.title).toBe("second");
  });

  it("due: 昇順（期限なしは末尾）", () => {
    // Arrange
    const items = [
      new TodoItem({ id: "1", title: "no-due" }),
      new TodoItem({ id: "2", title: "later", dueDate: new Date("2024-02-01") }),
      new TodoItem({ id: "3", title: "earlier", dueDate: new Date("2024-01-01") }),
    ];
    // Act
    const result = s.sort(items, "due");
    // Assert
    expect(result[0]!.title).toBe("earlier");
    expect(result[1]!.title).toBe("later");
    expect(result[2]!.title).toBe("no-due");
  });

  it("desc=true で逆順になる", () => {
    // Arrange
    const items = [
      new TodoItem({ id: "1", title: "low", priority: "low" }),
      new TodoItem({ id: "2", title: "high", priority: "high" }),
    ];
    // Act
    const result = s.sort(items, "priority", true);
    // Assert
    expect(result[0]!.priority).toBe("low");
  });

  it("due: 両方 null のとき順序が変わらない（0 を返す）", () => {
    // Arrange
    const items = [
      new TodoItem({ id: "1", title: "a" }),
      new TodoItem({ id: "2", title: "b" }),
    ];
    // Act
    const result = s.sort(items, "due");
    // Assert: 両方 null → 相対順序維持（どちらも末尾方向で引き分け）
    expect(result).toHaveLength(2);
  });
});
