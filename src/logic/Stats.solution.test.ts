import { describe, expect, it } from "vitest";
import { Stats } from "./Stats";
import { TodoItem } from "./TodoItem";

/**
 * ============================================================
 * 解答例の解説: Stats（ステップ1: 純粋ロジック・依存なし）
 * ============================================================
 * テスト対象: completionRate（完了率）/ remaining（残件数）/ overdueCount（期限切れ数）
 *
 * ■ テスト観点の洗い出し
 *   - completionRate: 空配列（0除算ガード）/ 一部完了 / 全部完了
 *   - remaining: 完了と未完了が混在するデータで未完了だけ数える
 *   - overdueCount: 期限切れ・期限内・期限なしを混ぜて、期限切れだけ数える
 *
 * ■ この解答例の見どころ
 *   - 割り算があるコードでは「分母が 0 になる入力」（ここでは空配列）が最重要の境界値。
 *     ガードがなければ 0/0 = NaN が UI に漏れる。実装の early return を通すテストでもある。
 *   - 集計系は「数えたいもの・数えたくないもの」を1つのデータに混ぜると、
 *     フィルタ条件の間違いを1テストで検出できる。
 */

// AAA パターン: 各テストを Arrange（準備）/ Act（実行）/ Assert（検証）の3段で書く。
describe("解答例: Stats", () => {
  const stats = new Stats();

  // 【境界値】空配列は 0 件 ÷ 0 件になる危険な入力。実装は early return で 0 を返す仕様。
  // このガード分岐（items.length === 0）はこのテストでしか通らない。
  it("completionRate: 空配列は 0", () => {
    // Arrange
    const items: TodoItem[] = [];
    // Act
    const rate = stats.completionRate(items);
    // Assert
    expect(rate).toBe(0);
  });

  // 【正常系】完了1件＋未完了1件で 0.5。割合の計算式（完了数 ÷ 全体数）が正しいことの代表例。
  it("completionRate: 2件中1件完了 → 0.5", () => {
    // Arrange
    const items = [
      new TodoItem({ id: "1", title: "a", done: true }),
      new TodoItem({ id: "2", title: "b" }),
    ];
    // Act
    const rate = stats.completionRate(items);
    // Assert
    expect(rate).toBe(0.5);
  });

  // 【境界値】上端の 1（100%）。0（空）と 1（全完了）で値域の両端を押さえる。
  it("completionRate: 全件完了 → 1", () => {
    // Arrange
    const items = [
      new TodoItem({ id: "1", title: "a", done: true }),
      new TodoItem({ id: "2", title: "b", done: true }),
    ];
    // Act
    const rate = stats.completionRate(items);
    // Assert
    expect(rate).toBe(1);
  });

  // 【正常系】完了1件を混ぜた3件中、未完了の2件だけが数えられることを確認。
  // 全部未完了のデータだと「単に length を返す」誤実装でも通ってしまうので、混在させるのがコツ。
  it("remaining: 未完了件数を返す", () => {
    // Arrange
    const items = [
      new TodoItem({ id: "1", title: "a", done: true }),
      new TodoItem({ id: "2", title: "b" }),
      new TodoItem({ id: "3", title: "c" }),
    ];
    // Act
    const remaining = stats.remaining(items);
    // Assert
    expect(remaining).toBe(2);
  });

  // 【正常系＋特殊値】期限切れ・期限内・期限なしの3パターンを混ぜ、期限切れの1件だけ数える。
  // 内部で TodoItem.isOverdue を使っているので、その仕様（期限なしは false）もここで効いてくる。
  // now を引数で渡すため、テストは実行日に依存しない。
  it("overdueCount: 期限切れ件数を返す", () => {
    // Arrange
    const now = new Date("2024-06-01");
    const items = [
      new TodoItem({ id: "1", title: "overdue", dueDate: new Date("2024-01-01") }),
      new TodoItem({ id: "2", title: "future", dueDate: new Date("2025-01-01") }),
      new TodoItem({ id: "3", title: "no-due" }),
    ];
    // Act
    const count = stats.overdueCount(items, now);
    // Assert
    expect(count).toBe(1);
  });
});
