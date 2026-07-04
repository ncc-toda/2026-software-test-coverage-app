import { describe, expect, it, vi } from "vitest";
import { SyncService, type RemoteClient } from "./SyncService";
import type { Persistence } from "./Storage";

function fakes(): { remote: RemoteClient; local: Persistence } {
  return {
    remote: { isOnline: () => true, fetchRemote: () => "[]", pushRemote: () => {} },
    local: { load: () => null, save: () => {} },
  };
}

// AAA パターン: 各テストを Arrange（準備）/ Act（実行）/ Assert（検証）の3段で書く。
describe("解答例: SyncService", () => {
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
