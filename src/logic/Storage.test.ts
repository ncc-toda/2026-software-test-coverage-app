import { describe, it, vi } from "vitest";
import { Storage, type Persistence } from "./Storage";

// テスト観点のヒント（具体的なケースは自分で考えて洗い出そう）:
//   - 正常系 / 異常系 / 境界値 / 特殊値(null・空 など)
//   - この Storage は Persistence に依存する。ロンドン学派で、
//     vi.spyOn(p, "save") や vi.spyOn(p, "load").mockReturnValue(...) で
//     ニセモノに差し替え、「どう呼ばれたか」「復元される結果」を検証しよう。
// 進め方: 本体 (Storage.ts) を読み、`just cov` の赤い行・分岐を手がかりに、
//         観点ごとの it(...) を自分で起こそう。書き方の見本は TodoItem.test.ts。
describe("Storage", () => {
  it.todo("まずは最初のテストを書いてみよう（書けたらこの行は消す）");
});
