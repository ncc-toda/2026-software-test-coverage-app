import { describe, expect, it } from "vitest";
import { TodoItem } from "./TodoItem";

describe("解答例: TodoItem", () => {
  it("既定値: done=false, priority=mid, dueDate=null", () => {
    const item = new TodoItem({ id: "1", title: "牛乳を買う" });
    expect(item.done).toBe(false);
    expect(item.priority).toBe("mid");
    expect(item.dueDate).toBeNull();
  });

  it("toggle で done が反転する", () => {
    const item = new TodoItem({ id: "1", title: "x" });
    item.toggle();
    expect(item.done).toBe(true);
    item.toggle();
    expect(item.done).toBe(false);
  });

  it("isOverdue: 期限が過去なら true", () => {
    const item = new TodoItem({ id: "1", title: "x", dueDate: new Date("2020-01-01") });
    expect(item.isOverdue(new Date("2020-02-01"))).toBe(true);
  });

  it("isOverdue: 完了済みは常に false", () => {
    const item = new TodoItem({ id: "1", title: "x", done: true, dueDate: new Date("2020-01-01") });
    expect(item.isOverdue(new Date("2020-02-01"))).toBe(false);
  });

  it("isOverdue: 期限なしは false", () => {
    const item = new TodoItem({ id: "1", title: "x" });
    expect(item.isOverdue(new Date("2020-02-01"))).toBe(false);
  });

  it("priorityWeight: high=3, mid=2, low=1", () => {
    expect(new TodoItem({ id: "1", title: "x", priority: "high" }).priorityWeight()).toBe(3);
    expect(new TodoItem({ id: "1", title: "x", priority: "mid" }).priorityWeight()).toBe(2);
    expect(new TodoItem({ id: "1", title: "x", priority: "low" }).priorityWeight()).toBe(1);
  });
});
