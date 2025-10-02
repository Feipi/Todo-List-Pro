import React, { useState, useEffect } from 'react';
import { Card, Timeline, Tag, Typography, Button } from 'antd';
import { loadTasksFromLocalStorage } from '../utils/storage';
import moment from 'moment';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const TimelineView = () => {
  const [tasks, setTasks] = useState(loadTasksFromLocalStorage());
  const [editingTask, setEditingTask] = useState(null);

  // 按日期分组任务
  const groupTasksByDate = () => {
    const grouped = {};
    
    tasks.forEach(task => {
      const date = task.dueDate || '无截止日期';
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(task);
    });
    
    return grouped;
  };

  const groupedTasks = groupTasksByDate();

  // 获取优先级颜色
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ff4d4f';
      case 'medium': return '#faad14';
      case 'low': return '#52c41a';
      default: return '#d9d9d9';
    }
  };

  // 检查任务是否逾期
  const isOverdue = (task) => {
    if (!task.dueDate || task.completed) return false;
    return moment(task.dueDate).isBefore(moment(), 'day');
  };

  // 编辑任务
  const startEdit = (task) => {
    setEditingTask(task);
    // 这里可以添加编辑逻辑
  };

  // 删除任务
  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // 切换完成状态
  const toggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <Card title="时间轴视图" style={{ margin: '20px 0' }}>
      <Timeline mode="alternate">
        {Object.keys(groupedTasks).sort().map(date => (
          <Timeline.Item key={date} color={date === '无截止日期' ? 'gray' : 'blue'}>
            <Card size="small" title={date} style={{ marginBottom: '20px' }}>
              {groupedTasks[date].map(task => (
                <Card 
                  key={task.id} 
                  size="small" 
                  style={{ 
                    marginBottom: '10px',
                    borderColor: isOverdue(task) ? '#ff4d4f' : undefined
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <Title level={5} style={{ 
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: isOverdue(task) ? '#ff4d4f' : undefined
                      }}>
                        {task.title}
                      </Title>
                      {task.priority && (
                        <Tag color={getPriorityColor(task.priority)} style={{ marginLeft: '8px' }}>
                          {task.priority === 'high' ? '高' : 
                           task.priority === 'medium' ? '中' : '低'}
                        </Tag>
                      )}
                      {isOverdue(task) && (
                        <Tag color="red" style={{ marginLeft: '8px' }}>
                          逾期
                        </Tag>
                      )}
                      <Text style={{ display: 'block', marginTop: '4px' }}>
                        {task.description}
                      </Text>
                    </div>
                    <div>
                      <Button 
                        icon={<EditOutlined />} 
                        size="small" 
                        onClick={() => startEdit(task)}
                        style={{ marginRight: '4px' }}
                      />
                      <Button 
                        icon={<DeleteOutlined />} 
                        size="small" 
                        danger 
                        onClick={() => deleteTask(task.id)}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </Card>
          </Timeline.Item>
        ))}
      </Timeline>
    </Card>
  );
};

export default TimelineView;