import React, { useState } from 'react';
import { Button, Modal, Checkbox, Select, message } from 'antd';
import { DeleteOutlined, CheckOutlined, TagOutlined } from '@ant-design/icons';
import useTodoStore from '../store/todoStore'; // 导入store

const { Option } = Select;

const BatchOperations = ({ selectedTasks, deleteTasks, updateTasks, tags }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [operation, setOperation] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [newTagIds, setNewTagIds] = useState([]);
  
  // 获取store中的批量更新函数
  const batchUpdateTasks = useTodoStore(state => state.batchUpdateTasks);

  // 批量删除任务
  const batchDelete = () => {
    // 注意：删除操作需要特殊的处理方式，因为Zustand中的删除是通过ID进行的
    selectedTasks.forEach(taskId => {
      // 这里需要获取store中的删除函数
      const deleteTaskFromStore = useTodoStore.getState().deleteTask;
      deleteTaskFromStore(taskId);
    });
    message.success(`成功删除 ${selectedTasks.length} 个任务`);
    setIsModalVisible(false);
  };

  // 批量标记完成
  const batchMarkComplete = () => {
    // 使用store的批量更新函数
    batchUpdateTasks(selectedTasks, { completed: true });
    message.success(`成功标记 ${selectedTasks.length} 个任务为已完成`);
    setIsModalVisible(false);
  };

  // 批量设置优先级
  const batchSetPriority = () => {
    // 使用store的批量更新函数
    batchUpdateTasks(selectedTasks, { priority: newPriority });
    message.success(`成功为 ${selectedTasks.length} 个任务设置优先级`);
    setIsModalVisible(false);
  };

  // 批量添加标签
  const batchAddTags = () => {
    // 获取当前任务状态
    const currentTasks = useTodoStore.getState().tasks;
    const tasksToUpdate = currentTasks.filter(task => selectedTasks.includes(task.id));
    
    // 为每个选中的任务添加标签
    tasksToUpdate.forEach(task => {
      // 合并现有标签和新标签，去重
      const updatedTagIds = [...new Set([...(task.tagIds || []), ...newTagIds])];
      batchUpdateTasks([task.id], { tagIds: updatedTagIds });
    });
    
    message.success(`成功为 ${selectedTasks.length} 个任务添加标签`);
    setIsModalVisible(false);
  };

  // 执行操作
  const executeOperation = () => {
    if (selectedTasks.length === 0) {
      message.warning('请先选择任务');
      return;
    }
    
    switch (operation) {
      case 'delete':
        batchDelete();
        break;
      case 'complete':
        batchMarkComplete();
        break;
      case 'priority':
        batchSetPriority();
        break;
      case 'tags':
        batchAddTags();
        break;
      default:
        message.warning('请选择要执行的操作');
    }
  };

  return (
    <>
      <Button 
        type="primary" 
        onClick={() => setIsModalVisible(true)}
        disabled={selectedTasks.length === 0}
      >
        批量操作 ({selectedTasks.length} 个任务)
      </Button>
      
      <Modal
        title="批量操作"
        open={isModalVisible}  // 使用 open 替代 visible
        onCancel={() => setIsModalVisible(false)}
        onOk={executeOperation}
      >
        <div style={{ marginBottom: '20px' }}>
          <p>已选择 {selectedTasks.length} 个任务</p>
          
          <Select
            placeholder="选择操作类型"
            value={operation}
            onChange={setOperation}
            style={{ width: '100%', marginBottom: '20px' }}
          >
            <Option value="delete">删除任务</Option>
            <Option value="complete">标记完成</Option>
            <Option value="priority">设置优先级</Option>
            <Option value="tags">添加标签</Option>
          </Select>
          
          {operation === 'priority' && (
            <Select
              placeholder="选择优先级"
              value={newPriority}
              onChange={setNewPriority}
              style={{ width: '100%', marginBottom: '20px' }}
            >
              <Option value="high">高优先级</Option>
              <Option value="medium">中优先级</Option>
              <Option value="low">低优先级</Option>
            </Select>
          )}
          
          {operation === 'tags' && (
            <Select
              mode="multiple"
              placeholder="选择标签"
              value={newTagIds}
              onChange={setNewTagIds}
              style={{ width: '100%', marginBottom: '20px' }}
            >
              {tags.map(tag => (
                <Option key={tag.id} value={tag.id}>
                  <span style={{ color: tag.color }}>{tag.name}</span>
                </Option>
              ))}
            </Select>
          )}
        </div>
      </Modal>
    </>
  );
};

export default BatchOperations;