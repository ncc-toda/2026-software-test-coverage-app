# カバレッジ道場 — RN+Expo TODOアプリ

TypeScript のテストを書くことに慣れるための演習。`src/logic/` にテストを書いて、テストカバレッジ（%）を上げていこう（赤い行を緑にしていくイメージ）。

---

## セットアップ

```bash
# Nix 環境がある場合
nix develop
just install

# Nix なしの場合
pnpm install
```

---

## 遊び方

```bash
just cov
```

`coverage/index.html` をブラウザで開く。赤くハイライトされた行・分岐が「まだテストされていないコード」。それを緑にするテストを `*.test.ts` に書いていく。

---

## どこを触るか

| 触ってよい | 触ってはいけない |
|---|---|
| `src/logic/*.test.ts` | `src/logic/*.ts`（本体ロジック） |

**編集対象**: `src/logic/*.test.ts` のみ。  
**見本**: `src/logic/TodoItem.test.ts`（2つのテストが実装済み。書き方の参考に）。

各 `*.test.ts` には**テスト観点のヒント**（正常系 / 異常系 / 境界値 / 特殊値）がコメントで書いてあります。
**具体的なテストケースは自分で考えて洗い出すのがこの演習のねらい**です。

進め方:

1. 本体 `src/logic/*.ts` を読んで、どんな入力・分岐があるか把握する。
2. 観点（正常/異常/境界/null 等）ごとに「こういう入力ならこうなるはず」を `it("...", () => { ... })` で書く。
3. `just cov` で**赤い（まだ通っていない）行・分岐**を確認 → それを通す入力を考えて、さらにテストを足す。

`it.todo("...")` は「まだ書いていないテスト」の目印。実際の `it(...)` を書いたら消してかまいません。

---

## 進め方の順序

### ステップ 1 — 純粋ロジック（依存なし）

単体テストしやすい順に進める。

1. `TodoItem` — 1件のTODOを表すクラス（`toggle`, `isOverdue`, `priorityWeight`）
2. `Validator` — タイトル・期限の入力検証
3. `Filter` — all / active / completed フィルタリング
4. `SortStrategy` — due / priority / created 並び替え
5. `Stats` — 完了率・残件数・期限切れカウント
6. `TodoStore` — TODOの追加・削除・トグル・一覧

### ステップ 2 — 外部依存あり（`vi.spyOn` を使う）

外部 I/O をモックしてテストする。

7. `Storage` — AsyncStorage への永続化（`vi.spyOn` でモック）
8. `SyncService` — サーバー同期（`vi.spyOn` でモック）

---

## スコアの見方

```
File       | % Stmts | % Branch | % Funcs | % Lines
-----------|---------|----------|---------|--------
Filter.ts  |     100 |       75 |     100 |     100
...
```

- **Lines（行）**: 90%台を目標にする
- **Branch（分岐）**: if/switch の各分岐。100% を目指すとよいが、到達不能な `default` 防御分岐（TypeScript の union 型が守る分岐）が各クラスに存在するため、常に 100% を目標にする必要はない

---

## 発展

RNコンポーネント自体のテストに挑戦したい場合:

- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)

---

## 教員向けメモ

模範解答テスト（`*.solution.test.ts`）込みのカバレッジを確認するには:

```bash
just cov-solution
```

約 98% に達することを想定している。`*.solution.test.ts` は学生のテスト実行（`just cov`）では除外されるため、解答が事前に見えることはない。
