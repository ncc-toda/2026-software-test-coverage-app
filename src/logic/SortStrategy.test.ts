import { describe, it } from "vitest";
import { SortStrategy } from "./SortStrategy";

// テスト観点のヒント（具体的なケースは自分で考えて洗い出そう）:
//   - 正常系: 各並び替えキーで期待どおりの順序になるか
//   - 境界値: 0件・1件・同値が並ぶ など「境目」
//   - 特殊値: 期限なし(null) が混ざるとどうなるか / 昇順・降順
// 進め方: 本体 (SortStrategy.ts) を読み、`just cov` の赤い行・分岐を手がかりに、
//         観点ごとの it(...) を自分で起こそう。書き方の見本は TodoItem.test.ts。
describe("SortStrategy", () => {
  it.todo("まずは最初のテストを書いてみよう（書けたらこの行は消す）");
});
