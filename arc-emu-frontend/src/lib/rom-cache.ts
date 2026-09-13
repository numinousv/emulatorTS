import { openDB, type IDBPDatabase } from "idb";

const DB_NAME = "rom-cache";
const DB_VERSION = 1;
const STORE_NAME = "roms";

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb(): Promise<IDBPDatabase> {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: "gameId" });
          store.createIndex("timestamp", "timestamp");
        }
      },
    });
  }
  return dbPromise;
}

export async function getCachedRom(gameId: string): Promise<Blob | null> {
  try {
    const db = await getDb();
    const entry = await db.get(STORE_NAME, gameId);
    if (!entry) return null;
    return entry.blob;
  } catch {
    return null;
  }
}

export async function cacheRom(gameId: string, blob: Blob): Promise<void> {
  try {
    const db = await getDb();
    await db.put(STORE_NAME, {
      gameId,
      blob,
      timestamp: Date.now(),
      size: blob.size,
    });
  } catch (err) {
    console.warn("Failed to cache ROM:", err);
  }
}

export async function clearRomCache(): Promise<void> {
  try {
    const db = await getDb();
    await db.clear(STORE_NAME);
  } catch {
    // ignore
  }
}
