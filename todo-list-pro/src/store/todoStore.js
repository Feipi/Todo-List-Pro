import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { loadTasksFromLocalStorage, saveTasksToLocalStorage, loadTagsFromLocalStorage, saveTagsToLocalStorage } from '../utils/storage';

// 创建任务存储
const useTodoStore = create(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // 状态定义
        tasks: [],
        tags: [],
        user: null,
        settings: {},
        
        // 初始化状态
        initialize: () => {
          // 从LocalStorage加载数据
          const tasks = loadTasksFromLocalStorage();
          const tags = loadTagsFromLocalStorage();
          set({ tasks, tags });
        },
        
        // 任务操作
        addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
        updateTask: (id, updates) => set((state) => ({
          tasks: state.tasks.map(task => 
            task.id === id ? { ...task, ...updates } : task
          )
        })),
        deleteTask: (id) => set((state) => ({
          tasks: state.tasks.filter(task => task.id !== id)
        })),
        toggleComplete: (id) => set((state) => ({
          tasks: state.tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
          )
        })),
        moveTask: (fromIndex, toIndex) => set((state) => {
          const updatedTasks = [...state.tasks];
          const [movedTask] = updatedTasks.splice(fromIndex, 1);
          updatedTasks.splice(toIndex, 0, movedTask);
          return { tasks: updatedTasks };
        }),
        batchUpdateTasks: (ids, updates) => set((state) => ({
          tasks: state.tasks.map(task => 
            ids.includes(task.id) ? { ...task, ...updates } : task
          )
        })),
        loadTasks: () => {
          const tasks = loadTasksFromLocalStorage();
          set({ tasks });
          return tasks;
        },
        syncTasks: () => {
          // 同步任务到LocalStorage
          const { tasks } = get();
          saveTasksToLocalStorage(tasks);
        },
        
        // 标签操作
        addTag: (tag) => set((state) => ({ tags: [...state.tags, tag] })),
        updateTag: (id, updates) => set((state) => ({
          tags: state.tags.map(tag => 
            tag.id === id ? { ...tag, ...updates } : tag
          )
        })),
        deleteTag: (id) => set((state) => ({
          tags: state.tags.filter(tag => tag.id !== id)
        })),
        loadTags: () => {
          const tags = loadTagsFromLocalStorage();
          set({ tags });
          return tags;
        },
        syncTags: () => {
          // 同步标签到LocalStorage
          const { tags } = get();
          saveTagsToLocalStorage(tags);
        },
        
        // 用户操作
        setUser: (user) => set({ user }),
        logout: () => set({ user: null }),
        
        // 设置操作
        updateSettings: (updates) => set((state) => ({
          settings: { ...state.settings, ...updates }
        }))
      }),
      {
        name: 'todo-storage', // 存储键名
        partialize: (state) => ({ 
          tasks: state.tasks, 
          tags: state.tags,
          settings: state.settings
        }), // 持久化部分状态
        onRehydrateStorage: () => (state) => {
          // 数据加载完成后的回调
          if (state) {
            // 同步到LocalStorage以确保数据一致性
            saveTasksToLocalStorage(state.tasks);
            saveTagsToLocalStorage(state.tags);
          }
        }
      }
    )
  )
);

export default useTodoStore;