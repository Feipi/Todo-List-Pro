# To-Do List Pro

一款轻量化、人性化、高适配性的个人任务管理工具。

## 功能特性

### V1.0 基础功能
- ✅ 任务添加、编辑、删除、标记完成/未完成
- ✅ 标签管理（创建、编辑、删除、颜色设置）
- ✅ 本地数据存储（LocalStorage）
- ✅ 任务拖拽排序

### V2.0 进阶功能
- ✅ 任务优先级设置（高/中/低）
- ✅ 任务提醒功能（自定义提醒时间，浏览器通知）
- ✅ 用户登录/注册（JWT身份验证模拟）
- ✅ 任务搜索与筛选（关键词搜索、标签筛选）
- ✅ 统计分析（任务统计、优先级分布）

### V3.0 状态管理优化（当前版本）
- ✅ Zustand状态管理替代React原生状态
- ✅ IndexedDB数据持久化替代LocalStorage
- ✅ 增强的云同步功能
- ✅ 性能优化（虚拟滚动、记忆化等）
- ✅ 完整的架构重构

## 技术栈

- React 19
- Ant Design 5
- Zustand（状态管理）
- react-dnd（拖拽功能）
- moment.js（日期处理）

## 安装与运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm start
```

## 使用说明

1. 首次使用需要注册/登录账户
2. 在"任务管理"页面可以添加、编辑、删除任务
3. 在"标签管理"页面可以管理任务标签
4. 在"统计分析"页面可以查看任务统计数据
5. 在"云同步"页面可以同步数据到服务器

## 项目结构

```
src/
├── components/          # 组件目录
│   ├── TaskManager.js   # 任务管理组件
│   ├── TagManager.js    # 标签管理组件
│   ├── Statistics.js    # 统计分析组件
│   └── Login.js         # 登录组件
├── store/               # Zustand状态存储
│   └── todoStore.js     # 主要状态存储
├── hooks/               # 自定义Hooks
│   ├── useEnhancedStorage.js  # 增强存储Hook
│   └── useTaskPerformance.js  # 性能优化Hook
├── services/            # 服务层
│   ├── syncService.js   # 数据同步服务
│   └── apiService.js    # API服务模拟
├── utils/               # 工具函数
│   ├── storage.js       # 本地存储工具
│   ├── indexedDB.js     # IndexedDB操作工具
│   └── encryption.js    # 数据加密工具
├── examples/            # 使用示例
│   └── TaskManagerExample.js  # 任务管理示例
├── App.js               # 主应用组件
└── index.js             # 入口文件
```

## 开发计划

### V3.0 人性化优化（待实现）
- 任务模板库
- 智能联想输入
- 批量操作
- 任务难度与情绪标注
- 个性化时间视图
- 逾期任务智能疏导
- 任务依赖提醒
- 轻量化复盘
- 语音录入
- 多人协作轻量化支持
- 设备适配优化
- 自定义快捷键和第三方联动

## 项目特点

- 单人开发可控：技术栈轻量且模块化，支持分阶段迭代
- 实用性优先：功能聚焦"真实使用场景"，避免冗余设计
- 人性化体验：从操作、情绪、习惯多维度适配用户
- 现代化架构：采用Zustand状态管理，提升性能和可维护性