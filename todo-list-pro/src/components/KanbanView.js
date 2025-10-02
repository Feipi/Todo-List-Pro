import React, { useState, useEffect } from 'react';
import { Card, List, Typography, Tag, Checkbox, Button, Modal, Input, Select } from 'antd';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { loadTasksFromLocalStorage, saveTasksToLocalStorage, loadTagsFromLocalStorage } from '../utils/storage';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const KanbanView = () => {
  const [tasks, setTasks] = useState(loadTasksFromLocalStorage());
  const [tags] = useState(loadTagsFromLocalStorage());
  const [columns, setColumns] = useState([
    { id: 'todo', title: '待办', taskIds: [] },
    { id: 'in-progress', title: '进行中', taskIds: [] },
    { id: 'done', title: '已完成', taskIds: [] }
  ]);
  const [editingTask, setEditingTask] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // 初始化列数据
  useEffect(() => {
    const todoTasks = tasks.filter(task => !task.completed);
    const doneTasks = tasks.filter(task => task.completed);
    
    setColumns([
      { id: 'todo', title: '待办', taskIds: todoTasks.map(t => t.id) },
      { id: 'in-progress', title: '进行中', taskIds: [] },
      { id: 'done', title: '已完成', taskIds: doneTasks.map(t => t.id) }
    ]);
  }, [tasks]);

  // 拖拽处理
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    
    // 如果没有目标位置，直接返回
    if (!destination) {
      return;
    }
    
    // 如果位置没有变化，直接返回
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    
    // 找到源列和目标列
    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destinationColumn = columns.find(col => col.id === destination.droppableId);
    
    // 同一列内移动
    if (sourceColumn === destinationColumn) {
      const newTaskIds = Array.from(sourceColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      
      const newColumns = columns.map(col => {
        if (col.id === sourceColumn.id) {
          return {
            ...col,
            taskIds: newTaskIds
          };
        }
        return col;
      });
      
      setColumns(newColumns);
      return;
    }
    
    // 不同列间移动
    const sourceTaskIds = Array.from(sourceColumn.taskIds);
    sourceTaskIds.splice(source.index, 1);
    const newDestinationTaskIds = Array.from(destinationColumn.taskIds);
    newDestinationTaskIds.splice(destination.index, 0, draggableId);
    
    const newColumns = columns.map(col => {
      if (col.id === sourceColumn.id) {
        return {
          ...col,
          taskIds: sourceTaskIds
        };
      } else if (col.id === destinationColumn.id) {
        return {
          ...col,
          taskIds: newDestinationTaskIds
        };
      }
      return col;
    });
    
    setColumns(newColumns);
    
    // 更新任务状态
    if (destinationColumn.id === 'done') {
      setTasks(tasks.map(task => 
        task.id === parseInt(draggableId) ? { ...task, completed: true } : task
      ));
    } else if (sourceColumn.id === 'done' && destinationColumn.id !== 'done') {
      setTasks(tasks.map(task => 
        task.id === parseInt(draggableId) ? { ...task, completed: false } : task
      ));
    }
  };

  // 获取任务信息
  const getTaskById = (id) => {
    return tasks.find(task => task.id === parseInt(id));
  };

  // 获取优先级颜色
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
    return tags.find(tag => tag.id === tagId) || { name: '未知标签', color: '#d9d9d9' };
  };

  // 编辑任务
  const startEdit = (task) => {
    setEditingTask(task);
    setModalVisible(true);
  };

  // 保存编辑
  const saveEdit = () => {
    setTasks(tasks.map(task => 
      task.id === editingTask.id ? editingTask : task
    ));
    setModalVisible(false);
    setEditingTask(null);
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
    <Card title="看板视图" style={{ margin: '20px 0' }}>
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', gap: '16px' }}>
          {columns.map(column => (
            <div key={column.id} style={{ flex: 1 }}>
              <Card title={`${column.title} (${column.taskIds.length})`} size="small">
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{
                        minHeight: '400px',
                        backgroundColor: snapshot.isDraggingOver ? '#e6f7ff' : 'white',
                        padding: '8px'
                      }}
                    >
                      <List
                        dataSource={column.taskIds}
                        renderItem={(taskId, index) => {
                          const task = getTaskById(taskId);
                          if (!task) return null;
                          
                          return (
                            <Draggable key={taskId} draggableId={String(taskId)} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    ...provided.draggableProps.style,
                                    marginBottom: '8px'
                                  }}
                                >
                                  <Card size="small">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                      <div>
                                        <Checkbox 
                                          checked={task.completed} 
                                          onChange={() => toggleComplete(task.id)}
                                        />
                                        <Title level={5} style={{ 
                                          textDecoration: task.completed ? 'line-through' : 'none',
                                          marginLeft: '8px',
                                          display: 'inline'
                                        }}>
                                          {task.title}
                                        </Title>
                                        {task.priority && (
                                          <Tag color={getPriorityColor(task.priority)} style={{ marginLeft: '8px' }}>
                                            {task.priority === 'high' ? '高' : 
                                             task.priority === 'medium' ? '中' : '低'}
                                          </Tag>
                                        )}
                                        <Text style={{ display: 'block', marginTop: '4px' }}>
                                          {task.description}
                                        </Text>
                                        <Text style={{ display: 'block', marginTop: '4px', fontSize: '12px' }}>
                                          截止日期: {task.dueDate}
                                        </Text>
                                        <div style={{ marginTop: '4px' }}>
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
                                </div>
                              )}
                            </Draggable>
                          );
                        }}
                      />
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Card>
            </div>
          ))}
        </div>
      </DragDropContext>
      
      {/* 编辑任务模态框 */}
      <Modal
        title="编辑任务"
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingTask(null);
        }}
        onOk={saveEdit}
      >
        {editingTask && (
          <div>
            <div style={{ marginBottom: '16px' }}>
              <Input 
                value={editingTask.title}
                onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                placeholder="任务标题"
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <TextArea 
                value={editingTask.description}
                onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                placeholder="任务描述"
                rows={3}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <Select
                value={editingTask.priority}
                onChange={(value) => setEditingTask({...editingTask, priority: value})}
                style={{ width: '100%' }}
              >
                <Option value="high">高优先级</Option>
                <Option value="medium">中优先级</Option>
                <Option value="low">低优先级</Option>
              </Select>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <Select
                mode="multiple"
                placeholder="选择标签"
                value={editingTask.tagIds}
                onChange={(value) => setEditingTask({...editingTask, tagIds: value})}
                style={{ width: '100%' }}
              >
                {tags.map(tag => (
                  <Option key={tag.id} value={tag.id}>
                    <Tag color={tag.color}>{tag.name}</Tag>
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default KanbanView;