import { describe, expect, it } from "vitest";
import { Filter } from "./Filter";
import { TodoItem } from "./TodoItem";

function makeItems() {
  const a = new TodoItem({ id: "1", title: "active1" });
  const b = new TodoItem({ id: "2", title: "active2" });
  const c = new TodoItem({ id: "3", title: "done1", done: true });
  return [a, b, c];
}

describe("解答例: Filter", () => {
  const f = new Filter();

  it("all: 全件返す", () => {
    const items = makeItems();
    expect(f.apply(items, "all")).toHaveLength(3);
  });

  it("active: 未完了のみ返す", () => {
    const items = makeItems();
    const result = f.apply(items, "active");
    expect(result).toHaveLength(2);
    expect(result.every((i) => !i.done)).toBe(true);
  });

  it("completed: 完了のみ返す", () => {
    const items = makeItems();
    const result = f.apply(items, "completed");
    expect(result).toHaveLength(1);
    expect(result[0]!.done).toBe(true);
  });
});
