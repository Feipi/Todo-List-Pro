import React, { useState, useEffect } from 'react';
import { Card, Button, List, Input, Tag, Popconfirm, message, ColorPicker } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { saveTagsToLocalStorage, loadTagsFromLocalStorage } from '../utils/storage';

const TagManager = () => {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState({ name: '', color: '#1890ff' });
  const [editingTag, setEditingTag] = useState(null);

  // 组件挂载时从LocalStorage加载标签
  useEffect(() => {
    const loadedTags = loadTagsFromLocalStorage();
    setTags(loadedTags);
  }, []);

  // 标签数据变化时保存到LocalStorage
  useEffect(() => {
    saveTagsToLocalStorage(tags);
  }, [tags]);

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
      setTags([...tags, tag]);
      setNewTag({ name: '', color: '#1890ff' });
    }
  };

  const deleteTag = (id) => {
    setTags(tags.filter(tag => tag.id !== id));
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
    
    setTags(tags.map(tag => 
      tag.id === editingTag.id ? editingTag : tag
    ));
    setEditingTag(null);
  };

  return (
    <Card title="标签管理" style={{ margin: '20px 0' }}>
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
    </Card>
  );
};

export default TagManager;