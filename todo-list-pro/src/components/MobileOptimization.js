import React, { useState, useEffect } from 'react';
import { Card, Button, List, Typography, Input, Checkbox, Tag, message } from 'antd';
import { 
  PlusOutlined, 
  DeleteOutlined, 
  EditOutlined, 
  CheckOutlined,
  CloseOutlined,
  SwapOutlined
} from '@ant-design/icons';
import { loadTasksFromLocalStorage, saveTasksToLocalStorage } from '../utils/storage';

const { Title, Text } = Typography;

const MobileOptimization = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  // 组件挂载时从LocalStorage加载任务
  useEffect(() => {
    const loadedTasks = loadTasksFromLocalStorage();
    setTasks(loadedTasks);
  }, []);

  // 任务数据变化时保存到LocalStorage
  useEffect(() => {
    saveTasksToLocalStorage(tasks);
  }, [tasks]);

  // 添加任务
  const addTask = () => {
    if (newTask.trim() !== '') {
      const task = {
        id: Date.now(),
        title: newTask,
        completed: false,
        createdAt: new Date().toISOString()
      };
      setTasks([...tasks, task]);
      setNewTask('');
    }
  };

  // 删除任务
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // 切换任务完成状态
  const toggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  // 开始编辑任务
  const startEdit = (task) => {
    setEditingTask(task.id);
    setEditTitle(task.title);
  };

  // 保存编辑
  const saveEdit = () => {
    if (editTitle.trim() !== '') {
      setTasks(tasks.map(task => 
        task.id === editingTask ? { ...task, title: editTitle } : task
      ));
      setEditingTask(null);
      setEditTitle('');
    }
  };

  // 取消编辑
  const cancelEdit = () => {
    setEditingTask(null);
    setEditTitle('');
  };

  // 手势操作模拟
  const handleSwipeLeft = (id) => {
    // 模拟左滑删除
    deleteTask(id);
    message.success('任务已删除');
  };

  const handleSwipeRight = (id) => {
    // 模拟右滑完成
    toggleComplete(id);
    const task = tasks.find(t => t.id === id);
    message.success(task.completed ? '任务标记为未完成' : '任务标记为已完成');
  };

  // 长按编辑
  const handleLongPress = (task) => {
    startEdit(task);
  };

  return (
    <Card title="移动端优化" style={{ margin: '20px 0' }}>
      <div style={{ marginBottom: '20px' }}>
        <Input
          placeholder="添加新任务"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onPressEnter={addTask}
          suffix={
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={addTask}
              size="small"
            />
          }
        />
      </div>
      
      <List
        dataSource={tasks}
        renderItem={task => (
          <List.Item
            actions={[
              editingTask === task.id ? (
                <>
                  <Button 
                    icon={<CheckOutlined />} 
                    onClick={saveEdit}
                    type="primary"
                    size="small"
                  />
                  <Button 
                    icon={<CloseOutlined />} 
                    onClick={cancelEdit}
                    size="small"
                  />
                </>
              ) : (
                <>
                  <Button 
                    icon={<EditOutlined />} 
                    onClick={() => startEdit(task)}
                    size="small"
                  />
                  <Button 
                    icon={<DeleteOutlined />} 
                    onClick={() => deleteTask(task.id)}
                    danger
                    size="small"
                  />
                </>
              )
            ]}
          >
            {editingTask === task.id ? (
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onPressEnter={saveEdit}
                style={{ flex: 1 }}
              />
            ) : (
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  width: '100%'
                }}
                onDoubleClick={() => handleLongPress(task)} // 模拟长按
              >
                <Checkbox 
                  checked={task.completed} 
                  onChange={() => toggleComplete(task.id)}
                  style={{ marginRight: '10px' }}
                />
                <div style={{ flex: 1 }}>
                  <Title 
                    level={5} 
                    style={{ 
                      textDecoration: task.completed ? 'line-through' : 'none',
                      margin: 0
                    }}
                  >
                    {task.title}
                  </Title>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {new Date(task.createdAt).toLocaleString()}
                  </Text>
                </div>
                <div>
                  <Button 
                    icon={<SwapOutlined />} 
                    onClick={() => handleSwipeRight(task.id)}
                    size="small"
                    style={{ marginRight: '5px' }}
                  >
                    完成
                  </Button>
                  <Button 
                    icon={<DeleteOutlined />} 
                    onClick={() => handleSwipeLeft(task.id)}
                    danger
                    size="small"
                  >
                    删除
                  </Button>
                </div>
              </div>
            )}
          </List.Item>
        )}
      />
      
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f2f5', borderRadius: '4px' }}>
        <Title level={5}>移动端功能说明</Title>
        <ul>
          <li>左右滑动任务项可快速操作</li>
          <li>双击任务项可快速编辑</li>
          <li>响应式设计适配各种屏幕尺寸</li>
          <li>简化操作流程，提升移动体验</li>
        </ul>
      </div>
    </Card>
  );
};

export default MobileOptimization;