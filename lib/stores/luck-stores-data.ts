import 'server-only';

import type { LottoStore } from '@/lib/types/store';
import {
  loadLuckStoresFromDisk,
  loadLuckStoresMetaFromDisk,
  type LuckStoresMeta,
} from '@/lib/stores/luck-stores-loader';

export type { LuckStoresMeta };

export function getLuckStoresCatalog(): LottoStore[] {
  return loadLuckStoresFromDisk();
}

export function getLuckStoresMeta(): LuckStoresMeta | null {
  return loadLuckStoresMetaFromDisk();
}

export function isSyncedLuckStores(): boolean {
  return loadLuckStoresMetaFromDisk() !== null;
}
