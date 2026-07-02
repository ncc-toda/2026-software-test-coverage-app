import type { Persistence } from "./Storage";

export interface RemoteClient {
  isOnline(): boolean;
  fetchRemote(): string;
  pushRemote(raw: string): void;
}

export type SyncResult = "pushed" | "pulled" | "skipped";

export class SyncService {
  constructor(
    private readonly remote: RemoteClient,
    private readonly local: Persistence,
  ) {}

  /** ローカルにデータがあれば push、無ければ pull。オフラインは skip。 */
  sync(): SyncResult {
    if (!this.remote.isOnline()) return "skipped";
    const localRaw = this.local.load();
    if (localRaw !== null) {
      this.remote.pushRemote(localRaw);
      return "pushed";
    }
    const remoteRaw = this.remote.fetchRemote();
    this.local.save(remoteRaw);
    return "pulled";
  }
}
