import { describe, expect, it } from "vitest";
import { SortStrategy } from "./SortStrategy";
import { TodoItem } from "./TodoItem";

/**
 * ============================================================
 * 解答例の解説: SortStrategy（ステップ1: 純粋ロジック・依存なし）
 * ============================================================
 * テスト対象: sort(items, key, desc) — priority / created / due の3種の並び替え＋逆順フラグ
 *
 * ■ テスト観点の洗い出し
 *   - compare の switch: priority / created / due の3分岐（default は到達不能な防御分岐）
 *   - desc フラグ: false（既定）と true の両方
 *   - compareDue の null 処理が4分岐ある: 両方 null / a だけ null / b だけ null / 両方あり
 *     → 「期限なしは末尾」という仕様は if 文3つでできており、ここが Branch の稼ぎどころ
 *
 * ■ この解答例の見どころ
 *   - 並び替えのテストは「わざと順番をバラして渡し、結果の並びを丸ごと検証」が基本形。
 *     最初から整列済みのデータを渡すと、ソートが何もしなくても通ってしまう。
 */

// AAA パターン: 各テストを Arrange（準備）/ Act（実行）/ Assert（検証）の3段で書く。
describe("解答例: SortStrategy", () => {
  const s = new SortStrategy();

  // 【正常系】"priority" 分岐: low→high→mid の順で渡して high→mid→low に並ぶことを確認。
  // map で並び順全体を配列比較すると、先頭だけ見るより強い検証になる。
  it("priority: 降順（high→mid→low）", () => {
    // Arrange
    const items = [
      new TodoItem({ id: "1", title: "low", priority: "low" }),
      new TodoItem({ id: "2", title: "high", priority: "high" }),
      new TodoItem({ id: "3", title: "mid", priority: "mid" }),
    ];
    // Act
    const result = s.sort(items, "priority");
    // Assert
    expect(result.map((i) => i.priority)).toEqual(["high", "mid", "low"]);
  });

  // 【正常系】"created" 分岐: 新しい方を先に渡して、古い順に並び直ることを確認。
  it("created: 作成日時 昇順", () => {
    // Arrange
    const items = [
      new TodoItem({ id: "1", title: "second", createdAt: new Date("2024-01-02") }),
      new TodoItem({ id: "2", title: "first", createdAt: new Date("2024-01-01") }),
    ];
    // Act
    const result = s.sort(items, "created");
    // Assert
    expect(result[0]!.title).toBe("first");
    expect(result[1]!.title).toBe("second");
  });

  // 【正常系＋特殊値】"due" 分岐: 期限あり2件は昇順、期限なし(null)は末尾へ。
  // 期限なしを「先頭」に置いて渡すことで、null が本当に末尾へ移動することを確かめている。
  // これで compareDue の「a だけ null」「b だけ null」「両方あり」の分岐を通せる。
  it("due: 昇順（期限なしは末尾）", () => {
    // Arrange
    const items = [
      new TodoItem({ id: "1", title: "no-due" }),
      new TodoItem({ id: "2", title: "later", dueDate: new Date("2024-02-01") }),
      new TodoItem({ id: "3", title: "earlier", dueDate: new Date("2024-01-01") }),
    ];
    // Act
    const result = s.sort(items, "due");
    // Assert
    expect(result[0]!.title).toBe("earlier");
    expect(result[1]!.title).toBe("later");
    expect(result[2]!.title).toBe("no-due");
  });

  // 【正常系・フラグ】desc=true の分岐（三項演算子の reverse 側）を通すテスト。
  // 既定値引数（desc=false）は他のテストで通っているので、これで両側が揃う。
  it("desc=true で逆順になる", () => {
    // Arrange
    const items = [
      new TodoItem({ id: "1", title: "low", priority: "low" }),
      new TodoItem({ id: "2", title: "high", priority: "high" }),
    ];
    // Act
    const result = s.sort(items, "priority", true);
    // Assert
    expect(result[0]!.priority).toBe("low");
  });

  // 【特殊値・分岐の残り】compareDue の最初の分岐「両方 null → 0」を通すためのテスト。
  // カバレッジレポートで赤く残りがちな行。「引き分け(0)」は結果の並びに現れにくいため、
  // ここでは「エラーにならず2件とも返る」ことを最低限の検証としている。
  it("due: 両方 null のとき順序が変わらない（0 を返す）", () => {
    // Arrange
    const items = [
      new TodoItem({ id: "1", title: "a" }),
      new TodoItem({ id: "2", title: "b" }),
    ];
    // Act
    const result = s.sort(items, "due");
    // Assert: 両方 null → 相対順序維持（どちらも末尾方向で引き分け）
    expect(result).toHaveLength(2);
  });
});
