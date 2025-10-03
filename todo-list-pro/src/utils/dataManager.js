// utils/dataManager.js
import { initDB, addData, getAllData, getDataByUserId, updateData, deleteData } from './indexedDB';

const STORES = {
  TASKS: 'tasks',
  TAGS: 'tags'
};

// 保存用户任务
export const saveUserTasks = async (userId, tasks) => {
  try {
    // 先删除用户的所有任务
    const existingTasks = await getDataByUserId(STORES.TASKS, userId);
    for (const task of existingTasks) {
      await deleteData(STORES.TASKS, task.id);
    }
    
    // 逐个添加任务（包含用户ID）
    for (const task of tasks) {
      const taskWithUserId = { ...task, userId };
      await addData(STORES.TASKS, taskWithUserId);
    }
    
    return true;
  } catch (error) {
    console.error('保存用户任务失败:', error);
    return false;
  }
};

// 加载用户任务
export const loadUserTasks = async (userId) => {
  try {
    const tasks = await getDataByUserId(STORES.TASKS, userId);
    return tasks || [];
  } catch (error) {
    console.error('加载用户任务失败:', error);
    return [];
  }
};

// 保存用户标签
export const saveUserTags = async (userId, tags) => {
  try {
    // 先删除用户的所有标签
    const existingTags = await getDataByUserId(STORES.TAGS, userId);
    for (const tag of existingTags) {
      await deleteData(STORES.TAGS, tag.id);
    }
    
    // 逐个添加标签（包含用户ID）
    for (const tag of tags) {
      const tagWithUserId = { ...tag, userId };
      await addData(STORES.TAGS, tagWithUserId);
    }
    
    return true;
  } catch (error) {
    console.error('保存用户标签失败:', error);
    return false;
  }
};

// 加载用户标签
export const loadUserTags = async (userId) => {
  try {
    const tags = await getDataByUserId(STORES.TAGS, userId);
    return tags || [];
  } catch (error) {
    console.error('加载用户标签失败:', error);
    return [];
  }
};

// 添加用户任务
export const addUserTask = async (userId, task) => {
  try {
    const taskWithUserId = { ...task, userId };
    const result = await addData(STORES.TASKS, taskWithUserId);
    return result;
  } catch (error) {
    console.error('添加用户任务失败:', error);
    throw error;
  }
};

// 更新用户任务
export const updateUserTask = async (userId, taskId, updates) => {
  try {
    // 注意：这里需要先获取任务，然后更新
    const db = await initDB();
    const transaction = db.transaction([STORES.TASKS], 'readwrite');
    const store = transaction.objectStore(STORES.TASKS);
    const request = store.get(taskId);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const task = request.result;
        if (task && task.userId === userId) {
          const updatedTask = { ...task, ...updates };
          const updateRequest = store.put(updatedTask);
          updateRequest.onsuccess = () => resolve(updateRequest.result);
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          reject(new Error('任务不存在或无权限'));
        }
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('更新用户任务失败:', error);
    throw error;
  }
};

// 删除用户任务
export const deleteUserTask = async (userId, taskId) => {
  try {
    // 首先检查任务是否属于该用户
    const db = await initDB();
    const transaction = db.transaction([STORES.TASKS], 'readwrite');
    const store = transaction.objectStore(STORES.TASKS);
    const request = store.get(taskId);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const task = request.result;
        if (task && task.userId === userId) {
          const deleteRequest = store.delete(taskId);
          deleteRequest.onsuccess = () => resolve(deleteRequest.result);
          deleteRequest.onerror = () => reject(deleteRequest.error);
        } else {
          reject(new Error('任务不存在或无权限'));
        }
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('删除用户任务失败:', error);
    throw error;
  }
};

// 添加用户标签
export const addUserTag = async (userId, tag) => {
  try {
    const tagWithUserId = { ...tag, userId };
    const result = await addData(STORES.TAGS, tagWithUserId);
    return result;
  } catch (error) {
    console.error('添加用户标签失败:', error);
    throw error;
  }
};

// 更新用户标签
export const updateUserTag = async (userId, tagId, updates) => {
  try {
    // 首先检查标签是否属于该用户
    const db = await initDB();
    const transaction = db.transaction([STORES.TAGS], 'readwrite');
    const store = transaction.objectStore(STORES.TAGS);
    const request = store.get(tagId);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const tag = request.result;
        if (tag && tag.userId === userId) {
          const updatedTag = { ...tag, ...updates };
          const updateRequest = store.put(updatedTag);
          updateRequest.onsuccess = () => resolve(updateRequest.result);
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          reject(new Error('标签不存在或无权限'));
        }
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('更新用户标签失败:', error);
    throw error;
  }
};

// 删除用户标签
export const deleteUserTag = async (userId, tagId) => {
  try {
    // 首先检查标签是否属于该用户
    const db = await initDB();
    const transaction = db.transaction([STORES.TAGS], 'readwrite');
    const store = transaction.objectStore(STORES.TAGS);
    const request = store.get(tagId);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        const tag = request.result;
        if (tag && tag.userId === userId) {
          const deleteRequest = store.delete(tagId);
          deleteRequest.onsuccess = () => resolve(deleteRequest.result);
          deleteRequest.onerror = () => reject(deleteRequest.error);
        } else {
          reject(new Error('标签不存在或无权限'));
        }
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('删除用户标签失败:', error);
    throw error;
  }
};