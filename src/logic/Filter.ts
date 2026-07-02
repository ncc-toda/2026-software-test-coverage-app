import type { FilterKind } from "./types";
import { TodoItem } from "./TodoItem";

export class Filter {
  apply(items: TodoItem[], kind: FilterKind): TodoItem[] {
    switch (kind) {
      case "all":
        return [...items];
      case "active":
        return items.filter((i) => !i.done);
      case "completed":
        return items.filter((i) => i.done);
      default:
        throw new Error(`unknown filter: ${kind as string}`);
    }
  }
}
