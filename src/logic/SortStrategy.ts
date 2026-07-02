import type { SortKey } from "./types";
import { TodoItem } from "./TodoItem";

export class SortStrategy {
  sort(items: TodoItem[], key: SortKey, desc = false): TodoItem[] {
    const sorted = [...items].sort((a, b) => this.compare(a, b, key));
    return desc ? sorted.reverse() : sorted;
  }

  private compare(a: TodoItem, b: TodoItem, key: SortKey): number {
    switch (key) {
      case "priority":
        return b.priorityWeight() - a.priorityWeight();
      case "created":
        return a.createdAt.getTime() - b.createdAt.getTime();
      case "due":
        return this.compareDue(a, b);
      // union 型を守れば通常到達しない防御分岐。100%/branch を敢えて残し「常に100%を目指す必要はない」ことを学ぶ余地にしている。
      default:
        throw new Error(`unknown sort key: ${key as string}`);
    }
  }

  /** 期限なしは末尾に回す。 */
  private compareDue(a: TodoItem, b: TodoItem): number {
    if (a.dueDate === null && b.dueDate === null) return 0;
    if (a.dueDate === null) return 1;
    if (b.dueDate === null) return -1;
    return a.dueDate.getTime() - b.dueDate.getTime();
  }
}
