import { describe, expect, it } from "vitest";
import { TodoItem } from "./TodoItem";

// ─────────────────────────────────────────────
// カバレッジ道場: このファイルだけ AAA の「見本」が入っています。
// 見本を真似て、他のテスト項目や他クラスのテストを自分で書いて
// カバレッジ％(赤い行/分岐)を緑に塗っていきましょう。
// ─────────────────────────────────────────────

describe("TodoItem", () => {
  it("見本1: 既定では未完了(done=false)", () => {
    // Arrange
    const item = new TodoItem({ id: "1", title: "牛乳を買う" });

    // Act
    const done = item.done;

    // Assert
    expect(done).toBe(false);
  });

  it("見本2: toggle すると done が反転する", () => {
    // Arrange
    const item = new TodoItem({ id: "1", title: "x" });

    // Act
    item.toggle();

    // Assert
    expect(item.done).toBe(true);
  });

  // TODO: isOverdue(期限が過去 / 完了済み / 期限なし)を検証しよう
  // TODO: priorityWeight(high/mid/low)を検証しよう
});
