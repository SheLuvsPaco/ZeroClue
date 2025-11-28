/**
 * IndexedDB/localStorage cache for chats and messages
 * Caches chat list and last 100 messages per chat
 */

const DB_NAME = 'zerochat_cache';
const DB_VERSION = 1;
const CHAT_LIST_KEY = 'chat_list';
const MESSAGE_PREFIX = 'messages_';

// IndexedDB setup
let db: IDBDatabase | null = null;

async function getDB(): Promise<IDBDatabase> {
  if (db) return db;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result;
      
      // Object store for chat list
      if (!database.objectStoreNames.contains('chats')) {
        database.createObjectStore('chats', { keyPath: 'id' });
      }
      
      // Object store for messages (indexed by chatId)
      if (!database.objectStoreNames.contains('messages')) {
        const messageStore = database.createObjectStore('messages', { keyPath: 'id' });
        messageStore.createIndex('chatId', 'chatId', { unique: false });
        messageStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

// Fallback to localStorage if IndexedDB unavailable
function isIndexedDBAvailable(): boolean {
  return typeof indexedDB !== 'undefined';
}

// Chat list cache
export async function cacheChatList(chats: any[]): Promise<void> {
  if (isIndexedDBAvailable()) {
    try {
      const database = await getDB();
      const transaction = database.transaction(['chats'], 'readwrite');
      const store = transaction.objectStore('chats');
      
      // Clear old data
      await new Promise<void>((resolve, reject) => {
        const clearReq = store.clear();
        clearReq.onsuccess = () => resolve();
        clearReq.onerror = () => reject(clearReq.error);
      });
      
      // Add new chats
      for (const chat of chats) {
        await new Promise<void>((resolve, reject) => {
          const addReq = store.add(chat);
          addReq.onsuccess = () => resolve();
          addReq.onerror = () => reject(addReq.error);
        });
      }
    } catch (error) {
      console.warn('IndexedDB cache failed, using localStorage:', error);
      localStorage.setItem(CHAT_LIST_KEY, JSON.stringify(chats));
    }
  } else {
    localStorage.setItem(CHAT_LIST_KEY, JSON.stringify(chats));
  }
}

export async function getCachedChatList(): Promise<any[]> {
  if (isIndexedDBAvailable()) {
    try {
      const database = await getDB();
      const transaction = database.transaction(['chats'], 'readonly');
      const store = transaction.objectStore('chats');
      
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.warn('IndexedDB read failed, trying localStorage:', error);
      const cached = localStorage.getItem(CHAT_LIST_KEY);
      return cached ? JSON.parse(cached) : [];
    }
  } else {
    const cached = localStorage.getItem(CHAT_LIST_KEY);
    return cached ? JSON.parse(cached) : [];
  }
}

// Messages cache (last 100 per chat)
const MAX_CACHED_MESSAGES = 100;

export async function cacheMessages(chatId: string, messages: any[]): Promise<void> {
  // Keep only last 100 messages
  const toCache = messages.slice(-MAX_CACHED_MESSAGES);
  
  if (isIndexedDBAvailable()) {
    try {
      const database = await getDB();
      const transaction = database.transaction(['messages'], 'readwrite');
      const store = transaction.objectStore('messages');
      const index = store.index('chatId');
      
      // Delete old messages for this chat, then add new ones
      return new Promise<void>((resolve, reject) => {
        const deleteReq = index.openCursor(IDBKeyRange.only(chatId));
        
        deleteReq.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
          if (cursor) {
            cursor.delete();
            cursor.continue();
          } else {
            // All deleted, now add new messages
            Promise.all(
              toCache.map(msg => 
                new Promise<void>((resolve, reject) => {
                  const addReq = store.add({ ...msg, chatId });
                  addReq.onsuccess = () => resolve();
                  addReq.onerror = () => reject(addReq.error);
                })
              )
            ).then(() => resolve()).catch(reject);
          }
        };
        deleteReq.onerror = () => reject(deleteReq.error);
      });
    } catch (error) {
      console.warn('IndexedDB message cache failed, using localStorage:', error);
      localStorage.setItem(`${MESSAGE_PREFIX}${chatId}`, JSON.stringify(toCache));
    }
  } else {
    localStorage.setItem(`${MESSAGE_PREFIX}${chatId}`, JSON.stringify(toCache));
  }
}

export async function getCachedMessages(chatId: string): Promise<any[]> {
  if (isIndexedDBAvailable()) {
    try {
      const database = await getDB();
      const transaction = database.transaction(['messages'], 'readonly');
      const store = transaction.objectStore('messages');
      const index = store.index('chatId');
      
      return new Promise((resolve, reject) => {
        const request = index.getAll(chatId);
        request.onsuccess = () => {
          const messages = request.result || [];
          // Sort by timestamp
          messages.sort((a, b) => a.timestamp - b.timestamp);
          resolve(messages);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.warn('IndexedDB message read failed, trying localStorage:', error);
      const cached = localStorage.getItem(`${MESSAGE_PREFIX}${chatId}`);
      return cached ? JSON.parse(cached) : [];
    }
  } else {
    const cached = localStorage.getItem(`${MESSAGE_PREFIX}${chatId}`);
    return cached ? JSON.parse(cached) : [];
  }
}

// Clear all cache
export async function clearCache(): Promise<void> {
  if (isIndexedDBAvailable()) {
    try {
      const database = await getDB();
      const transaction = database.transaction(['chats', 'messages'], 'readwrite');
      transaction.objectStore('chats').clear();
      transaction.objectStore('messages').clear();
    } catch (error) {
      console.warn('IndexedDB clear failed:', error);
    }
  }
  
  // Clear localStorage
  localStorage.removeItem(CHAT_LIST_KEY);
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.startsWith(MESSAGE_PREFIX)) {
      localStorage.removeItem(key);
    }
  });
}

