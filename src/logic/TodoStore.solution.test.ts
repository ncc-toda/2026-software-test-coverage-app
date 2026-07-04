import { describe, expect, it } from "vitest";
import { TodoStore } from "./TodoStore";
import { TodoItem } from "./TodoItem";

// AAA パターン: 各テストを Arrange（準備）/ Act（実行）/ Assert（検証）の3段で書く。
describe("解答例: TodoStore", () => {
  it("add: size が増える", () => {
    // Arrange
    const store = new TodoStore();
    // Act
    store.add(new TodoItem({ id: "1", title: "x" }));
    // Assert
    expect(store.size).toBe(1);
  });

  it("add: 重複 id で throw", () => {
    // Arrange
    const store = new TodoStore();
    store.add(new TodoItem({ id: "1", title: "x" }));
    // Act & Assert: 例外を投げること自体が検証対象なので expect でラップする
    expect(() => store.add(new TodoItem({ id: "1", title: "y" }))).toThrow("duplicate id: 1");
  });

  it("remove: 存在する id で true を返す", () => {
    // Arrange
    const store = new TodoStore();
    store.add(new TodoItem({ id: "1", title: "x" }));
    // Act
    const removed = store.remove("1");
    // Assert
    expect(removed).toBe(true);
    expect(store.size).toBe(0);
  });

  it("remove: 存在しない id で false を返す", () => {
    // Arrange
    const store = new TodoStore();
    // Act
    const removed = store.remove("999");
    // Assert
    expect(removed).toBe(false);
  });

  it("toggle: done が反転する", () => {
    // Arrange
    const store = new TodoStore();
    store.add(new TodoItem({ id: "1", title: "x" }));
    // Act
    store.toggle("1");
    // Assert
    expect(store.get("1")!.done).toBe(true);
  });

  it("toggle: 未存在 id で throw", () => {
    // Arrange
    const store = new TodoStore();
    // Act & Assert: 例外を投げること自体が検証対象なので expect でラップする
    expect(() => store.toggle("999")).toThrow("not found: 999");
  });

  it("get: 存在すれば TodoItem を返す", () => {
    // Arrange
    const store = new TodoStore();
    const item = new TodoItem({ id: "1", title: "x" });
    store.add(item);
    // Act
    const found = store.get("1");
    // Assert
    expect(found).toBe(item);
  });

  it("all: 全件を配列で返す", () => {
    // Arrange
    const store = new TodoStore();
    store.add(new TodoItem({ id: "1", title: "a" }));
    store.add(new TodoItem({ id: "2", title: "b" }));
    // Act
    const all = store.all();
    // Assert
    expect(all).toHaveLength(2);
  });
});
