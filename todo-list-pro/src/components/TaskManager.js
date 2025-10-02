import React, { useState, useEffect } from 'react';
import { Card, Button, List, Typography, Input, DatePicker, Checkbox, Select } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { saveTasksToLocalStorage, loadTasksFromLocalStorage } from '../utils/storage';
import moment from 'moment';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

// 拖拽任务项组件
const TaskItem = ({ task, index, moveTask, startEdit, deleteTask, toggleComplete }) => {
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
          </div>
        </>
      </List.Item>
    </div>
  );
};

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  
  const [newTask, setNewTask] = useState({ 
    title: '', 
    description: '', 
    dueDate: null,
    priority: 'medium' // 默认中优先级
  });
  const [editingTask, setEditingTask] = useState(null);

  // 组件挂载时从LocalStorage加载任务
  useEffect(() => {
    const loadedTasks = loadTasksFromLocalStorage();
    setTasks(loadedTasks);
  }, []);

  // 任务数据变化时保存到LocalStorage
  useEffect(() => {
    saveTasksToLocalStorage(tasks);
  }, [tasks]);

  const addTask = () => {
    if (newTask.title.trim() !== '') {
      const task = {
        id: Date.now(),
        title: newTask.title,
        description: newTask.description,
        completed: false,
        dueDate: newTask.dueDate ? newTask.dueDate.format('YYYY-MM-DD') : '',
        priority: newTask.priority
      };
      setTasks([...tasks, task]);
      setNewTask({ 
        title: '', 
        description: '', 
        dueDate: null,
        priority: 'medium'
      });
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const startEdit = (task) => {
    setEditingTask(task);
  };

  const saveEdit = () => {
    setTasks(tasks.map(task => 
      task.id === editingTask.id ? editingTask : task
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

  return (
    <DndProvider backend={HTML5Backend}>
      <Card title="任务管理" style={{ margin: '20px 0' }}>
        <div style={{ marginBottom: '20px' }}>
          <Input 
            placeholder="任务标题" 
            value={newTask.title}
            onChange={(e) => setNewTask({...newTask, title: e.target.value})}
            style={{ width: '300px', marginRight: '10px' }}
          />
          <DatePicker 
            placeholder="截止日期"
            onChange={(date) => setNewTask({...newTask, dueDate: date})}
            style={{ marginRight: '10px' }}
          />
          <Select
            value={newTask.priority}
            onChange={(value) => setNewTask({...newTask, priority: value})}
            style={{ width: '120px', marginRight: '10px' }}
          >
            <Option value="high">高优先级</Option>
            <Option value="medium">中优先级</Option>
            <Option value="low">低优先级</Option>
          </Select>
          <Button type="primary" icon={<PlusOutlined />} onClick={addTask}>
            添加任务
          </Button>
        </div>
        
        <TextArea 
          placeholder="任务描述"
          value={newTask.description}
          onChange={(e) => setNewTask({...newTask, description: e.target.value})}
          rows={2}
          style={{ width: '500px', marginBottom: '20px' }}
        />
        
        <List
          dataSource={tasks}
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
                    style={{ width: '300px', marginRight: '10px' }}
                  />
                  <DatePicker 
                    value={editingTask.dueDate ? moment(editingTask.dueDate) : null}
                    onChange={(date) => setEditingTask({...editingTask, dueDate: date ? date.format('YYYY-MM-DD') : ''})}
                    style={{ marginRight: '10px' }}
                  />
                  <Select
                    value={editingTask.priority}
                    onChange={(value) => setEditingTask({...editingTask, priority: value})}
                    style={{ width: '120px', marginRight: '10px' }}
                  >
                    <Option value="high">高优先级</Option>
                    <Option value="medium">中优先级</Option>
                    <Option value="low">低优先级</Option>
                  </Select>
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
              />
            )
          )}
        />
      </Card>
    </DndProvider>
  );
};

export default TaskManager;