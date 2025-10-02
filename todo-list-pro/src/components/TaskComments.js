import React, { useState, useEffect } from 'react';
import { Card, List, Input, Button, Avatar, Form, message, Typography } from 'antd';
import { UserOutlined, SendOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { loadUserFromLocalStorage } from '../utils/storage';

const { TextArea } = Input;
const { Text, Paragraph } = Typography;

const TaskComments = ({ taskId, comments: initialComments = [], onAddComment }) => {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [form] = Form.useForm();

  // 获取当前用户
  useEffect(() => {
    const user = loadUserFromLocalStorage();
    setCurrentUser(user);
  }, []);

  // 当初始评论更新时，更新状态
  useEffect(() => {
    setComments(initialComments);
  }, [initialComments]);

  // 添加评论
  const handleAddComment = () => {
    if (!newComment.trim()) {
      message.warning('评论内容不能为空');
      return;
    }

    if (!currentUser) {
      message.error('请先登录');
      return;
    }

    const comment = {
      id: Date.now(),
      taskId: taskId,
      userId: currentUser.id,
      username: currentUser.username,
      content: newComment,
      timestamp: new Date().toISOString()
    };

    // 调用父组件的回调函数
    if (onAddComment) {
      onAddComment(comment);
    }

    // 更新本地状态
    setComments([...comments, comment]);
    setNewComment('');
    form.resetFields();
    
    message.success('评论添加成功');
  };

  // 格式化时间
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('zh-CN');
  };

  // 自定义评论组件
  const CustomComment = ({ author, avatar, content, datetime }) => (
    <div style={{ padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
      <div style={{ display: 'flex', marginBottom: '8px' }}>
        {avatar}
        <div style={{ marginLeft: '12px', flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Text strong>{author}</Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              <ClockCircleOutlined style={{ marginRight: '4px' }} />
              {datetime}
            </Text>
          </div>
          <Paragraph style={{ marginTop: '8px', marginBottom: '0' }}>
            {content}
          </Paragraph>
        </div>
      </div>
    </div>
  );

  return (
    <Card title="任务评论" style={{ margin: '20px 0' }}>
      {/* 评论列表 */}
      <List
        dataSource={comments}
        renderItem={comment => (
          <li>
            <CustomComment
              author={comment.username}
              avatar={<Avatar icon={<UserOutlined />} />}
              content={comment.content}
              datetime={formatTime(comment.timestamp)}
            />
          </li>
        )}
      />
      
      {/* 添加评论表单 */}
      <Form form={form} onFinish={handleAddComment}>
        <Form.Item
          name="comment"
          rules={[{ required: true, message: '请输入评论内容' }]}
        >
          <TextArea
            rows={4}
            placeholder="添加您的评论..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            icon={<SendOutlined />}
          >
            发表评论
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default TaskComments;