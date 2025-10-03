import React, { useState, useEffect } from 'react';
import { Card, Button, List, Input, Tag, Popconfirm, message, ColorPicker, Tabs } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import useTodoStore from '../store/todoStore';
import useEnhancedStorage from '../hooks/useEnhancedStorage';
import TagCloud from './TagCloud';

const { TabPane } = Tabs;

const TagManager = () => {
  // 使用Zustand store
  const tags = useTodoStore(state => state.tags);
  const addTagToStore = useTodoStore(state => state.addTag);
  const updateTagInStore = useTodoStore(state => state.updateTag);
  const deleteTagFromStore = useTodoStore(state => state.deleteTag);
  
  // 使用增强存储hook
  const { loadFromPersistentStorage } = useEnhancedStorage();
  
  const [newTag, setNewTag] = useState({ name: '', color: '#1890ff' });
  const [editingTag, setEditingTag] = useState(null);

  // 组件挂载时加载数据
  useEffect(() => {
    loadFromPersistentStorage();
  }, [loadFromPersistentStorage]);

  const addTag = () => {
    if (newTag.name.trim() !== '') {
      // 检查标签名称是否已存在
      if (tags.some(tag => tag.name === newTag.name)) {
        message.error('标签名称已存在');
        return;
      }
      
      const tag = {
        id: Date.now(),
        name: newTag.name,
        color: newTag.color
      };
      // 使用store添加标签
      addTagToStore(tag);
      setNewTag({ name: '', color: '#1890ff' });
    }
  };

  const deleteTag = (id) => {
    // 使用store删除标签
    deleteTagFromStore(id);
  };

  const startEdit = (tag) => {
    setEditingTag(tag);
  };

  const saveEdit = () => {
    // 检查标签名称是否已存在（排除当前编辑的标签）
    if (tags.some(tag => tag.name === editingTag.name && tag.id !== editingTag.id)) {
      message.error('标签名称已存在');
      return;
    }
    
    // 使用store更新标签
    updateTagInStore(editingTag.id, editingTag);
    setEditingTag(null);
  };

  return (
    <Card title="标签管理" style={{ margin: '20px 0' }}>
      <Tabs defaultActiveKey="1">
        <TabPane tab="标签列表" key="1">
          <div style={{ marginBottom: '20px' }}>
            <Input 
              placeholder="标签名称" 
              value={newTag.name}
              onChange={(e) => setNewTag({...newTag, name: e.target.value})}
              style={{ width: '200px', marginRight: '10px' }}
            />
            <ColorPicker
              value={newTag.color}
              onChange={(value) => setNewTag({...newTag, color: value.toHexString()})}
              style={{ marginRight: '10px' }}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={addTag}>
              添加标签
            </Button>
          </div>
          
          <List
            dataSource={tags}
            renderItem={tag => (
              <List.Item
                actions={[
                  <Button icon={<EditOutlined />} onClick={() => startEdit(tag)}>编辑</Button>,
                  <Popconfirm
                    title="确定要删除这个标签吗？"
                    onConfirm={() => deleteTag(tag.id)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button icon={<DeleteOutlined />} danger>删除</Button>
                  </Popconfirm>
                ]}
              >
                {editingTag && editingTag.id === tag.id ? (
                  <div style={{ width: '100%' }}>
                    <Input 
                      value={editingTag.name}
                      onChange={(e) => setEditingTag({...editingTag, name: e.target.value})}
                      style={{ width: '200px', marginRight: '10px' }}
                    />
                    <ColorPicker
                      value={editingTag.color}
                      onChange={(value) => setEditingTag({...editingTag, color: value.toHexString()})}
                      style={{ marginRight: '10px' }}
                    />
                    <Button type="primary" onClick={saveEdit}>保存</Button>
                    <Button onClick={() => setEditingTag(null)} style={{ marginLeft: '10px' }}>取消</Button>
                  </div>
                ) : (
                  <>
                    <Tag color={tag.color}>{tag.name}</Tag>
                  </>
                )}
              </List.Item>
            )}
          />
        </TabPane>
        
        <TabPane tab="标签云" key="2">
          <TagCloud />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default TagManager;