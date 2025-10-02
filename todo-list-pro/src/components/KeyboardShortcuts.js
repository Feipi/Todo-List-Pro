import React, { useEffect } from 'react';
import { Modal, List, Typography, Tag } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const KeyboardShortcuts = ({ visible, onClose }) => {
  // 快捷键列表
  const shortcuts = [
    {
      key: 'Enter',
      description: '添加任务（在任务标题输入框中按Enter）',
      category: '任务管理'
    },
    {
      key: 'Escape',
      description: '取消编辑任务',
      category: '任务管理'
    },
    {
      key: 'Ctrl + A',
      description: '全选任务',
      category: '任务管理'
    },
    {
      key: 'Ctrl + S',
      description: '保存当前编辑的任务',
      category: '任务管理'
    },
    {
      key: 'Ctrl + D',
      description: '删除选中的任务',
      category: '任务管理'
    },
    {
      key: 'Ctrl + E',
      description: '编辑选中的任务',
      category: '任务管理'
    },
    {
      key: 'Ctrl + N',
      description: '新建任务',
      category: '任务管理'
    },
    {
      key: 'Ctrl + F',
      description: '聚焦到搜索框',
      category: '搜索'
    },
    {
      key: 'Ctrl + Shift + F',
      description: '打开高级搜索',
      category: '搜索'
    },
    {
      key: 'Ctrl + T',
      description: '切换主题（深色/浅色）',
      category: '设置'
    },
    {
      key: 'Ctrl + P',
      description: '打开隐私模式',
      category: '设置'
    },
    {
      key: 'Ctrl + H',
      description: '显示/隐藏已完成任务',
      category: '视图'
    },
    {
      key: '?',
      description: '显示快捷键帮助',
      category: '帮助'
    }
  ];

  // 按类别分组快捷键
  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {});

  return (
    <Modal
      title="键盘快捷键"
      visible={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <div>
        <Text type="secondary">使用键盘快捷键可以更高效地操作To-Do List Pro</Text>
        
        {Object.entries(groupedShortcuts).map(([category, shortcuts]) => (
          <div key={category} style={{ marginTop: '20px' }}>
            <Title level={4}>{category}</Title>
            <List
              dataSource={shortcuts}
              renderItem={item => (
                <List.Item>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                    <Text strong>{item.description}</Text>
                    <Tag color="blue">{item.key}</Tag>
                  </div>
                </List.Item>
              )}
            />
          </div>
        ))}
        
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: '4px' }}>
          <Text strong>提示：</Text>
          <Text>在任何页面都可以按 <Tag color="blue">?</Tag> 键快速打开此帮助窗口</Text>
        </div>
      </div>
    </Modal>
  );
};

export default KeyboardShortcuts;