import { TodoItem } from "./TodoItem";
import { TodoStore } from "./TodoStore";
import type { Priority } from "./types";

/** 実際の保存先(AsyncStorage 等)を抽象化した永続化インターフェース。 */
export interface Persistence {
  load(): string | null;
  save(raw: string): void;
}

interface SerializedItem {
  id: string;
  title: string;
  done: boolean;
  priority: Priority;
  dueDate: string | null;
  createdAt: string;
}

export class Storage {
  constructor(private readonly persistence: Persistence) {}

  save(store: TodoStore): void {
    const data: SerializedItem[] = store.all().map((i) => ({
      id: i.id,
      title: i.title,
      done: i.done,
      priority: i.priority,
      dueDate: i.dueDate === null ? null : i.dueDate.toISOString(),
      createdAt: i.createdAt.toISOString(),
    }));
    this.persistence.save(JSON.stringify(data));
  }

  load(): TodoStore {
    const raw = this.persistence.load();
    const store = new TodoStore();
    if (raw === null) return store;
    const data = JSON.parse(raw) as SerializedItem[];
    for (const s of data) {
      store.add(
        new TodoItem({
          id: s.id,
          title: s.title,
          done: s.done,
          priority: s.priority,
          dueDate: s.dueDate === null ? null : new Date(s.dueDate),
          createdAt: new Date(s.createdAt),
        }),
      );
    }
    return store;
  }
}
