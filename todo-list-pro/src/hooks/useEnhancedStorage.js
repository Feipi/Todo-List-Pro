// hooks/useEnhancedStorage.js
import { useEffect, useCallback } from 'react';
import useTodoStore from '../store/todoStore';
import { syncToIndexedDB, loadFromIndexedDB, performFullSync } from '../services/syncService';

// 自定义hook用于增强存储功能
const useEnhancedStorage = () => {
  const tasks = useTodoStore(state => state.tasks);
  const tags = useTodoStore(state => state.tags);
  const initializeStore = useTodoStore(state => state.initialize);
  const syncTasks = useTodoStore(state => state.syncTasks);
  const syncTags = useTodoStore(state => state.syncTags);

  // 同步到IndexedDB
  const syncToPersistentStorage = useCallback(async () => {
    try {
      // 同步到LocalStorage（通过store middleware）
      syncTasks();
      syncTags();
      
      // 同步到IndexedDB
      await syncToIndexedDB(tasks, tags);
    } catch (error) {
      console.error('同步到持久化存储失败:', error);
    }
  }, [tasks, tags, syncTasks, syncTags]);

  // 从持久化存储加载
  const loadFromPersistentStorage = useCallback(async () => {
    try {
      // 首先尝试从IndexedDB加载
      const { tasks: indexedDBTasks, tags: indexedDBTags } = await loadFromIndexedDB();
      
      if (indexedDBTasks.length > 0 || indexedDBTags.length > 0) {
        // 如果IndexedDB中有数据，使用这些数据初始化store
        useTodoStore.setState({ tasks: indexedDBTasks, tags: indexedDBTags });
      } else {
        // 否则从LocalStorage加载
        initializeStore();
      }
    } catch (error) {
      console.error('从持久化存储加载失败:', error);
      // 降级到LocalStorage
      initializeStore();
    }
  }, [initializeStore]);

  // 执行完整同步
  const performSynchronization = useCallback(async () => {
    try {
      const result = await performFullSync(tasks, tags);
      return result;
    } catch (error) {
      console.error('同步失败:', error);
      return { success: false, message: error.message };
    }
  }, [tasks, tags]);

  // 监听数据变化并自动同步
  useEffect(() => {
    // 防抖处理，避免频繁同步
    const debounceTimer = setTimeout(() => {
      syncToPersistentStorage();
    }, 1000);

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [tasks, tags, syncToPersistentStorage]);

  // 页面可见性变化时同步
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        syncToPersistentStorage();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [syncToPersistentStorage]);

  // 窗口失去焦点时同步
  useEffect(() => {
    const handleBlur = () => {
      syncToPersistentStorage();
    };

    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('blur', handleBlur);
    };
  }, [syncToPersistentStorage]);

  return {
    loadFromPersistentStorage,
    syncToPersistentStorage,
    performSynchronization
  };
};

export default useEnhancedStorage;