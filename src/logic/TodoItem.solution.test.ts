import { describe, expect, it } from "vitest";
import { TodoItem } from "./TodoItem";

/**
 * ============================================================
 * 解答例の解説: TodoItem（ステップ1: 純粋ロジック・依存なし）
 * ============================================================
 * テスト対象: コンストラクタの既定値 / toggle / isOverdue / priorityWeight
 *
 * ■ テスト観点の洗い出し（本体を読んで分岐を数える）
 *   - コンストラクタ: props の省略時に ?? で既定値が入る（done/priority/dueDate/createdAt）
 *   - toggle: done が反転する（true→false / false→true の両方向）
 *   - isOverdue: ガード2つ（完了済み / 期限なし）＋ 日付比較の true/false
 *   - priorityWeight: switch の high/mid/low の3分岐
 *
 * ■ カバレッジのポイント
 *   - isOverdue が「now を引数で受け取る」設計なので、現在時刻をモックせずに
 *     固定の Date を渡すだけで決定的なテストが書ける（テスタビリティの良い設計例）。
 *   - priorityWeight の default 分岐は union 型に守られた防御コードで通常到達不能。
 *     Branch 100% にこだわらなくてよい実例（README「スコアの見方」参照）。
 */

// AAA パターン: 各テストを Arrange（準備）/ Act（実行）/ Assert（検証）の3段で書く。
describe("解答例: TodoItem", () => {
  // 【正常系・既定値】省略可能な props を全部省略し、?? の「右側」（既定値）が使われることを確認。
  // 逆に値を指定するテスト（下の priority 指定など）が ?? の「左側」を通す。両方あって分岐網羅になる。
  it("既定値: done=false, priority=mid, dueDate=null", () => {
    // Arrange & Act: 既定値でインスタンスを生成（生成そのものが検証対象）
    const item = new TodoItem({ id: "1", title: "牛乳を買う" });
    // Assert
    expect(item.done).toBe(false);
    expect(item.priority).toBe("mid");
    expect(item.dueDate).toBeNull();
  });

  // 【正常系】状態を変えるメソッドは「変わったこと」だけでなく「元に戻ること」（往復）まで確認すると、
  // 単なる done=true の代入ではなく本当に「反転」であることを保証できる。
  it("toggle で done が反転する", () => {
    // Arrange
    const item = new TodoItem({ id: "1", title: "x" });
    // Act
    item.toggle();
    // Assert
    expect(item.done).toBe(true);
    // Act（2回目）
    item.toggle();
    // Assert（2回目）
    expect(item.done).toBe(false);
  });

  // 【正常系】isOverdue の本命ケース: 期限(2020-01-01) < 現在(2020-02-01) なので期限切れ。
  // 現在時刻を引数で渡せるので new Date() のモックが不要 → テストが決定的になる。
  it("isOverdue: 期限が過去なら true", () => {
    // Arrange
    const item = new TodoItem({ id: "1", title: "x", dueDate: new Date("2020-01-01") });
    // Act
    const overdue = item.isOverdue(new Date("2020-02-01"));
    // Assert
    expect(overdue).toBe(true);
  });

  // 【特殊値・ガード分岐】期限が過去でも done=true なら false。
  // 「if (this.done) return false;」という早期リターン（1つ目のガード）を通すテスト。
  it("isOverdue: 完了済みは常に false", () => {
    // Arrange
    const item = new TodoItem({ id: "1", title: "x", done: true, dueDate: new Date("2020-01-01") });
    // Act
    const overdue = item.isOverdue(new Date("2020-02-01"));
    // Assert
    expect(overdue).toBe(false);
  });

  // 【特殊値・ガード分岐】dueDate=null（期限を設定していない TODO）は期限切れになりようがない。
  // 2つ目のガード「if (this.dueDate === null) return false;」を通すテスト。null の扱いは頻出の観点。
  it("isOverdue: 期限なしは false", () => {
    // Arrange
    const item = new TodoItem({ id: "1", title: "x" });
    // Act
    const overdue = item.isOverdue(new Date("2020-02-01"));
    // Assert
    expect(overdue).toBe(false);
  });

  // 【正常系・分岐網羅】switch の3分岐（high/mid/low）を1つのテストでまとめて通す。
  // default 分岐だけは union 型に守られていて到達不能なので、テストしない（できない）。
  it("priorityWeight: high=3, mid=2, low=1", () => {
    // Arrange
    const high = new TodoItem({ id: "1", title: "x", priority: "high" });
    const mid = new TodoItem({ id: "1", title: "x", priority: "mid" });
    const low = new TodoItem({ id: "1", title: "x", priority: "low" });
    // Act
    const weights = [high.priorityWeight(), mid.priorityWeight(), low.priorityWeight()];
    // Assert
    expect(weights).toEqual([3, 2, 1]);
  });
});
