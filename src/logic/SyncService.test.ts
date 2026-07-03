import { describe, it, vi } from "vitest";
import { SyncService, type RemoteClient } from "./SyncService";
import type { Persistence } from "./Storage";

// テスト観点のヒント（具体的なケースは自分で考えて洗い出そう）:
//   - 正常系 / 異常系 / 分岐ごとの結果（戻り値）
//   - RemoteClient と Persistence に依存する。ロンドン学派で、
//     vi.spyOn(...).mockReturnValue(...) で各メソッドの戻り値を差し替え、
//     expect(spy).toHaveBeenCalledWith(...) で「呼ばれ方」を検証しよう。
// 進め方: 本体 (SyncService.ts) を読み、`just cov` の赤い行・分岐を手がかりに、
//         観点ごとの it(...) を自分で起こそう。書き方の見本は TodoItem.test.ts。
describe("SyncService", () => {
  it.todo("まずは最初のテストを書いてみよう（書けたらこの行は消す）");
});
