import { describe, expect, it } from "vitest";
import { Validator } from "./Validator";

describe("解答例: Validator", () => {
  const v = new Validator();

  it("validateTitle: 空文字は NG", () => {
    const result = v.validateTitle("");
    expect(result.ok).toBe(false);
    expect(result.errors).toContain("タイトルは必須です");
  });

  it("validateTitle: 空白のみも NG", () => {
    const result = v.validateTitle("   ");
    expect(result.ok).toBe(false);
    expect(result.errors).toContain("タイトルは必須です");
  });

  it("validateTitle: 通常のタイトルは OK", () => {
    const result = v.validateTitle("牛乳を買う");
    expect(result.ok).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("validateTitle: 101文字は NG", () => {
    const result = v.validateTitle("a".repeat(101));
    expect(result.ok).toBe(false);
    expect(result.errors).toContain("タイトルが長すぎます");
  });

  it("validateTitle: 100文字はぴったり OK", () => {
    const result = v.validateTitle("a".repeat(100));
    expect(result.ok).toBe(true);
  });

  it("validateDueDate: null は OK", () => {
    const result = v.validateDueDate(null, new Date("2024-01-01"));
    expect(result.ok).toBe(true);
  });

  it("validateDueDate: 過去の日付は NG", () => {
    const result = v.validateDueDate(new Date("2020-01-01"), new Date("2024-01-01"));
    expect(result.ok).toBe(false);
    expect(result.errors).toContain("期限が過去です");
  });

  it("validateDueDate: 未来の日付は OK", () => {
    const result = v.validateDueDate(new Date("2030-01-01"), new Date("2024-01-01"));
    expect(result.ok).toBe(true);
  });
});
