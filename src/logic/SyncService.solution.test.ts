import { describe, expect, it, vi } from "vitest";
import { SyncService, type RemoteClient } from "./SyncService";
import type { Persistence } from "./Storage";

function fakes(): { remote: RemoteClient; local: Persistence } {
  return {
    remote: { isOnline: () => true, fetchRemote: () => "[]", pushRemote: () => {} },
    local: { load: () => null, save: () => {} },
  };
}

describe("解答例: SyncService", () => {
  it("オフラインなら skipped で何もしない", () => {
    const { remote, local } = fakes();
    vi.spyOn(remote, "isOnline").mockReturnValue(false);
    const push = vi.spyOn(remote, "pushRemote");

    const result = new SyncService(remote, local).sync();

    expect(result).toBe("skipped");
    expect(push).not.toHaveBeenCalled();
  });

  it("ローカルにデータがあれば pushRemote が呼ばれ pushed", () => {
    const { remote, local } = fakes();
    vi.spyOn(local, "load").mockReturnValue("[{}]");
    const push = vi.spyOn(remote, "pushRemote");

    const result = new SyncService(remote, local).sync();

    expect(result).toBe("pushed");
    expect(push).toHaveBeenCalledWith("[{}]");
  });

  it("ローカルが空なら fetchRemote→local.save で pulled", () => {
    const { remote, local } = fakes();
    vi.spyOn(local, "load").mockReturnValue(null);
    vi.spyOn(remote, "fetchRemote").mockReturnValue("[remote]");
    const save = vi.spyOn(local, "save");

    const result = new SyncService(remote, local).sync();

    expect(result).toBe("pulled");
    expect(save).toHaveBeenCalledWith("[remote]");
  });
});
