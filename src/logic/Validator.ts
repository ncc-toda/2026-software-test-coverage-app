export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

export class Validator {
  static readonly MAX_TITLE = 100;

  validateTitle(title: string): ValidationResult {
    const errors: string[] = [];
    const trimmed = title.trim();
    if (trimmed.length === 0) errors.push("タイトルは必須です");
    if (trimmed.length > Validator.MAX_TITLE) errors.push("タイトルが長すぎます");
    return { ok: errors.length === 0, errors };
  }

  validateDueDate(dueDate: Date | null, now: Date): ValidationResult {
    if (dueDate === null) return { ok: true, errors: [] };
    if (dueDate.getTime() < now.getTime()) return { ok: false, errors: ["期限が過去です"] };
    return { ok: true, errors: [] };
  }
}
