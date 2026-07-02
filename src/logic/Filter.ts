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
      // union 型を守れば通常到達しない防御分岐。100%/branch を敢えて残し「常に100%を目指す必要はない」ことを学ぶ余地にしている。
      default:
        throw new Error(`unknown filter: ${kind as string}`);
    }
  }
}
