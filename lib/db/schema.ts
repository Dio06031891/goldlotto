import Dexie, { type Table } from 'dexie';
import type { SpendingPlan } from '@/lib/types/spending';

export class GoldlottoDB extends Dexie {
  plans!: Table<SpendingPlan, string>;

  constructor() {
    super('Goldlotto');
    this.version(1).stores({
      plans: 'id, name, createdAt, updatedAt',
    });
  }
}

let _db: GoldlottoDB | null = null;

export function getPlanDb(): GoldlottoDB {
  if (typeof window === 'undefined') {
    throw new Error('IndexedDB is only available in the browser');
  }
  if (!_db) _db = new GoldlottoDB();
  return _db;
}
