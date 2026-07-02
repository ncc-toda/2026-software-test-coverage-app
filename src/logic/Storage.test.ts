import { describe, it, vi } from "vitest";
import { Storage, type Persistence } from "./Storage";

// ヒント: vi.spyOn(p, "save") や vi.spyOn(p, "load").mockReturnValue(...) で
//        Persistence を差し替えてテストしよう（見本は TodoItem.test.ts と Storage.solution.test.ts）

describe("Storage", () => {
  // ここに it(...) を書いてカバレッジ％を上げよう
  it.todo("save すると persistence.save が1回呼ばれる");
  it.todo("load で null が返ると空の store になる");
  it.todo("load で JSON が返ると TodoItem が復元される");
});
