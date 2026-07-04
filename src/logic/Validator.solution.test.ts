import { describe, expect, it } from "vitest";
import { Validator } from "./Validator";

// AAA パターン: 各テストを Arrange（準備）/ Act（実行）/ Assert（検証）の3段で書く。
describe("解答例: Validator", () => {
  const v = new Validator();

  it("validateTitle: 空文字は NG", () => {
    // Arrange
    const title = "";
    // Act
    const result = v.validateTitle(title);
    // Assert
    expect(result.ok).toBe(false);
    expect(result.errors).toContain("タイトルは必須です");
  });

  it("validateTitle: 空白のみも NG", () => {
    // Arrange
    const title = "   ";
    // Act
    const result = v.validateTitle(title);
    // Assert
    expect(result.ok).toBe(false);
    expect(result.errors).toContain("タイトルは必須です");
  });

  it("validateTitle: 通常のタイトルは OK", () => {
    // Arrange
    const title = "牛乳を買う";
    // Act
    const result = v.validateTitle(title);
    // Assert
    expect(result.ok).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("validateTitle: 101文字は NG", () => {
    // Arrange
    const title = "a".repeat(101);
    // Act
    const result = v.validateTitle(title);
    // Assert
    expect(result.ok).toBe(false);
    expect(result.errors).toContain("タイトルが長すぎます");
  });

  it("validateTitle: 100文字はぴったり OK", () => {
    // Arrange
    const title = "a".repeat(100);
    // Act
    const result = v.validateTitle(title);
    // Assert
    expect(result.ok).toBe(true);
  });

  it("validateDueDate: null は OK", () => {
    // Arrange
    const now = new Date("2024-01-01");
    // Act
    const result = v.validateDueDate(null, now);
    // Assert
    expect(result.ok).toBe(true);
  });

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
