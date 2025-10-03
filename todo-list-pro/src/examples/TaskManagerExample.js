// examples/TaskManagerExample.js
import React from 'react';
import { Card, Button, List, Typography, Tag, Space } from 'antd';
import { PlusOutlined, CheckCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import useTodoStore from '../store/todoStore';
import useTaskPerformance from '../hooks/useTaskPerformance';
import useEnhancedStorage from '../hooks/useEnhancedStorage';

const { Title, Text } = Typography;

// 任务管理示例组件
const TaskManagerExample = () => {
  const tasks = useTodoStore(state => state.tasks);
  const addTask = useTodoStore(state => state.addTask);
  const toggleComplete = useTodoStore(state => state.toggleComplete);
  
  const { taskStatistics, useTaskFilter } = useTaskPerformance();
  const { loadFromPersistentStorage } = useEnhancedStorage();
  
  const { filteredTasks, filters, updateFilters } = useTaskFilter();
  
  // 初始化数据
  React.useEffect(() => {
    loadFromPersistentStorage();
    
    // 添加一些示例任务
    if (tasks.length === 0) {
      const sampleTasks = [
        {
          id: 1,
          title: '学习React状态管理',
          description: '深入了解Zustand状态管理库',
          completed: true,
          dueDate: '2025-10-15',
          priority: 'high',
          remindTime: '09:00',
          tagIds: [1, 2],
          subTasks: [],
          dependencies: [],
          projectId: null,
          comments: []
        },
        {
          id: 2,
          title: '完成项目设计文档',
          description: '编写完整的项目设计文档',
          completed: false,
          dueDate: '2025-10-20',
          priority: 'medium',
          remindTime: '14:00',
          tagIds: [3],
          subTasks: [],
          dependencies: [],
          projectId: null,
          comments: []
        },
        {
          id: 3,
          title: '实现数据持久化',
          description: '将LocalStorage替换为IndexedDB',
          completed: false,
          dueDate: '2025-10-25',
          priority: 'high',
          remindTime: '11:00',
          tagIds: [1, 4],
          subTasks: [],
          dependencies: [2],
          projectId: null,
          comments: []
        }
      ];
      
      sampleTasks.forEach(task => addTask(task));
    }
  }, [addTask, loadFromPersistentStorage, tasks.length]);
  
  // 添加新任务
  const handleAddTask = () => {
    const newTask = {
      id: Date.now(),
      title: '新任务 ' + (tasks.length + 1),
      description: '任务描述',
      completed: false,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 一周后
      priority: 'medium',
      remindTime: '09:00',
      tagIds: [],
      subTasks: [],
      dependencies: [],
      projectId: null,
      comments: []
    };
    
    addTask(newTask);
  };
  
  // 获取标签信息
  const getTagInfo = (tagId) => {
    const tags = useTodoStore.getState().tags;
    return tags.find(tag => tag.id === tagId) || { name: '未知标签', color: '#d9d9d9' };
  };
  
  // 获取优先级显示颜色
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ff4d4f';
      case 'medium': return '#faad14';
      case 'low': return '#52c41a';
      default: return '#d9d9d9';
    }
  };
  
  return (
    <div style={{ padding: '20px' }}>
      <Card title="任务管理示例">
        <Space direction="vertical" style={{ width: '100%' }}>
          {/* 统计信息 */}
          <Card size="small" title="任务统计">
            <Space>
              <Text><CheckCircleOutlined style={{ color: '#52c41a' }} /> 已完成: {taskStatistics.completed}</Text>
              <Text><ClockCircleOutlined style={{ color: '#faad14' }} /> 待完成: {taskStatistics.pending}</Text>
              <Text>总计: {taskStatistics.total}</Text>
            </Space>
          </Card>
          
          {/* 操作按钮 */}
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleAddTask}
          >
            添加任务
          </Button>
          
          {/* 任务列表 */}
          <List
            header={<Title level={4}>任务列表</Title>}
            dataSource={filteredTasks}
            renderItem={task => (
              <List.Item
                actions={[
                  <Button 
                    type={task.completed ? "default" : "primary"}
                    onClick={() => toggleComplete(task.id)}
                  >
                    {task.completed ? '已完成' : '标记完成'}
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={
                    <Space>
                      <Text delete={task.completed}>{task.title}</Text>
                      <Tag color={getPriorityColor(task.priority)}>
                        {task.priority === 'high' ? '高优先级' : 
                         task.priority === 'medium' ? '中优先级' : '低优先级'}
                      </Tag>
                      {task.tagIds && task.tagIds.map(tagId => {
                        const tagInfo = getTagInfo(tagId);
                        return (
                          <Tag color={tagInfo.color} key={tagId}>
                            {tagInfo.name}
                          </Tag>
                        );
                      })}
                    </Space>
                  }
                  description={task.description}
                />
                <div>
                  <Text type="secondary">截止日期: {task.dueDate}</Text>
                </div>
              </List.Item>
            )}
          />
        </Space>
      </Card>
    </div>
  );
};

export default TaskManagerExample;