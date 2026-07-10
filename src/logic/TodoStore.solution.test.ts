import { describe, expect, it } from "vitest";
import { TodoStore } from "./TodoStore";
import { TodoItem } from "./TodoItem";

/**
 * ============================================================
 * 解答例の解説: TodoStore（ステップ1: 純粋ロジック・依存なし）
 * ============================================================
 * テスト対象: add / remove / toggle / get / all / size — Map を包んだ CRUD ストア
 *
 * ■ テスト観点の洗い出し
 *   - add: 正常追加 / 重複 id（例外を投げる異常系）
 *   - remove: 存在する id（true）/ 存在しない id（false）— 戻り値の両パターン
 *   - toggle: 正常反転 / 未存在 id（例外）
 *   - get・all: 取得系の正常系
 *
 * ■ この解答例の見どころ
 *   - 例外のテストは expect(() => ...).toThrow(...) と「関数で包む」のがポイント。
 *     包まずに直接呼ぶと、expect に届く前に例外でテスト自体が落ちてしまう。
 *   - 各テストで store を新しく作る（describe の外で共有しない）。
 *     テスト間で状態を共有すると、実行順に依存する壊れやすいテストになる。
 */

// AAA パターン: 各テストを Arrange（準備）/ Act（実行）/ Assert（検証）の3段で書く。
describe("解答例: TodoStore", () => {
  // 【正常系】追加の基本。size が 0→1 に増えることで追加を観測する。
  it("add: size が増える", () => {
    // Arrange
    const store = new TodoStore();
    // Act
    store.add(new TodoItem({ id: "1", title: "x" }));
    // Assert
    expect(store.size).toBe(1);
  });

  // 【異常系】同じ id を2回 add すると例外。メッセージまで toThrow で照合し、
  // 「別の理由の例外でもテストが通ってしまう」ことを防いでいる。
  it("add: 重複 id で throw", () => {
    // Arrange
    const store = new TodoStore();
    store.add(new TodoItem({ id: "1", title: "x" }));
    // Act & Assert: 例外を投げること自体が検証対象なので expect でラップする
    expect(() => store.add(new TodoItem({ id: "1", title: "y" }))).toThrow("duplicate id: 1");
  });

  // 【正常系】remove は boolean を返す設計。true が返ることと、実際に消えたこと（size=0）の両方を確認。
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

  // 【異常系（例外ではなく戻り値で表現）】未存在 id は false。
  // 同じ「見つからない」でも remove は false、toggle は例外——と設計が違う点は解説ポイント。
  it("remove: 存在しない id で false を返す", () => {
    // Arrange
    const store = new TodoStore();
    // Act
    const removed = store.remove("999");
    // Assert
    expect(removed).toBe(false);
  });

  // 【正常系】toggle が中の TodoItem まで届いていることを get 経由で確認する。
  it("toggle: done が反転する", () => {
    // Arrange
    const store = new TodoStore();
    store.add(new TodoItem({ id: "1", title: "x" }));
    // Act
    store.toggle("1");
    // Assert
    expect(store.get("1")!.done).toBe(true);
  });

  // 【異常系】未存在 id の toggle は例外。実装の「if (item === undefined) throw」分岐を通す。
  it("toggle: 未存在 id で throw", () => {
    // Arrange
    const store = new TodoStore();
    // Act & Assert: 例外を投げること自体が検証対象なので expect でラップする
    expect(() => store.toggle("999")).toThrow("not found: 999");
  });

  // 【正常系】get は add したのと「同一のインスタンス」を返す。
  // toEqual（値の一致）ではなく toBe（参照の一致）を使っている点に注目。
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

  // 【正常系】all は Map の中身を配列にして返す。件数で全件返っていることを確認。
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
