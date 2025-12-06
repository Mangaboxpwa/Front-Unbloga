import { Injectable } from '@angular/core';
import { openDB, DBSchema } from 'idb';

interface MiDB extends DBSchema {
  cache: {
    key: string;
    value: any;
  };
}

@Injectable({
  providedIn: 'root'
})
export class OfflineCacheService {

  private dbPromise = openDB<MiDB>('mi-db-cache', 1, {
    upgrade(db) {
      db.createObjectStore('cache');
    }
  });

  async save(key: string, data: any) {
    const db = await this.dbPromise;
    await db.put('cache', data, key);
  }

  async load(key: string) {
    const db = await this.dbPromise;
    return await db.get('cache', key);
  }
}
