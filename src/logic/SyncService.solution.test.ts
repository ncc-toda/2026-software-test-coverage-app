import { describe, expect, it, vi } from "vitest";
import { SyncService, type RemoteClient } from "./SyncService";
import type { Persistence } from "./Storage";

/**
 * ============================================================
 * 解答例の解説: SyncService（ステップ2: 外部依存あり・vi.spyOn を使う）
 * ============================================================
 * テスト対象: sync() — オフラインなら skip / ローカルにデータがあれば push / なければ pull
 *
 * ■ テスト観点の洗い出し
 *   sync() の戻り値は "pushed" | "pulled" | "skipped" の3種類 = 実行経路が3本。
 *   経路を決めるのは外部依存の戻り値（isOnline と local.load）なので、
 *   mockReturnValue で依存の返事を操作して、3本の経路を1本ずつ通す。
 *
 * ■ この解答例の見どころ
 *   - 「戻り値」と「副作用（どの依存が呼ばれたか）」の両方を検証する。
 *     skipped のテストでは not.toHaveBeenCalled() で「呼ばれていないこと」も確認している。
 *     ネットワーク処理では「余計な通信をしていない」ことも立派な仕様。
 *   - remote と local の2つの偽物をまとめて作る fakes() ヘルパーで Arrange を短くしている。
 */

// テスト用の偽物ペア。既定では「オンライン・ローカルは空・リモートは空配列」という無難な状態にし、
// 各テストで必要な部分だけ spyOn + mockReturnValue で上書きする。
function fakes(): { remote: RemoteClient; local: Persistence } {
  return {
    remote: { isOnline: () => true, fetchRemote: () => "[]", pushRemote: () => {} },
    local: { load: () => null, save: () => {} },
  };
}

// AAA パターン: 各テストを Arrange（準備）/ Act（実行）/ Assert（検証）の3段で書く。
describe("解答例: SyncService", () => {
  // 【経路1: skipped】isOnline を false に差し替えて最初のガードで return させる。
  // 戻り値に加えて「push が一度も呼ばれていない」＝オフライン中に通信しないことを検証。
  it("オフラインなら skipped で何もしない", () => {
    // Arrange
    const { remote, local } = fakes();
    vi.spyOn(remote, "isOnline").mockReturnValue(false);
    const push = vi.spyOn(remote, "pushRemote");

    // Act
    const result = new SyncService(remote, local).sync();

    // Assert
    expect(result).toBe("skipped");
    expect(push).not.toHaveBeenCalled();
  });

  // 【経路2: pushed】local.load が null 以外を返すように差し替え、「ローカル優先で push」の分岐へ。
  // toHaveBeenCalledWith で「ローカルのデータがそのままリモートに渡った」ことまで確認する。
  it("ローカルにデータがあれば pushRemote が呼ばれ pushed", () => {
    // Arrange
    const { remote, local } = fakes();
    vi.spyOn(local, "load").mockReturnValue("[{}]");
    const push = vi.spyOn(remote, "pushRemote");

    // Act
    const result = new SyncService(remote, local).sync();

    // Assert
    expect(result).toBe("pushed");
    expect(push).toHaveBeenCalledWith("[{}]");
  });

  // 【経路3: pulled】ローカルが空（null）なら、リモートから取得してローカルへ保存する分岐。
  // fetchRemote の戻り値を "[remote]" にしておき、その同じ値が local.save に渡ることで
  // 「取得 → 保存」のデータの流れが繋がっていることを検証している。
  it("ローカルが空なら fetchRemote→local.save で pulled", () => {
    // Arrange
    const { remote, local } = fakes();
    vi.spyOn(local, "load").mockReturnValue(null);
    vi.spyOn(remote, "fetchRemote").mockReturnValue("[remote]");
    const save = vi.spyOn(local, "save");

    // Act
    const result = new SyncService(remote, local).sync();

    // Assert
    expect(result).toBe("pulled");
    expect(save).toHaveBeenCalledWith("[remote]");
  });
});
