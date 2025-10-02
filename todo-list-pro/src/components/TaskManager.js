import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, Button, List, Typography, Input, DatePicker, Checkbox, Select, TimePicker, message, Tag } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { saveTasksToLocalStorage, loadTasksFromLocalStorage } from '../utils/storage';
import moment from 'moment';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// 拖拽任务项组件
const TaskItem = ({ task, index, moveTask, startEdit, deleteTask, toggleComplete, allTags }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'task',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    type: 'task',
    accept: 'task',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveTask(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  // 获取优先级显示颜色
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ff4d4f';
      case 'medium': return '#faad14';
      case 'low': return '#52c41a';
      default: return '#d9d9d9';
    }
  };

  // 获取标签信息
  const getTagInfo = (tagId) => {
    return allTags.find(tag => tag.id === tagId) || { name: '未知标签', color: '#d9d9d9' };
  };

  return (
    <div ref={(node) => drag(drop(node))} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <List.Item
        actions={[
          <Button icon={<EditOutlined />} onClick={() => startEdit(task)}>编辑</Button>,
          <Button icon={<DeleteOutlined />} onClick={() => deleteTask(task.id)} danger>删除</Button>
        ]}
      >
        <>
          <Checkbox checked={task.completed} onChange={() => toggleComplete(task.id)} />
          <div style={{ marginLeft: '10px', textDecoration: task.completed ? 'line-through' : 'none' }}>
            <Title level={5}>
              {task.title}
              {task.priority && (
                <span style={{ 
                  color: getPriorityColor(task.priority), 
                  fontSize: '12px', 
                  marginLeft: '10px',
                  fontWeight: 'normal'
                }}>
                  {task.priority === 'high' ? '高优先级' : 
                   task.priority === 'medium' ? '中优先级' : '低优先级'}
                </span>
              )}
            </Title>
            <p>{task.description}</p>
            <p>截止日期: {task.dueDate}</p>
            {task.remindTime && <p>提醒时间: {task.remindTime}</p>}
            <div>
              {task.tagIds && task.tagIds.map(tagId => {
                const tagInfo = getTagInfo(tagId);
                return (
                  <Tag color={tagInfo.color} key={tagId}>
                    {tagInfo.name}
                  </Tag>
                );
              })}
            </div>
          </div>
        </>
      </List.Item>
    </div>
  );
};

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [tags, setTags] = useState([]); // 标签列表
  const [searchText, setSearchText] = useState(''); // 搜索文本
  const [selectedTag, setSelectedTag] = useState('all'); // 选中的标签
  
  const [newTask, setNewTask] = useState({ 
    title: '', 
    description: '', 
    dueDate: null,
    priority: 'medium', // 默认中优先级
    remindTime: null, // 提醒时间
    tagIds: [] // 关联的标签ID数组
  });
  const [editingTask, setEditingTask] = useState(null);
  
  // 使用useRef来存储提醒任务ID，避免循环依赖
  const remindersRef = useRef(new Set());

  // 组件挂载时从LocalStorage加载任务和标签
  useEffect(() => {
    const loadedTasks = loadTasksFromLocalStorage();
    setTasks(loadedTasks);
    
    // 加载标签
    const loadedTags = JSON.parse(localStorage.getItem('todoListPro_tags') || '[]');
    setTags(loadedTags);
  }, []);

  // 检查提醒
  const checkReminders = useCallback((tasksList) => {
    const now = moment();
    const pendingReminders = [];
    
    tasksList.forEach(task => {
      if (!task.completed && task.remindTime && task.dueDate) {
        const remindDateTime = moment(`${task.dueDate} ${task.remindTime}`, 'YYYY-MM-DD HH:mm');
        // 检查是否已经提醒过
        if (remindDateTime.isSameOrBefore(now) && !remindersRef.current.has(task.id)) {
          pendingReminders.push(task);
        }
      }
    });
    
    // 触发提醒
    pendingReminders.forEach(task => {
      showReminder(task);
      // 添加到已提醒集合
      remindersRef.current.add(task.id);
    });
  }, []);

  // 任务数据变化时保存到LocalStorage
  useEffect(() => {
    saveTasksToLocalStorage(tasks);
  }, [tasks]);

  // 检查提醒的副作用
  useEffect(() => {
    if (tasks.length > 0) {
      checkReminders(tasks);
    }
  }, [tasks, checkReminders]);

  // 过滤任务
  const filteredTasks = tasks.filter(task => {
    // 搜索过滤
    const matchesSearch = task.title.toLowerCase().includes(searchText.toLowerCase()) || 
                          task.description.toLowerCase().includes(searchText.toLowerCase());
    
    // 标签过滤
    const matchesTag = selectedTag === 'all' || 
                       (task.tagIds && task.tagIds.includes(Number(selectedTag)));
    
    return matchesSearch && matchesTag;
  });

  // 显示提醒
  const showReminder = (task) => {
    // 浏览器通知
    if (Notification.permission === 'granted') {
      new Notification('任务提醒', {
        body: `任务 "${task.title}" 已到提醒时间`,
        icon: '/favicon.ico'
      });
    }
    
    // 页面内提醒
    message.info(`任务 "${task.title}" 已到提醒时间`);
  };

  // 请求通知权限
  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          message.success('通知权限已获取');
        }
      });
    }
  };

  const addTask = () => {
    if (newTask.title.trim() !== '') {
      const task = {
        id: Date.now(),
        title: newTask.title,
        description: newTask.description,
        completed: false,
        dueDate: newTask.dueDate ? newTask.dueDate.format('YYYY-MM-DD') : '',
        priority: newTask.priority,
        remindTime: newTask.remindTime ? newTask.remindTime.format('HH:mm') : '',
        tagIds: newTask.tagIds
      };
      setTasks([...tasks, task]);
      setNewTask({ 
        title: '', 
        description: '', 
        dueDate: null,
        priority: 'medium',
        remindTime: null,
        tagIds: []
      });
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    // 从提醒集合中移除
    remindersRef.current.delete(id);
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const startEdit = (task) => {
    setEditingTask({
      ...task,
      dueDate: task.dueDate ? moment(task.dueDate) : null,
      remindTime: task.remindTime ? moment(task.remindTime, 'HH:mm') : null
    });
  };

  const saveEdit = () => {
    setTasks(tasks.map(task => 
      task.id === editingTask.id ? {
        ...editingTask,
        dueDate: editingTask.dueDate ? editingTask.dueDate.format('YYYY-MM-DD') : '',
        remindTime: editingTask.remindTime ? editingTask.remindTime.format('HH:mm') : ''
      } : task
    ));
    setEditingTask(null);
  };

  // 移动任务位置
  const moveTask = (fromIndex, toIndex) => {
    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(fromIndex, 1);
    updatedTasks.splice(toIndex, 0, movedTask);
    setTasks(updatedTasks);
  };

  // 组件挂载时请求通知权限
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <Card title="任务管理" style={{ margin: '20px 0' }}>
        {/* 搜索和筛选区域 */}
        <div style={{ marginBottom: '20px' }}>
          <Input
            placeholder="搜索任务..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: '300px', marginRight: '10px' }}
          />
          <Select
            value={selectedTag}
            onChange={setSelectedTag}
            style={{ width: '200px', marginRight: '10px' }}
          >
            <Option value="all">所有标签</Option>
            {tags.map(tag => (
              <Option key={tag.id} value={String(tag.id)}>
                <Tag color={tag.color}>{tag.name}</Tag>
              </Option>
            ))}
          </Select>
        </div>
        
        {/* 添加任务区域 */}
        <div style={{ marginBottom: '20px' }}>
          <Input 
            placeholder="任务标题" 
            value={newTask.title}
            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
            style={{ width: '200px', marginRight: '10px' }}
          />
          <DatePicker 
            placeholder="截止日期"
            onChange={(date) => setNewTask({...newTask, dueDate: date})}
            style={{ marginRight: '10px' }}
          />
          <Select
            value={newTask.priority}
            onChange={(value) => setNewTask({...newTask, priority: value})}
            style={{ width: '100px', marginRight: '10px' }}
          >
            <Option value="high">高</Option>
            <Option value="medium">中</Option>
            <Option value="low">低</Option>
          </Select>
          <TimePicker
            placeholder="提醒时间"
            onChange={(time) => setNewTask({...newTask, remindTime: time})}
            style={{ marginRight: '10px' }}
          />
          <br /><br />
          <Select
            mode="multiple"
            placeholder="选择标签"
            value={newTask.tagIds}
            onChange={(value) => setNewTask({...newTask, tagIds: value})}
            style={{ width: '300px', marginRight: '10px' }}
          >
            {tags.map(tag => (
              <Option key={tag.id} value={tag.id}>
                <Tag color={tag.color}>{tag.name}</Tag>
              </Option>
            ))}
          </Select>
          <Button type="primary" icon={<PlusOutlined />} onClick={addTask}>
            添加
          </Button>
        </div>
        
        <TextArea 
          placeholder="任务描述"
          value={newTask.description}
          onChange={(e) => setNewTask({...newTask, description: e.target.value})}
          rows={2}
          style={{ width: '500px', marginBottom: '20px' }}
        />
        
        {/* 任务列表 */}
        <List
          dataSource={filteredTasks}
          renderItem={(task, index) => (
            editingTask && editingTask.id === task.id ? (
              <List.Item
                actions={[
                  <Button icon={<EditOutlined />} onClick={() => startEdit(task)}>编辑</Button>,
                  <Button icon={<DeleteOutlined />} onClick={() => deleteTask(task.id)} danger>删除</Button>
                ]}
              >
                <div style={{ width: '100%' }}>
                  <Input 
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                    style={{ width: '200px', marginRight: '10px' }}
                  />
                  <DatePicker 
                    value={editingTask.dueDate}
                    onChange={(date) => setEditingTask({...editingTask, dueDate: date})}
                    style={{ marginRight: '10px' }}
                  />
                  <Select
                    value={editingTask.priority}
                    onChange={(value) => setEditingTask({...editingTask, priority: value})}
                    style={{ width: '100px', marginRight: '10px' }}
                  >
                    <Option value="high">高</Option>
                    <Option value="medium">中</Option>
                    <Option value="low">低</Option>
                  </Select>
                  <TimePicker
                    value={editingTask.remindTime}
                    onChange={(time) => setEditingTask({...editingTask, remindTime: time})}
                    style={{ marginRight: '10px' }}
                  />
                  <br /><br />
                  <Select
                    mode="multiple"
                    placeholder="选择标签"
                    value={editingTask.tagIds}
                    onChange={(value) => setEditingTask({...editingTask, tagIds: value})}
                    style={{ width: '300px', marginRight: '10px' }}
                  >
                    {tags.map(tag => (
                      <Option key={tag.id} value={tag.id}>
                        <Tag color={tag.color}>{tag.name}</Tag>
                      </Option>
                    ))}
                  </Select>
                  <br /><br />
                  <Button type="primary" onClick={saveEdit}>保存</Button>
                  <Button onClick={() => setEditingTask(null)} style={{ marginLeft: '10px' }}>取消</Button>
                  <TextArea 
                    value={editingTask.description}
                    onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                    rows={2}
                    style={{ width: '500px', marginTop: '10px' }}
                  />
                </div>
              </List.Item>
            ) : (
              <TaskItem 
                task={task}
                index={index}
                moveTask={moveTask}
                startEdit={startEdit}
                deleteTask={deleteTask}
                toggleComplete={toggleComplete}
                allTags={tags}
              />
            )
          )}
        />
      </Card>
    </DndProvider>
  );
};

export default TaskManager;