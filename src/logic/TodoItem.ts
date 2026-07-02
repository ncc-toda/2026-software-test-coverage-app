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
    // 未指定時はエポック(1970)を既定にしてテストの決定性を保つ。実アプリでは生成時刻を渡す。
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
      // union 型を守れば通常到達しない防御分岐。100%/branch を敢えて残し「常に100%を目指す必要はない」ことを学ぶ余地にしている。
      default:
        return 0;
    }
  }
}
