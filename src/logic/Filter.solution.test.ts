import { describe, expect, it } from "vitest";
import { Filter } from "./Filter";
import { TodoItem } from "./TodoItem";

/**
 * ============================================================
 * 解答例の解説: Filter（ステップ1: 純粋ロジック・依存なし）
 * ============================================================
 * テスト対象: apply(items, kind) — switch による all / active / completed の振り分け
 *
 * ■ テスト観点の洗い出し
 *   - switch の各分岐（all / active / completed）を1本ずつ通せば Branch がほぼ埋まる
 *   - default 分岐は union 型に守られた防御コードで、正しい TypeScript からは呼べない
 *     （ここが「Branch 100% を常に目指す必要はない」の実例）
 *
 * ■ この解答例の見どころ
 *   - テストデータ作成を makeItems() に共通化。「未完了2件＋完了1件」という
 *     偏りのあるデータにしておくと、active と completed で件数が変わり、
 *     フィルタの取り違え（active と completed の逆転バグ）を件数だけで検出できる。
 */

// 各テストで使う共通データ: 未完了2件（a, b）＋ 完了1件（c）。
// 毎回 new し直すことでテスト間の状態共有（前のテストの変更が漏れる事故）を防ぐ。
function makeItems() {
  const a = new TodoItem({ id: "1", title: "active1" });
  const b = new TodoItem({ id: "2", title: "active2" });
  const c = new TodoItem({ id: "3", title: "done1", done: true });
  return [a, b, c];
}

// AAA パターン: 各テストを Arrange（準備）/ Act（実行）/ Assert（検証）の3段で書く。
describe("解答例: Filter", () => {
  const f = new Filter();

  // 【正常系】"all" 分岐: 何も絞り込まず全件（3件）返る。
  it("all: 全件返す", () => {
    // Arrange
    const items = makeItems();
    // Act
    const result = f.apply(items, "all");
    // Assert
    expect(result).toHaveLength(3);
  });

  // 【正常系】"active" 分岐: 未完了の2件だけ。件数チェックに加えて
  // every() で「返ってきた全要素が未完了である」という性質まで確認している。
  it("active: 未完了のみ返す", () => {
    // Arrange
    const items = makeItems();
    // Act
    const result = f.apply(items, "active");
    // Assert
    expect(result).toHaveLength(2);
    expect(result.every((i) => !i.done)).toBe(true);
  });

  // 【正常系】"completed" 分岐: 完了の1件だけ。
  // active(2件) と completed(1件) で期待件数が違うため、分岐の取り違えがあれば必ず落ちる。
  it("completed: 完了のみ返す", () => {
    // Arrange
    const items = makeItems();
    // Act
    const result = f.apply(items, "completed");
    // Assert
    expect(result).toHaveLength(1);
    expect(result[0]!.done).toBe(true);
  });
});
