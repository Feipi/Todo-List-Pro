import { create } from 'zustand';
import { persist, subscribeWithSelector } from 'zustand/middleware';
import { loadCurrentUser } from '../utils/userDB';
import { loadUserTasks, saveUserTasks, loadUserTags, saveUserTags, addUserTask, updateUserTask, deleteUserTask, addUserTag, updateUserTag, deleteUserTag } from '../utils/dataManager';

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
        initialize: async () => {
          // 从LocalStorage加载当前用户
          const currentUser = loadCurrentUser();
          if (currentUser) {
            set({ user: currentUser });
            
            // 加载用户特定的数据
            await get().loadUserData();
          }
        },
        
        // 加载用户数据
        loadUserData: async () => {
          const { user } = get();
          if (!user) return;
          
          try {
            // 加载用户任务
            const tasks = await loadUserTasks(user.id);
            // 加载用户标签
            const tags = await loadUserTags(user.id);
            
            set({ tasks, tags });
          } catch (error) {
            console.error('加载用户数据失败:', error);
          }
        },
        
        // 保存用户数据
        saveUserData: async () => {
          const { user, tasks, tags } = get();
          if (!user) return;
          
          try {
            // 保存用户任务
            await saveUserTasks(user.id, tasks);
            // 保存用户标签
            await saveUserTags(user.id, tags);
          } catch (error) {
            console.error('保存用户数据失败:', error);
          }
        },
        
        // 任务操作
        addTask: (task) => set((state) => {
          const newTasks = [...state.tasks, task];
          // 保存到IndexedDB
          if (state.user) {
            addUserTask(state.user.id, task).catch(error => {
              console.error('添加任务到IndexedDB失败:', error);
            });
          }
          return { tasks: newTasks };
        }),
        updateTask: (id, updates) => set((state) => {
          const newTasks = state.tasks.map(task => 
            task.id === id ? { ...task, ...updates } : task
          );
          // 保存到IndexedDB
          if (state.user) {
            updateUserTask(state.user.id, id, updates).catch(error => {
              console.error('更新任务到IndexedDB失败:', error);
            });
          }
          return { tasks: newTasks };
        }),
        deleteTask: (id) => set((state) => {
          const newTasks = state.tasks.filter(task => task.id !== id);
          // 保存到IndexedDB
          if (state.user) {
            deleteUserTask(state.user.id, id).catch(error => {
              console.error('删除任务到IndexedDB失败:', error);
            });
          }
          return { tasks: newTasks };
        }),
        toggleComplete: (id) => set((state) => {
          const newTasks = state.tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
          );
          // 保存到IndexedDB
          if (state.user) {
            const task = state.tasks.find(t => t.id === id);
            if (task) {
              updateUserTask(state.user.id, id, { completed: !task.completed }).catch(error => {
                console.error('更新任务完成状态到IndexedDB失败:', error);
              });
            }
          }
          return { tasks: newTasks };
        }),
        moveTask: (fromIndex, toIndex) => set((state) => {
          const updatedTasks = [...state.tasks];
          const [movedTask] = updatedTasks.splice(fromIndex, 1);
          updatedTasks.splice(toIndex, 0, movedTask);
          // 保存到IndexedDB
          if (state.user) {
            setTimeout(() => {
              state.saveUserData();
            }, 0);
          }
          return { tasks: updatedTasks };
        }),
        batchUpdateTasks: (ids, updates) => set((state) => {
          const newTasks = state.tasks.map(task => 
            ids.includes(task.id) ? { ...task, ...updates } : task
          );
          // 保存到IndexedDB
          if (state.user) {
            setTimeout(() => {
              state.saveUserData();
            }, 0);
          }
          return { tasks: newTasks };
        }),
        loadTasks: () => {
          // 任务加载逻辑
          return [];
        },
        syncTasks: () => {
          // 任务同步逻辑
        },
        
        // 标签操作
        addTag: (tag) => set((state) => {
          const newTags = [...state.tags, tag];
          // 保存到IndexedDB
          if (state.user) {
            addUserTag(state.user.id, tag).catch(error => {
              console.error('添加标签到IndexedDB失败:', error);
            });
          }
          return { tags: newTags };
        }),
        updateTag: (id, updates) => set((state) => {
          const newTags = state.tags.map(tag => 
            tag.id === id ? { ...tag, ...updates } : tag
          );
          // 保存到IndexedDB
          if (state.user) {
            updateUserTag(state.user.id, id, updates).catch(error => {
              console.error('更新标签到IndexedDB失败:', error);
            });
          }
          return { tags: newTags };
        }),
        deleteTag: (id) => set((state) => {
          const newTags = state.tags.filter(tag => tag.id !== id);
          // 保存到IndexedDB
          if (state.user) {
            deleteUserTag(state.user.id, id).catch(error => {
              console.error('删除标签到IndexedDB失败:', error);
            });
          }
          return { tags: newTags };
        }),
        loadTags: () => {
          // 标签加载逻辑
          return [];
        },
        syncTags: () => {
          // 标签同步逻辑
        },
        
        // 用户操作
        setUser: (user) => set({ user }),
        logout: () => set({ user: null, tasks: [], tags: [] }),
        
        // 设置操作
        updateSettings: (updates) => set((state) => ({
          settings: { ...state.settings, ...updates }
        }))
      }),
      {
        name: 'todo-storage', // 存储键名
        partialize: (state) => ({ 
          user: state.user,
          settings: state.settings
        }), // 持久化部分状态
        onRehydrateStorage: () => (state) => {
          // 数据加载完成后的回调
          if (state) {
            // 初始化用户状态
            state.initialize();
          }
        }
      }
    )
  )
);

export default useTodoStore;