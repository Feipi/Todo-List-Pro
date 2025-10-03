const DB_NAME = 'TodoListProDB';
const DB_VERSION = 4; // 增加版本号以触发升级
const STORES = {
  TASKS: 'tasks',
  TAGS: 'tags',
  SETTINGS: 'settings',
  USERS: 'users'
};

// 当前数据库版本
let currentDB = null;

// 数据库初始化
export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      currentDB = request.result;
      resolve(request.result);
    };
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // 创建任务存储
      if (!db.objectStoreNames.contains(STORES.TASKS)) {
        const taskStore = db.createObjectStore(STORES.TASKS, { keyPath: 'id' });
        taskStore.createIndex('completed', 'completed', { unique: false });
        taskStore.createIndex('dueDate', 'dueDate', { unique: false });
        taskStore.createIndex('userId', 'userId', { unique: false }); // 添加用户ID索引
      } else {
        // 如果存储已存在，检查并添加缺失的索引
        const transaction = event.target.transaction;
        const taskStore = transaction.objectStore(STORES.TASKS);
        
        if (!taskStore.indexNames.contains('userId')) {
          taskStore.createIndex('userId', 'userId', { unique: false });
        }
      }
      
      // 创建标签存储
      if (!db.objectStoreNames.contains(STORES.TAGS)) {
        const tagStore = db.createObjectStore(STORES.TAGS, { keyPath: 'id' });
        tagStore.createIndex('userId', 'userId', { unique: false }); // 添加用户ID索引
      } else {
        // 如果存储已存在，检查并添加缺失的索引
        const transaction = event.target.transaction;
        const tagStore = transaction.objectStore(STORES.TAGS);
        
        if (!tagStore.indexNames.contains('userId')) {
          tagStore.createIndex('userId', 'userId', { unique: false });
        }
      }
      
      // 创建设置存储
      if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
        const settingStore = db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
      }
      
      // 创建用户存储
      if (!db.objectStoreNames.contains(STORES.USERS)) {
        const userStore = db.createObjectStore(STORES.USERS, { keyPath: 'id' });
        userStore.createIndex('username', 'username', { unique: true });
        userStore.createIndex('email', 'email', { unique: true });
      }
    };
  });
};

// 获取数据库实例
export const getDB = () => {
  return currentDB;
};

// 添加数据
export const addData = (storeName, data) => {
  return new Promise((resolve, reject) => {
    const dbPromise = currentDB ? Promise.resolve(currentDB) : initDB();
    
    dbPromise.then(db => {
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
    const dbPromise = currentDB ? Promise.resolve(currentDB) : initDB();
    
    dbPromise.then(db => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    }).catch(reject);
  });
};

// 根据用户ID获取数据
export const getDataByUserId = (storeName, userId) => {
  return new Promise((resolve, reject) => {
    const dbPromise = currentDB ? Promise.resolve(currentDB) : initDB();
    
    dbPromise.then(db => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      
      // 检查索引是否存在
      if (store.indexNames.contains('userId')) {
        const index = store.index('userId');
        const request = index.getAll(userId);
        
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      } else {
        // 如果索引不存在，获取所有数据并过滤
        const request = store.getAll();
        
        request.onsuccess = () => {
          const allData = request.result;
          const filteredData = allData.filter(item => item.userId === userId);
          resolve(filteredData);
        };
        request.onerror = () => reject(request.error);
      }
    }).catch(reject);
  });
};

// 更新数据
export const updateData = (storeName, key, data) => {
  return new Promise((resolve, reject) => {
    const dbPromise = currentDB ? Promise.resolve(currentDB) : initDB();
    
    dbPromise.then(db => {
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
    const dbPromise = currentDB ? Promise.resolve(currentDB) : initDB();
    
    dbPromise.then(db => {
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
    const dbPromise = currentDB ? Promise.resolve(currentDB) : initDB();
    
    dbPromise.then(db => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    }).catch(reject);
  });
};

// 创建用户特定的存储
export const createUserStores = (userId) => {
  return new Promise((resolve, reject) => {
    // 在实际应用中，可能需要增加数据库版本并重新打开数据库来创建新存储
    // 这里我们简化处理，假设存储已经存在或将在需要时创建
    resolve();
  });
};