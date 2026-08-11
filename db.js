// Minimal IndexedDB wrapper. No external dependencies.
// Stores: flights, hotels, itinerary, files (blobs: pdfs/photos), config (single row: 'trip')

const DB_NAME = 'busan-fukuoka-trip';
const DB_VERSION = 1;
const STORES = ['flights', 'hotels', 'itinerary', 'files', 'config'];

let dbPromise = null;

function openDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      for (const name of STORES) {
        if (!db.objectStoreNames.contains(name)) {
          const keyPath = name === 'config' ? 'key' : 'id';
          db.createObjectStore(name, { keyPath });
        }
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

async function tx(storeName, mode, fn) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const t = db.transaction(storeName, mode);
    const store = t.objectStore(storeName);
    const result = fn(store);
    t.oncomplete = () => resolve(result);
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error);
  });
}

function reqToPromise(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export const DB = {
  async getAll(storeName) {
    const db = await openDB();
    const t = db.transaction(storeName, 'readonly');
    const store = t.objectStore(storeName);
    return reqToPromise(store.getAll());
  },
  async get(storeName, key) {
    const db = await openDB();
    const t = db.transaction(storeName, 'readonly');
    const store = t.objectStore(storeName);
    return reqToPromise(store.get(key));
  },
  async put(storeName, value) {
    return tx(storeName, 'readwrite', (store) => store.put(value));
  },
  async delete(storeName, key) {
    return tx(storeName, 'readwrite', (store) => store.delete(key));
  },
  async clear(storeName) {
    return tx(storeName, 'readwrite', (store) => store.clear());
  },
};

export function uid() {
  return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);
}

// ---- File (blob) helpers: used for PDFs and photos ----
export async function saveFile(fileOrBlob, name) {
  const id = uid();
  await DB.put('files', { id, blob: fileOrBlob, name: name || fileOrBlob.name || 'file', type: fileOrBlob.type || '' });
  return id;
}

export async function getFile(id) {
  if (!id) return null;
  return DB.get('files', id);
}

export async function deleteFile(id) {
  if (!id) return;
  return DB.delete('files', id);
}

// Creates an object URL for a stored file id. Caller should revoke when done if long-lived.
export async function getFileObjectUrl(id) {
  const rec = await getFile(id);
  if (!rec || !rec.blob) return null;
  return URL.createObjectURL(rec.blob);
}
