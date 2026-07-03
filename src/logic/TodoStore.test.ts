import { describe, it } from "vitest";
import { TodoStore } from "./TodoStore";

// テスト観点のヒント（具体的なケースは自分で考えて洗い出そう）:
//   - 正常系: 追加・削除・トグル・取得が期待どおり動くか
//   - 異常系: エラーや throw になる操作はあるか（重複・存在しない id など）
//   - 境界値: 0件・1件 など「境目」
// 進め方: 本体 (TodoStore.ts) を読み、`just cov` の赤い行・分岐を手がかりに、
//         観点ごとの it(...) を自分で起こそう。書き方の見本は TodoItem.test.ts。
describe("TodoStore", () => {
  it.todo("まずは最初のテストを書いてみよう（書けたらこの行は消す）");
});
