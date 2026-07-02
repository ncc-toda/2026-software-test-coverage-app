import type { Priority } from "./types";

export interface TodoItemProps {
  id: string;
  title: string;
  done?: boolean;
  priority?: Priority;
  dueDate?: Date | null;
  createdAt?: Date;
}

/** 1 件の TODO。RN 非依存の純粋ロジック。 */
export class TodoItem {
  readonly id: string;
  title: string;
  done: boolean;
  priority: Priority;
  dueDate: Date | null;
  readonly createdAt: Date;

  constructor(props: TodoItemProps) {
    this.id = props.id;
    this.title = props.title;
    this.done = props.done ?? false;
    this.priority = props.priority ?? "mid";
    this.dueDate = props.dueDate ?? null;
    this.createdAt = props.createdAt ?? new Date(0);
  }

  /** 完了状態を反転する。 */
  toggle(): void {
    this.done = !this.done;
  }

  /** 期限切れか？ 完了済み・期限なしは常に false。 */
  isOverdue(now: Date): boolean {
    if (this.done) return false;
    if (this.dueDate === null) return false;
    return this.dueDate.getTime() < now.getTime();
  }

  /** 優先度の重み（並び替え・集計用）。 */
  priorityWeight(): number {
    switch (this.priority) {
      case "high":
        return 3;
      case "mid":
        return 2;
      case "low":
        return 1;
      default:
        return 0;
    }
  }
}
