import { describe, expect, it } from "vitest";
import { Validator } from "./Validator";

/**
 * ============================================================
 * 解答例の解説: Validator（ステップ1: 純粋ロジック・依存なし）
 * ============================================================
 * テスト対象: validateTitle（必須チェック＋長さ上限）/ validateDueDate（過去日チェック）
 *
 * ■ テスト観点の洗い出し
 *   - validateTitle: 空文字 / 空白のみ（trim の効果）/ 通常 / 上限ちょうど / 上限超え
 *   - validateDueDate: null / 過去 / 未来
 *
 * ■ この解答例の見どころ
 *   - 境界値テストの基本形: 上限 MAX_TITLE=100 に対して「100文字(OK)」と「101文字(NG)」を
 *     ペアで書く。片方だけだと「<= と < の書き間違い」のようなバグを見逃す。
 *   - trim される仕様なので「空白だけの文字列」は見た目に反して"空"扱い。
 *     仕様（実装）を読んで初めて気づける観点で、正常系だけ書いていると漏れる。
 */

// AAA パターン: 各テストを Arrange（準備）/ Act（実行）/ Assert（検証）の3段で書く。
describe("解答例: Validator", () => {
  const v = new Validator();

  // 【異常系】もっとも基本的な NG 入力。ok が false になるだけでなく、
  // 「どのエラーメッセージが入るか」まで toContain で確認する。
  it("validateTitle: 空文字は NG", () => {
    // Arrange
    const title = "";
    // Act
    const result = v.validateTitle(title);
    // Assert
    expect(result.ok).toBe(false);
    expect(result.errors).toContain("タイトルは必須です");
  });

  // 【異常系・特殊値】空白のみは length > 0 だが trim() で空になる。
  // 実装が trim している事実を知らないと思いつけないケース。仕様理解の深さが問われる。
  it("validateTitle: 空白のみも NG", () => {
    // Arrange
    const title = "   ";
    // Act
    const result = v.validateTitle(title);
    // Assert
    expect(result.ok).toBe(false);
    expect(result.errors).toContain("タイトルは必須です");
  });

  // 【正常系】普通の入力が通ることの確認。異常系ばかり書いて正常系を忘れるのもよくある漏れ。
  // errors が「空配列である」ことまで確認している点に注目（ok=true だけでは片手落ち）。
  it("validateTitle: 通常のタイトルは OK", () => {
    // Arrange
    const title = "牛乳を買う";
    // Act
    const result = v.validateTitle(title);
    // Assert
    expect(result.ok).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  // 【境界値・上限超え】MAX_TITLE=100 の「1つ外側」。境界のすぐ外を狙うのが境界値分析の定石。
  it("validateTitle: 101文字は NG", () => {
    // Arrange
    const title = "a".repeat(101);
    // Act
    const result = v.validateTitle(title);
    // Assert
    expect(result.ok).toBe(false);
    expect(result.errors).toContain("タイトルが長すぎます");
  });

  // 【境界値・上限ちょうど】境界の「内側の端」。101文字のテストとペアで書くことで、
  // 実装が > なのか >= なのか（off-by-one）を確定させられる。
  it("validateTitle: 100文字はぴったり OK", () => {
    // Arrange
    const title = "a".repeat(100);
    // Act
    const result = v.validateTitle(title);
    // Assert
    expect(result.ok).toBe(true);
  });

  // 【特殊値】期限なし(null)は「検証対象がない」ので OK。null を渡せる引数はまず null を試す。
  it("validateDueDate: null は OK", () => {
    // Arrange
    const now = new Date("2024-01-01");
    // Act
    const result = v.validateDueDate(null, now);
    // Assert
    expect(result.ok).toBe(true);
  });

  // 【異常系】過去日は NG。now を引数で渡す設計なので、実行日時に関係なく毎回同じ結果になる。
  it("validateDueDate: 過去の日付は NG", () => {
    // Arrange
    const now = new Date("2024-01-01");
    const due = new Date("2020-01-01");
    // Act
    const result = v.validateDueDate(due, now);
    // Assert
    expect(result.ok).toBe(false);
    expect(result.errors).toContain("期限が過去です");
  });

  // 【正常系】未来日は OK。過去 NG のテストと対にして、比較の向きが正しいことを保証する。
  it("validateDueDate: 未来の日付は OK", () => {
    // Arrange
    const now = new Date("2024-01-01");
    const due = new Date("2030-01-01");
    // Act
    const result = v.validateDueDate(due, now);
    // Assert
    expect(result.ok).toBe(true);
  });
});
