import { TodoItem } from "./TodoItem";

export class TodoStore {
  private items = new Map<string, TodoItem>();

  add(item: TodoItem): void {
    if (this.items.has(item.id)) throw new Error(`duplicate id: ${item.id}`);
    this.items.set(item.id, item);
  }

  remove(id: string): boolean {
    return this.items.delete(id);
  }

  toggle(id: string): void {
    const item = this.items.get(id);
    if (item === undefined) throw new Error(`not found: ${id}`);
    item.toggle();
  }

  get(id: string): TodoItem | undefined {
    return this.items.get(id);
  }

  all(): TodoItem[] {
    return [...this.items.values()];
  }

  get size(): number {
    return this.items.size;
  }
}
