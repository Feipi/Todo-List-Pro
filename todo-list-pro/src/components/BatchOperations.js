import React, { useState } from 'react';
import { Button, Modal, Checkbox, Select, message } from 'antd';
import { DeleteOutlined, CheckOutlined, TagOutlined } from '@ant-design/icons';

const { Option } = Select;

const BatchOperations = ({ selectedTasks, tasks, setTasks, tags }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [operation, setOperation] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [newTagIds, setNewTagIds] = useState([]);

  // 批量删除任务
  const batchDelete = () => {
    const newTasks = tasks.filter(task => !selectedTasks.includes(task.id));
    setTasks(newTasks);
    message.success(`成功删除 ${selectedTasks.length} 个任务`);
    setIsModalVisible(false);
  };

  // 批量标记完成
  const batchMarkComplete = () => {
    const newTasks = tasks.map(task => 
      selectedTasks.includes(task.id) ? { ...task, completed: true } : task
    );
    setTasks(newTasks);
    message.success(`成功标记 ${selectedTasks.length} 个任务为已完成`);
    setIsModalVisible(false);
  };

  // 批量设置优先级
  const batchSetPriority = () => {
    const newTasks = tasks.map(task => 
      selectedTasks.includes(task.id) ? { ...task, priority: newPriority } : task
    );
    setTasks(newTasks);
    message.success(`成功为 ${selectedTasks.length} 个任务设置优先级`);
    setIsModalVisible(false);
  };

  // 批量添加标签
  const batchAddTags = () => {
    const newTasks = tasks.map(task => {
      if (selectedTasks.includes(task.id)) {
        // 合并现有标签和新标签，去重
        const updatedTagIds = [...new Set([...(task.tagIds || []), ...newTagIds])];
        return { ...task, tagIds: updatedTagIds };
      }
      return task;
    });
    setTasks(newTasks);
    message.success(`成功为 ${selectedTasks.length} 个任务添加标签`);
    setIsModalVisible(false);
  };

  // 执行操作
  const executeOperation = () => {
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
        visible={isModalVisible}
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