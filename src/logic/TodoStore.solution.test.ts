import { describe, expect, it } from "vitest";
import { TodoStore } from "./TodoStore";
import { TodoItem } from "./TodoItem";

describe("解答例: TodoStore", () => {
  it("add: size が増える", () => {
    const store = new TodoStore();
    store.add(new TodoItem({ id: "1", title: "x" }));
    expect(store.size).toBe(1);
  });

  it("add: 重複 id で throw", () => {
    const store = new TodoStore();
    store.add(new TodoItem({ id: "1", title: "x" }));
    expect(() => store.add(new TodoItem({ id: "1", title: "y" }))).toThrow("duplicate id: 1");
  });

  it("remove: 存在する id で true を返す", () => {
    const store = new TodoStore();
    store.add(new TodoItem({ id: "1", title: "x" }));
    expect(store.remove("1")).toBe(true);
    expect(store.size).toBe(0);
  });

  it("remove: 存在しない id で false を返す", () => {
    const store = new TodoStore();
    expect(store.remove("999")).toBe(false);
  });

  it("toggle: done が反転する", () => {
    const store = new TodoStore();
    store.add(new TodoItem({ id: "1", title: "x" }));
    store.toggle("1");
    expect(store.get("1")!.done).toBe(true);
  });

  it("toggle: 未存在 id で throw", () => {
    const store = new TodoStore();
    expect(() => store.toggle("999")).toThrow("not found: 999");
  });

  it("get: 存在すれば TodoItem を返す", () => {
    const store = new TodoStore();
    const item = new TodoItem({ id: "1", title: "x" });
    store.add(item);
    expect(store.get("1")).toBe(item);
  });

  it("all: 全件を配列で返す", () => {
    const store = new TodoStore();
    store.add(new TodoItem({ id: "1", title: "a" }));
    store.add(new TodoItem({ id: "2", title: "b" }));
    expect(store.all()).toHaveLength(2);
  });
});
