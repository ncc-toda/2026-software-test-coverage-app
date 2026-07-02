import { describe, it, vi } from "vitest";
import { SyncService, type RemoteClient } from "./SyncService";
import type { Persistence } from "./Storage";

// ヒント: vi.spyOn で RemoteClient と Persistence の各メソッドを差し替えよう。
//        戻り値を変えたいときは .mockReturnValue(...) を使う。
//        呼ばれたか確認するには expect(spy).toHaveBeenCalledWith(...) を使う。

describe("SyncService", () => {
  // ここに it(...) を書いてカバレッジ％を上げよう
  it.todo("オフラインのとき skipped が返る");
  it.todo("ローカルにデータがあるとき pushed が返る");
  it.todo("ローカルが空のとき pulled が返る");
});
