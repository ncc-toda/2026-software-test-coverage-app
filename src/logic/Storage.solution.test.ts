import { describe, expect, it, vi } from "vitest";
import { Storage, type Persistence } from "./Storage";
import { TodoStore } from "./TodoStore";
import { TodoItem } from "./TodoItem";

function fakePersistence(): Persistence {
  return { load: () => null, save: () => {} };
}

describe("解答例: Storage (依存を spy で差し替え)", () => {
  it("save: persistence.save が JSON 文字列で1回呼ばれる", () => {
    const p = fakePersistence();
    const saveSpy = vi.spyOn(p, "save");
    const store = new TodoStore();
    store.add(new TodoItem({ id: "1", title: "x", dueDate: null }));

    new Storage(p).save(store);

    expect(saveSpy).toHaveBeenCalledTimes(1);
    const raw = saveSpy.mock.calls[0]![0];
    expect(JSON.parse(raw)).toHaveLength(1);
  });

  it("save: dueDate が null のとき JSON に null が入る", () => {
    const p = fakePersistence();
    const saveSpy = vi.spyOn(p, "save");
    const store = new TodoStore();
    store.add(new TodoItem({ id: "1", title: "x", dueDate: null }));

    new Storage(p).save(store);

    const saved = JSON.parse(saveSpy.mock.calls[0]![0]);
    expect(saved[0].dueDate).toBeNull();
  });

  it("save: dueDate が Date のとき ISO 文字列として JSON に入る", () => {
    const p = fakePersistence();
    const saveSpy = vi.spyOn(p, "save");
    const store = new TodoStore();
    store.add(new TodoItem({ id: "1", title: "x", dueDate: new Date("2024-06-01T00:00:00.000Z") }));

    new Storage(p).save(store);

    const saved = JSON.parse(saveSpy.mock.calls[0]![0]);
    expect(saved[0].dueDate).toBe("2024-06-01T00:00:00.000Z");
  });

  it("load: persistence.load が null なら空の store", () => {
    const p = fakePersistence();
    vi.spyOn(p, "load").mockReturnValue(null);

    const store = new Storage(p).load();

    expect(store.size).toBe(0);
  });

  it("load: JSON をパースして TodoItem を復元する", () => {
    const p = fakePersistence();
    vi.spyOn(p, "load").mockReturnValue(
      JSON.stringify([
        { id: "1", title: "x", done: true, priority: "high", dueDate: null, createdAt: "2020-01-01T00:00:00.000Z" },
      ]),
    );

    const store = new Storage(p).load();

    expect(store.size).toBe(1);
    expect(store.get("1")?.done).toBe(true);
  });

  it("load: dueDate が文字列の場合 Date に復元される", () => {
    const p = fakePersistence();
    vi.spyOn(p, "load").mockReturnValue(
      JSON.stringify([
        {
          id: "1",
          title: "x",
          done: false,
          priority: "mid",
          dueDate: "2024-06-01T00:00:00.000Z",
          createdAt: "2020-01-01T00:00:00.000Z",
        },
      ]),
    );

    const store = new Storage(p).load();

    expect(store.get("1")?.dueDate).toBeInstanceOf(Date);
  });
});
