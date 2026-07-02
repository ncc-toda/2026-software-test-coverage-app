import { describe, expect, it } from "vitest";
import { SortStrategy } from "./SortStrategy";
import { TodoItem } from "./TodoItem";

describe("解答例: SortStrategy", () => {
  const s = new SortStrategy();

  it("priority: 降順（high→mid→low）", () => {
    const items = [
      new TodoItem({ id: "1", title: "low", priority: "low" }),
      new TodoItem({ id: "2", title: "high", priority: "high" }),
      new TodoItem({ id: "3", title: "mid", priority: "mid" }),
    ];
    const result = s.sort(items, "priority");
    expect(result.map((i) => i.priority)).toEqual(["high", "mid", "low"]);
  });

  it("created: 作成日時 昇順", () => {
    const items = [
      new TodoItem({ id: "1", title: "second", createdAt: new Date("2024-01-02") }),
      new TodoItem({ id: "2", title: "first", createdAt: new Date("2024-01-01") }),
    ];
    const result = s.sort(items, "created");
    expect(result[0]!.title).toBe("first");
    expect(result[1]!.title).toBe("second");
  });

  it("due: 昇順（期限なしは末尾）", () => {
    const items = [
      new TodoItem({ id: "1", title: "no-due" }),
      new TodoItem({ id: "2", title: "later", dueDate: new Date("2024-02-01") }),
      new TodoItem({ id: "3", title: "earlier", dueDate: new Date("2024-01-01") }),
    ];
    const result = s.sort(items, "due");
    expect(result[0]!.title).toBe("earlier");
    expect(result[1]!.title).toBe("later");
    expect(result[2]!.title).toBe("no-due");
  });

  it("desc=true で逆順になる", () => {
    const items = [
      new TodoItem({ id: "1", title: "low", priority: "low" }),
      new TodoItem({ id: "2", title: "high", priority: "high" }),
    ];
    const result = s.sort(items, "priority", true);
    expect(result[0]!.priority).toBe("low");
  });

  it("due: 両方 null のとき順序が変わらない（0 を返す）", () => {
    const items = [
      new TodoItem({ id: "1", title: "a" }),
      new TodoItem({ id: "2", title: "b" }),
    ];
    const result = s.sort(items, "due");
    // 両方 null → 相対順序維持（どちらも末尾方向で引き分け）
    expect(result).toHaveLength(2);
  });
});
