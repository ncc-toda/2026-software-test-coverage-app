import { describe, expect, it, vi } from "vitest";
import { Storage, type Persistence } from "./Storage";
import { TodoStore } from "./TodoStore";
import { TodoItem } from "./TodoItem";

/**
 * ============================================================
 * 解答例の解説: Storage（ステップ2: 外部依存あり・vi.spyOn を使う）
 * ============================================================
 * テスト対象: save（TodoStore → JSON 文字列化して永続化）/ load（JSON → TodoStore 復元）
 *
 * ■ ここからがステップ2: 本物の AsyncStorage は使わない
 *   Storage は Persistence インターフェース（load/save）にしか依存していないので、
 *   テストでは fakePersistence() というただのオブジェクトを差し込める（依存性注入）。
 *   さらに vi.spyOn で包むと「何回・どんな引数で呼ばれたか」を記録・検証できる。
 *
 * ■ テスト観点の洗い出し
 *   - save: 呼び出し回数と JSON の中身 / dueDate が null の場合と Date の場合（三項演算子の両分岐）
 *   - load: null（保存データなし→空 store）/ JSON あり（復元）/ dueDate 文字列→Date 変換
 *   - save と load で同じ「dueDate null / あり」の対称な分岐があるので、両方に2ケースずつ書く
 */

// テスト用の偽物 Persistence。「何もしない」実装を用意し、必要に応じて spyOn で観測・差し替えする。
function fakePersistence(): Persistence {
  return { load: () => null, save: () => {} };
}

// AAA パターン: 各テストを Arrange（準備）/ Act（実行）/ Assert（検証）の3段で書く。
describe("解答例: Storage (依存を spy で差し替え)", () => {
  // 【正常系・モックの基本】戻り値ではなく「副作用（save が呼ばれたこと）」を検証するテスト。
  // spy.mock.calls[0][0] で「1回目の呼び出しの第1引数」を取り出し、渡された JSON の中身まで見る。
  it("save: persistence.save が JSON 文字列で1回呼ばれる", () => {
    // Arrange
    const p = fakePersistence();
    const saveSpy = vi.spyOn(p, "save");
    const store = new TodoStore();
    store.add(new TodoItem({ id: "1", title: "x", dueDate: null }));

    // Act
    new Storage(p).save(store);

    // Assert
    expect(saveSpy).toHaveBeenCalledTimes(1);
    const raw = saveSpy.mock.calls[0]![0];
    expect(JSON.parse(raw)).toHaveLength(1);
  });

  // 【特殊値】save 内の三項演算子「dueDate === null ? null : toISOString()」の null 側を通す。
  it("save: dueDate が null のとき JSON に null が入る", () => {
    // Arrange
    const p = fakePersistence();
    const saveSpy = vi.spyOn(p, "save");
    const store = new TodoStore();
    store.add(new TodoItem({ id: "1", title: "x", dueDate: null }));

    // Act
    new Storage(p).save(store);

    // Assert
    const saved = JSON.parse(saveSpy.mock.calls[0]![0]);
    expect(saved[0].dueDate).toBeNull();
  });

  // 【正常系】同じ三項演算子の Date 側。Date は JSON にそのまま入らないので
  // ISO 8601 文字列に変換される、という直列化の仕様をテストで文書化している。
  it("save: dueDate が Date のとき ISO 文字列として JSON に入る", () => {
    // Arrange
    const p = fakePersistence();
    const saveSpy = vi.spyOn(p, "save");
    const store = new TodoStore();
    store.add(new TodoItem({ id: "1", title: "x", dueDate: new Date("2024-06-01T00:00:00.000Z") }));

    // Act
    new Storage(p).save(store);

    // Assert
    const saved = JSON.parse(saveSpy.mock.calls[0]![0]);
    expect(saved[0].dueDate).toBe("2024-06-01T00:00:00.000Z");
  });

  // 【特殊値】初回起動などで保存データがない（load が null）ケース。
  // mockReturnValue で spy に「null を返せ」と指示し、load の early return 分岐を通す。
  it("load: persistence.load が null なら空の store", () => {
    // Arrange
    const p = fakePersistence();
    vi.spyOn(p, "load").mockReturnValue(null);

    // Act
    const store = new Storage(p).load();

    // Assert
    expect(store.size).toBe(0);
  });

  // 【正常系】保存済み JSON から TodoItem が復元されるメインの経路。
  // 入力の JSON は「保存されているはずの形」を手書きして用意する（save の実装に依存しない）。
  it("load: JSON をパースして TodoItem を復元する", () => {
    // Arrange
    const p = fakePersistence();
    vi.spyOn(p, "load").mockReturnValue(
      JSON.stringify([
        { id: "1", title: "x", done: true, priority: "high", dueDate: null, createdAt: "2020-01-01T00:00:00.000Z" },
      ]),
    );

    // Act
    const store = new Storage(p).load();

    // Assert
    expect(store.size).toBe(1);
    expect(store.get("1")?.done).toBe(true);
  });

  // 【正常系】load 側の三項演算子の「文字列 → new Date()」側。
  // save の「Date → 文字列」テストと対になっており、往復（round-trip）で型が保たれることを保証する。
  it("load: dueDate が文字列の場合 Date に復元される", () => {
    // Arrange
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

    // Act
    const store = new Storage(p).load();

    // Assert
    expect(store.get("1")?.dueDate).toBeInstanceOf(Date);
  });
});
