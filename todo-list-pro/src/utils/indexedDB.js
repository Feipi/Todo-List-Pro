// db/indexedDB.js
const DB_NAME = 'TodoListProDB';
const DB_VERSION = 1;
const STORES = {
  TASKS: 'tasks',
  TAGS: 'tags',
  SETTINGS: 'settings'
};

// 数据库初始化
export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // 创建任务存储
      if (!db.objectStoreNames.contains(STORES.TASKS)) {
        const taskStore = db.createObjectStore(STORES.TASKS, { keyPath: 'id' });
        taskStore.createIndex('completed', 'completed', { unique: false });
        taskStore.createIndex('dueDate', 'dueDate', { unique: false });
      }
      
      // 创建标签存储
      if (!db.objectStoreNames.contains(STORES.TAGS)) {
        const tagStore = db.createObjectStore(STORES.TAGS, { keyPath: 'id' });
      }
      
      // 创建设置存储
      if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
        const settingStore = db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
      }
    };
  });
};

// 添加数据
export const addData = (storeName, data) => {
  return new Promise((resolve, reject) => {
    initDB().then(db => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    }).catch(reject);
  });
};

// 获取所有数据
export const getAllData = (storeName) => {
  return new Promise((resolve, reject) => {
    initDB().then(db => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    }).catch(reject);
  });
};

// 更新数据
export const updateData = (storeName, key, data) => {
  return new Promise((resolve, reject) => {
    initDB().then(db => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    }).catch(reject);
  });
};

// 删除数据
export const deleteData = (storeName, key) => {
  return new Promise((resolve, reject) => {
    initDB().then(db => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    }).catch(reject);
  });
};

// 清空存储
export const clearStore = (storeName) => {
  return new Promise((resolve, reject) => {
    initDB().then(db => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    }).catch(reject);
  });
};