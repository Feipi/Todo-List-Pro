// services/syncService.js
import { getAllData, addData, updateData, deleteData, getDataByUserId } from '../utils/indexedDB';
import useTodoStore from '../store/todoStore';
import ApiService from './apiService';

// 模拟API端点
const API_BASE_URL = '/api';

// 同步状态
const syncStatus = {
  isSyncing: false,
  lastSync: null,
  error: null
};

// 检查网络连接
const isOnline = () => {
  return navigator.onLine;
};

// 同步任务到服务器
export const syncTasksToServer = async (tasks) => {
  if (!isOnline()) {
    throw new Error('无网络连接');
  }

  try {
    const response = await ApiService.syncTasks(tasks);
    return response;
  } catch (error) {
    throw new Error(`网络错误: ${error.message}`);
  }
};

// 从服务器获取任务
export const fetchTasksFromServer = async () => {
  if (!isOnline()) {
    throw new Error('无网络连接');
  }

  try {
    const response = await ApiService.getTasks();
    return response.data;
  } catch (error) {
    throw new Error(`网络错误: ${error.message}`);
  }
};

// 同步标签到服务器
export const syncTagsToServer = async (tags) => {
  if (!isOnline()) {
    throw new Error('无网络连接');
  }

  try {
    const response = await ApiService.syncTags(tags);
    return response;
  } catch (error) {
    throw new Error(`网络错误: ${error.message}`);
  }
};

// 从服务器获取标签
export const fetchTagsFromServer = async () => {
  if (!isOnline()) {
    throw new Error('无网络连接');
  }

  try {
    const response = await ApiService.getTags();
    return response.data;
  } catch (error) {
    throw new Error(`网络错误: ${error.message}`);
  }
};

// 解决冲突 - 本地优先策略
const resolveConflicts = (localData, remoteData) => {
  // 简单的冲突解决策略：本地数据优先
  // 在实际应用中，可能需要更复杂的冲突解决逻辑
  return localData;
};

// 完整同步流程
export const performFullSync = async (localTasks, localTags) => {
  if (syncStatus.isSyncing) {
    return { success: false, message: '同步已在进行中' };
  }

  syncStatus.isSyncing = true;
  syncStatus.error = null;

  try {
    // 同步任务
    let remoteTasks = [];
    try {
      remoteTasks = await fetchTasksFromServer();
      // 合并本地和远程任务
      const mergedTasks = resolveConflicts(localTasks, remoteTasks);
      // 同步回服务器
      await syncTasksToServer(mergedTasks);
    } catch (error) {
      console.warn('任务同步失败:', error.message);
    }

    // 同步标签
    let remoteTags = [];
    try {
      remoteTags = await fetchTagsFromServer();
      // 合并本地和远程标签
      const mergedTags = resolveConflicts(localTags, remoteTags);
      // 同步回服务器
      await syncTagsToServer(mergedTags);
    } catch (error) {
      console.warn('标签同步失败:', error.message);
    }

    syncStatus.lastSync = new Date();
    return { success: true, message: '同步完成' };
  } catch (error) {
    syncStatus.error = error.message;
    return { success: false, message: error.message };
  } finally {
    syncStatus.isSyncing = false;
  }
};

// 同步到IndexedDB（使用用户特定的数据）
export const syncToIndexedDB = async (tasks, tags) => {
  try {
    // 获取当前用户
    const user = useTodoStore.getState().user;
    if (!user) {
      return { success: false, error: '用户未登录' };
    }
    
    // 清空当前用户的数据
    // 注意：这里应该使用用户特定的清理方法，但我们已经在dataManager中处理了
    
    // 添加任务到IndexedDB（包含用户ID）
    for (const task of tasks) {
      try {
        const taskWithUserId = { ...task, userId: user.id };
        await addData('tasks', taskWithUserId);
      } catch (error) {
        if (error.name === 'ConstraintError') {
          // 如果是主键冲突，尝试更新而不是添加
          try {
            const taskWithUserId = { ...task, userId: user.id };
            await updateData('tasks', task.id, taskWithUserId);
          } catch (updateError) {
            console.warn('更新任务到IndexedDB失败:', updateError);
          }
        } else {
          console.warn('添加任务到IndexedDB失败:', error);
        }
      }
    }
    
    // 添加标签到IndexedDB（包含用户ID）
    for (const tag of tags) {
      try {
        const tagWithUserId = { ...tag, userId: user.id };
        await addData('tags', tagWithUserId);
      } catch (error) {
        if (error.name === 'ConstraintError') {
          // 如果是主键冲突，尝试更新而不是添加
          try {
            const tagWithUserId = { ...tag, userId: user.id };
            await updateData('tags', tag.id, tagWithUserId);
          } catch (updateError) {
            console.warn('更新标签到IndexedDB失败:', updateError);
          }
        } else {
          console.warn('添加标签到IndexedDB失败:', error);
        }
      }
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// 从IndexedDB加载数据（使用用户特定的数据）
export const loadFromIndexedDB = async () => {
  try {
    // 获取当前用户
    const user = useTodoStore.getState().user;
    if (!user) {
      return { tasks: [], tags: [] };
    }
    
    const tasks = await getDataByUserId('tasks', user.id);
    const tags = await getDataByUserId('tags', user.id);
    return { tasks, tags };
  } catch (error) {
    console.error('从IndexedDB加载数据失败:', error);
    return { tasks: [], tags: [] };
  }
};

export default {
  syncStatus,
  performFullSync,
  syncToIndexedDB,
  loadFromIndexedDB
};