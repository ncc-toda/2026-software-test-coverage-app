import { describe, it } from "vitest";
import { TodoStore } from "./TodoStore";

describe("TodoStore", () => {
  // ここに it(...) を書いてカバレッジ％を上げよう（見本は TodoItem.test.ts）
  it.todo("add で size が増える");
  it.todo("重複 id を add すると throw される");
  it.todo("remove で該当アイテムが消える");
  it.todo("toggle で done が反転する");
  it.todo("存在しない id を toggle すると throw される");
});
