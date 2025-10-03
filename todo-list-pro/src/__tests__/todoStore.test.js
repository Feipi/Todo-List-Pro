// __tests__/todoStore.test.js
import useTodoStore from '../store/todoStore';

// 清除所有模拟
afterEach(() => {
  useTodoStore.getState().logout();
});

describe('Todo Store', () => {
  test('should initialize with empty tasks and tags', () => {
    const { tasks, tags } = useTodoStore.getState();
    expect(tasks).toEqual([]);
    expect(tags).toEqual([]);
  });

  test('should add a task', () => {
    const newTask = {
      id: 1,
      title: 'Test Task',
      description: 'Test Description',
      completed: false,
      dueDate: '2025-10-10',
      priority: 'medium',
      remindTime: '09:00',
      tagIds: [1],
      subTasks: [],
      dependencies: [],
      projectId: null,
      comments: []
    };

    useTodoStore.getState().addTask(newTask);
    const { tasks } = useTodoStore.getState();
    
    expect(tasks).toHaveLength(1);
    expect(tasks[0]).toEqual(newTask);
  });

  test('should update a task', () => {
    const initialTask = {
      id: 1,
      title: 'Test Task',
      description: 'Test Description',
      completed: false,
      dueDate: '2025-10-10',
      priority: 'medium',
      remindTime: '09:00',
      tagIds: [1],
      subTasks: [],
      dependencies: [],
      projectId: null,
      comments: []
    };

    useTodoStore.getState().addTask(initialTask);
    
    const updates = { completed: true, title: 'Updated Task' };
    useTodoStore.getState().updateTask(1, updates);
    
    const { tasks } = useTodoStore.getState();
    expect(tasks[0].completed).toBe(true);
    expect(tasks[0].title).toBe('Updated Task');
  });

  test('should delete a task', () => {
    const task1 = { id: 1, title: 'Task 1' };
    const task2 = { id: 2, title: 'Task 2' };

    useTodoStore.getState().addTask(task1);
    useTodoStore.getState().addTask(task2);
    
    useTodoStore.getState().deleteTask(1);
    
    const { tasks } = useTodoStore.getState();
    expect(tasks).toHaveLength(1);
    expect(tasks[0].id).toBe(2);
  });

  test('should toggle task completion', () => {
    const task = {
      id: 1,
      title: 'Test Task',
      completed: false
    };

    useTodoStore.getState().addTask(task);
    useTodoStore.getState().toggleComplete(1);
    
    const { tasks } = useTodoStore.getState();
    expect(tasks[0].completed).toBe(true);
  });

  test('should add a tag', () => {
    const newTag = {
      id: 1,
      name: 'Test Tag',
      color: '#1890ff'
    };

    useTodoStore.getState().addTag(newTag);
    const { tags } = useTodoStore.getState();
    
    expect(tags).toHaveLength(1);
    expect(tags[0]).toEqual(newTag);
  });

  test('should update a tag', () => {
    const initialTag = {
      id: 1,
      name: 'Test Tag',
      color: '#1890ff'
    };

    useTodoStore.getState().addTag(initialTag);
    
    const updates = { name: 'Updated Tag', color: '#52c41a' };
    useTodoStore.getState().updateTag(1, updates);
    
    const { tags } = useTodoStore.getState();
    expect(tags[0].name).toBe('Updated Tag');
    expect(tags[0].color).toBe('#52c41a');
  });

  test('should delete a tag', () => {
    const tag1 = { id: 1, name: 'Tag 1', color: '#1890ff' };
    const tag2 = { id: 2, name: 'Tag 2', color: '#52c41a' };

    useTodoStore.getState().addTag(tag1);
    useTodoStore.getState().addTag(tag2);
    
    useTodoStore.getState().deleteTag(1);
    
    const { tags } = useTodoStore.getState();
    expect(tags).toHaveLength(1);
    expect(tags[0].id).toBe(2);
  });

  test('should set user', () => {
    const user = {
      id: 'user1',
      username: 'testuser',
      email: 'test@example.com'
    };

    useTodoStore.getState().setUser(user);
    const { user: storedUser } = useTodoStore.getState();
    
    expect(storedUser).toEqual(user);
  });

  test('should logout user', () => {
    const user = {
      id: 'user1',
      username: 'testuser',
      email: 'test@example.com'
    };

    useTodoStore.getState().setUser(user);
    useTodoStore.getState().logout();
    
    const { user: storedUser } = useTodoStore.getState();
    expect(storedUser).toBeNull();
  });
});