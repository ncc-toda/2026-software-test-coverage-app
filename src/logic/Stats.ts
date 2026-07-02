import { TodoItem } from "./TodoItem";

export class Stats {
  completionRate(items: TodoItem[]): number {
    if (items.length === 0) return 0;
    return items.filter((i) => i.done).length / items.length;
  }

  remaining(items: TodoItem[]): number {
    return items.filter((i) => !i.done).length;
  }

  overdueCount(items: TodoItem[], now: Date): number {
    return items.filter((i) => i.isOverdue(now)).length;
  }
}
