import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Tabs, Divider, Tooltip } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, WechatOutlined, QqOutlined, GoogleOutlined, AppleOutlined } from '@ant-design/icons';
import { registerUser, findUserByUsername, validateUserPassword, saveCurrentUser } from '../utils/userDB';

const { TabPane } = Tabs;

const Login = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      // 查找用户
      const user = await findUserByUsername(values.username);
      
      if (!user) {
        message.error('用户不存在');
        setLoading(false);
        return;
      }
      
      // 验证密码
      if (!validateUserPassword(user, values.password)) {
        message.error('密码错误');
        setLoading(false);
        return;
      }
      
      // 保存用户信息到localStorage
      const userToSave = {
        id: user.id,
        username: user.username,
        email: user.email,
        token: 'fake-jwt-token-' + Date.now()
      };
      
      saveCurrentUser(userToSave);
      message.success('登录成功');
      onLogin(userToSave);
    } catch (error) {
      console.error('登录失败:', error);
      message.error('登录失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values) => {
    setLoading(true);
    try {
      // 创建用户数据
      const userData = {
        id: Date.now() + Math.random(), // 简单的ID生成方式
        username: values.username,
        email: values.email,
        password: values.password, // 在实际应用中，这里应该加密密码
        createdAt: new Date().toISOString()
      };
      
      // 注册用户
      await registerUser(userData);
      
      // 保存用户信息到localStorage
      const userToSave = {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        token: 'fake-jwt-token-' + Date.now()
      };
      
      saveCurrentUser(userToSave);
      message.success('注册成功');
      onLogin(userToSave);
    } catch (error) {
      console.error('注册失败:', error);
      message.error('注册失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 快捷登录处理
  const handleQuickLogin = (provider) => {
    message.info(`正在使用 ${provider} 快捷登录...`);
    // 模拟快捷登录流程
    setTimeout(() => {
      const userToSave = {
        id: Date.now(),
        username: `${provider}_user_${Math.floor(Math.random() * 1000)}`,
        email: `${provider}_user@example.com`,
        token: 'fake-jwt-token-' + Date.now()
      };
      
      saveCurrentUser(userToSave);
      message.success(`${provider} 快捷登录成功`);
      onLogin(userToSave);
    }, 1000);
  };

  // 游客模式登录
  const handleGuestLogin = () => {
    message.info('正在进入游客模式...');
    // 模拟游客登录
    setTimeout(() => {
      const userToSave = {
        id: Date.now(),
        username: '游客用户',
        email: 'guest@example.com',
        token: 'fake-jwt-token-' + Date.now(),
        isGuest: true
      };
      
      saveCurrentUser(userToSave);
      message.success('已进入游客模式');
      onLogin(userToSave);
    }, 1000);
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh' 
    }}>
      <Card title="To-Do List Pro" style={{ width: 400 }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="登录" key="login">
            <Form
              name="login"
              onFinish={handleLogin}
              layout="vertical"
            >
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input prefix={<UserOutlined />} placeholder="用户名" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="密码" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                  登录
                </Button>
              </Form.Item>
            </Form>
            
            <Divider>快捷登录</Divider>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
              <Tooltip title="微信登录">
                <Button 
                  icon={<WechatOutlined />} 
                  onClick={() => handleQuickLogin('微信')}
                  style={{ borderColor: '#07c160', color: '#07c160' }}
                />
              </Tooltip>
              <Tooltip title="QQ登录">
                <Button 
                  icon={<QqOutlined />} 
                  onClick={() => handleQuickLogin('QQ')}
                  style={{ borderColor: '#12b7f5', color: '#12b7f5' }}
                />
              </Tooltip>
              <Tooltip title="Google登录">
                <Button 
                  icon={<GoogleOutlined />} 
                  onClick={() => handleQuickLogin('Google')}
                />
              </Tooltip>
              <Tooltip title="Apple登录">
                <Button 
                  icon={<AppleOutlined />} 
                  onClick={() => handleQuickLogin('Apple')}
                />
              </Tooltip>
            </div>
            
            <Button 
              type="dashed" 
              block 
              onClick={handleGuestLogin}
              style={{ marginBottom: '10px' }}
            >
              游客模式体验
            </Button>
          </TabPane>
          
          <TabPane tab="注册" key="register">
            <Form
              name="register"
              onFinish={handleRegister}
              layout="vertical"
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: '请输入用户名' },
                  { min: 3, message: '用户名至少3个字符' },
                  { max: 20, message: '用户名最多20个字符' }
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="用户名" />
              </Form.Item>
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' }
                ]}
              >
                <Input prefix={<MailOutlined />} placeholder="邮箱" />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 6, message: '密码至少6个字符' }
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="密码" />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: '请确认密码' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入的密码不一致'));
                    },
                  }),
                ]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="确认密码" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                  注册
                </Button>
              </Form.Item>
            </Form>
            
            <Divider>快捷注册</Divider>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
              <Tooltip title="微信注册">
                <Button 
                  icon={<WechatOutlined />} 
                  onClick={() => handleQuickLogin('微信')}
                  style={{ borderColor: '#07c160', color: '#07c160' }}
                />
              </Tooltip>
              <Tooltip title="QQ注册">
                <Button 
                  icon={<QqOutlined />} 
                  onClick={() => handleQuickLogin('QQ')}
                  style={{ borderColor: '#12b7f5', color: '#12b7f5' }}
                />
              </Tooltip>
              <Tooltip title="Google注册">
                <Button 
                  icon={<GoogleOutlined />} 
                  onClick={() => handleQuickLogin('Google')}
                />
              </Tooltip>
            </div>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Login;