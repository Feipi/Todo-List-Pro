// services/apiService.js
// 模拟后端API服务

// 模拟任务数据
let mockTasks = [
  {
    id: 1,
    title: '学习React状态管理',
    description: '深入学习Zustand状态管理库的使用',
    completed: true,
    dueDate: '2025-10-15',
    priority: 'high',
    remindTime: '09:00',
    tagIds: [1, 2],
    subTasks: [],
    dependencies: [],
    projectId: null,
    comments: [],
    userId: 'user1',
    createdAt: '2025-10-01T08:00:00Z',
    updatedAt: '2025-10-01T08:00:00Z'
  },
  {
    id: 2,
    title: '完成项目设计文档',
    description: '编写完整的项目设计文档',
    completed: false,
    dueDate: '2025-10-10',
    priority: 'medium',
    remindTime: '14:00',
    tagIds: [3],
    subTasks: [
      { id: 1, title: '概述部分', completed: true },
      { id: 2, title: '技术栈选型', completed: true },
      { id: 3, title: '架构设计', completed: false }
    ],
    dependencies: [1],
    projectId: null,
    comments: [
      { id: 1, content: '需要进一步完善架构设计部分', createdAt: '2025-10-01T10:00:00Z', userId: 'user1' }
    ],
    userId: 'user1',
    createdAt: '2025-10-01T09:00:00Z',
    updatedAt: '2025-10-01T09:00:00Z'
  },
  {
    id: 3,
    title: '实现数据持久化',
    description: '将LocalStorage替换为IndexedDB',
    completed: false,
    dueDate: '2025-10-20',
    priority: 'high',
    remindTime: '11:00',
    tagIds: [1, 4],
    subTasks: [],
    dependencies: [2],
    projectId: null,
    comments: [],
    userId: 'user1',
    createdAt: '2025-10-01T10:00:00Z',
    updatedAt: '2025-10-01T10:00:00Z'
  }
];

// 模拟标签数据
let mockTags = [
  { id: 1, name: '前端开发', color: '#1890ff' },
  { id: 2, name: '学习', color: '#52c41a' },
  { id: 3, name: '文档编写', color: '#faad14' },
  { id: 4, name: '优化', color: '#722ed1' }
];

// 模拟用户数据
let mockUsers = [
  { id: 'user1', username: 'admin', email: 'admin@example.com', avatar: null, preferences: {} }
];

// 模拟设置数据
let mockSettings = {
  theme: 'light',
  layout: 'default',
  notifications: true
};

// API服务类
class ApiService {
  // 任务相关API
  static async getTasks() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data: mockTasks });
      }, 500);
    });
  }

  static async createTask(taskData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTask = {
          ...taskData,
          id: Date.now(),
          userId: 'user1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        mockTasks.push(newTask);
        resolve({ success: true, data: newTask });
      }, 300);
    });
  }

  static async updateTask(id, updates) {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockTasks = mockTasks.map(task => 
          task.id === id ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task
        );
        const updatedTask = mockTasks.find(task => task.id === id);
        resolve({ success: true, data: updatedTask });
      }, 300);
    });
  }

  static async deleteTask(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockTasks = mockTasks.filter(task => task.id !== id);
        resolve({ success: true, message: '任务删除成功' });
      }, 300);
    });
  }

  static async syncTasks(tasks) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 简单的同步逻辑：用新数据替换旧数据
        mockTasks = tasks;
        resolve({ success: true, message: '任务同步成功' });
      }, 800);
    });
  }

  // 标签相关API
  static async getTags() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data: mockTags });
      }, 500);
    });
  }

  static async createTag(tagData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTag = {
          ...tagData,
          id: Date.now()
        };
        mockTags.push(newTag);
        resolve({ success: true, data: newTag });
      }, 300);
    });
  }

  static async updateTag(id, updates) {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockTags = mockTags.map(tag => 
          tag.id === id ? { ...tag, ...updates } : tag
        );
        const updatedTag = mockTags.find(tag => tag.id === id);
        resolve({ success: true, data: updatedTag });
      }, 300);
    });
  }

  static async deleteTag(id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockTags = mockTags.filter(tag => tag.id !== id);
        resolve({ success: true, message: '标签删除成功' });
      }, 300);
    });
  }

  static async syncTags(tags) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // 简单的同步逻辑：用新数据替换旧数据
        mockTags = tags;
        resolve({ success: true, message: '标签同步成功' });
      }, 800);
    });
  }

  // 用户相关API
  static async login(credentials) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 简单的登录验证
        if (credentials.username === 'admin' && credentials.password === 'password') {
          const user = mockUsers[0];
          resolve({ success: true, data: user });
        } else {
          reject(new Error('用户名或密码错误'));
        }
      }, 500);
    });
  }

  static async logout() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: '退出登录成功' });
      }, 300);
    });
  }

  static async getUser() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data: mockUsers[0] });
      }, 500);
    });
  }

  // 设置相关API
  static async getSettings() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, data: mockSettings });
      }, 500);
    });
  }

  static async updateSettings(updates) {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockSettings = { ...mockSettings, ...updates };
        resolve({ success: true, data: mockSettings });
      }, 300);
    });
  }
}

export default ApiService;