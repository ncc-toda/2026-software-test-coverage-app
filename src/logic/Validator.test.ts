import { describe, it } from "vitest";
import { Validator } from "./Validator";

// テスト観点のヒント（具体的なケースは自分で考えて洗い出そう）:
//   - 正常系: 期待どおりの入力で正しい結果になるか
//   - 異常系: エラーや NG になる入力はあるか
//   - 境界値: 0件・上限ちょうど・1つ違い など「境目」
//   - 特殊値: null / 空文字 / 空白だけ などの特別な値
// 進め方: 本体 (Validator.ts) を読み、`just cov` の赤い行・分岐を手がかりに、
//         観点ごとの it(...) を自分で起こそう。書き方の見本は TodoItem.test.ts。
describe("Validator", () => {
  it.todo("まずは最初のテストを書いてみよう（書けたらこの行は消す）");
});
