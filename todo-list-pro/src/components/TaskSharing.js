import React, { useState } from 'react';
import { Card, Button, Input, message, Modal, List, Typography, Tag } from 'antd';
import { ShareAltOutlined, CopyOutlined, LinkOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { loadTasksFromLocalStorage } from '../utils/storage';

const { Title, Text } = Typography;

const TaskSharing = () => {
  const [sharedTasks, setSharedTasks] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [shareLink, setShareLink] = useState('');
  const [collaborators, setCollaborators] = useState([]);
  const [newCollaborator, setNewCollaborator] = useState('');

  // 生成分享链接
  const generateShareLink = (task) => {
    // 生成随机分享ID
    const shareId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const link = `${window.location.origin}/share/${shareId}`;
    
    setSelectedTask(task);
    setShareLink(link);
    setIsModalVisible(true);
  };

  // 复制链接到剪贴板
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink).then(() => {
      message.success('链接已复制到剪贴板');
    }).catch(() => {
      message.error('复制失败，请手动复制');
    });
  };

  // 添加协作者
  const addCollaborator = () => {
    if (newCollaborator.trim() !== '' && !collaborators.includes(newCollaborator)) {
      setCollaborators([...collaborators, newCollaborator]);
      setNewCollaborator('');
      message.success('协作者已添加');
    }
  };

  // 移除协作者
  const removeCollaborator = (email) => {
    setCollaborators(collaborators.filter(c => c !== email));
  };

  // 获取所有任务
  const getAllTasks = () => {
    return loadTasksFromLocalStorage();
  };

  return (
    <Card title="任务分享与协作" style={{ margin: '20px 0' }}>
      <div style={{ marginBottom: '20px' }}>
        <Title level={4}>我的任务</Title>
        <List
          dataSource={getAllTasks()}
          renderItem={task => (
            <List.Item
              actions={[
                <Button 
                  icon={<ShareAltOutlined />} 
                  onClick={() => generateShareLink(task)}
                >
                  分享
                </Button>
              ]}
            >
              <List.Item.Meta
                title={task.title}
                description={
                  <div>
                    <Text>{task.description}</Text>
                    <br />
                    {task.tagIds && task.tagIds.map(tagId => (
                      <Tag key={tagId} color="#1890ff">标签 {tagId}</Tag>
                    ))}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </div>
      
      {/* 分享模态框 */}
      <Modal
        title="分享任务"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            关闭
          </Button>
        ]}
      >
        {selectedTask && (
          <div>
            <Title level={5}>{selectedTask.title}</Title>
            <p>{selectedTask.description}</p>
            
            <div style={{ marginBottom: '20px' }}>
              <Text strong>分享链接:</Text>
              <div style={{ display: 'flex', marginTop: '10px' }}>
                <Input 
                  value={shareLink} 
                  readOnly 
                  style={{ flex: 1, marginRight: '10px' }}
                />
                <Button icon={<CopyOutlined />} onClick={copyToClipboard}>
                  复制
                </Button>
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <Text strong>协作者管理:</Text>
              <div style={{ display: 'flex', marginTop: '10px', marginBottom: '10px' }}>
                <Input 
                  placeholder="输入协作者邮箱"
                  value={newCollaborator}
                  onChange={(e) => setNewCollaborator(e.target.value)}
                  style={{ flex: 1, marginRight: '10px' }}
                />
                <Button 
                  icon={<UsergroupAddOutlined />} 
                  onClick={addCollaborator}
                >
                  添加
                </Button>
              </div>
              
              {collaborators.length > 0 && (
                <div>
                  <Text>已添加的协作者:</Text>
                  <div style={{ marginTop: '10px' }}>
                    {collaborators.map(email => (
                      <Tag 
                        key={email} 
                        closable 
                        onClose={() => removeCollaborator(email)}
                        style={{ marginBottom: '5px' }}
                      >
                        {email}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div style={{ padding: '10px', backgroundColor: '#f0f2f5', borderRadius: '4px' }}>
              <Text strong>分享说明:</Text>
              <ul>
                <li>任何人拥有此链接都可以查看任务</li>
                <li>协作者可以接收任务更新通知</li>
                <li>只有任务创建者可以编辑任务</li>
              </ul>
            </div>
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default TaskSharing;