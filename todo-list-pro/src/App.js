import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, message, Dropdown, Space } from 'antd';
import { DownOutlined, TrophyOutlined, LockOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import TaskManager from './components/TaskManager';
import TagManager from './components/TagManager';
import Statistics from './components/Statistics';
import Login from './components/Login';
import Guide from './components/Guide';
import Settings from './components/Settings';
import CalendarView from './components/CalendarView';
import KanbanView from './components/KanbanView';
import TimelineView from './components/TimelineView';
import Achievements from './components/Achievements';
import CloudSync from './components/CloudSync';
import DataEncryption from './components/DataEncryption';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import { loadUserFromLocalStorage, removeUserFromLocalStorage } from './utils/storage';
import './App.css';

const { Header, Content, Footer } = Layout;

function App() {
  const [activeTab, setActiveTab] = useState('1');
  const [user, setUser] = useState(null);
  const [showGuide, setShowGuide] = useState(false);
  const [theme, setTheme] = useState('light');
  const [layout, setLayout] = useState('default');
  const [showShortcuts, setShowShortcuts] = useState(false);

  // 组件挂载时检查用户登录状态
  useEffect(() => {
    const savedUser = loadUserFromLocalStorage();
    if (savedUser) {
      setUser(savedUser);
    }
    
    // 检查是否显示新手引导
    const guideShown = localStorage.getItem('todoListPro_guide_shown');
    if (!guideShown) {
      setShowGuide(true);
    }
  }, []);

  // 键盘快捷键处理
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 快捷键帮助
      if (e.key === '?' && !e.ctrlKey && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        setShowShortcuts(true);
      }
      
      // Ctrl + T 切换主题
      if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        setTheme(prevTheme => {
          const newTheme = prevTheme === 'light' ? 'dark' : 'light';
          document.body.className = newTheme === 'dark' ? 'dark-theme' : '';
          return newTheme;
        });
      }
      
      // Ctrl + P 切换隐私模式
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        document.body.classList.toggle('privacy-mode');
        message.info(document.body.classList.contains('privacy-mode') ? '隐私模式已启用' : '隐私模式已禁用');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setActiveTab('1');
  };

  const handleLogout = () => {
    removeUserFromLocalStorage();
    setUser(null);
    setActiveTab('1');
    message.success('已退出登录');
  };

  const handleGuideClose = () => {
    setShowGuide(false);
    localStorage.setItem('todoListPro_guide_shown', 'true');
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    // 应用主题到body
    document.body.className = newTheme === 'dark' ? 'dark-theme' : '';
  };

  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
  };

  // 如果用户未登录，显示登录页面
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case '1':
        return <TaskManager />;
      case '2':
        return <TagManager />;
      case '3':
        return <Statistics />;
      case '4':
        return <CalendarView />;
      case '5':
        return <KanbanView />;
      case '6':
        return <TimelineView />;
      case '7':
        return <Settings onThemeChange={handleThemeChange} onLayoutChange={handleLayoutChange} />;
      case '8':
        return <Achievements />;
      case '9':
        return <CloudSync />;
      case '10':
        return <DataEncryption />;
      default:
        return <TaskManager />;
    }
  };

  const viewMenu = (
    <Menu onClick={({ key }) => setActiveTab(key)}>
      <Menu.Item key="1">列表视图</Menu.Item>
      <Menu.Item key="4">日历视图</Menu.Item>
      <Menu.Item key="5">看板视图</Menu.Item>
      <Menu.Item key="6">时间轴视图</Menu.Item>
    </Menu>
  );

  return (
    <Layout className={`layout ${theme} ${layout}`}>
      <Header>
        <div className="logo">To-Do List Pro</div>
        <Menu 
          theme="dark" 
          mode="horizontal" 
          defaultSelectedKeys={['1']} 
          selectedKeys={[activeTab]}
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key="1">任务管理</Menu.Item>
          <Menu.Item key="2">标签管理</Menu.Item>
          <Menu.Item key="3">统计分析</Menu.Item>
          <Dropdown overlay={viewMenu}>
            <Menu.Item>
              <Space>
                视图切换
                <DownOutlined />
              </Space>
            </Menu.Item>
          </Dropdown>
          <Menu.Item key="7">设置</Menu.Item>
          <Menu.Item key="8">
            <TrophyOutlined /> 成就
          </Menu.Item>
          <Menu.Item key="9">云同步</Menu.Item>
          <Menu.Item key="10">
            <LockOutlined /> 安全与隐私
          </Menu.Item>
          <Menu.Item key="11" style={{ float: 'right' }}>
            <Button 
              type="link" 
              onClick={() => setShowShortcuts(true)} 
              style={{ color: 'white', marginRight: '20px' }}
              icon={<QuestionCircleOutlined />}
            >
              快捷键
            </Button>
            <Button type="link" onClick={() => setShowGuide(true)} style={{ color: 'white', marginRight: '20px' }}>
              使用指南
            </Button>
            <Button type="link" onClick={handleLogout} style={{ color: 'white' }}>
              退出登录 ({user.username})
            </Button>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content">
          {renderContent()}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>To-Do List Pro ©2025 Created by Qoder</Footer>
      <Guide visible={showGuide} onClose={handleGuideClose} />
      <KeyboardShortcuts visible={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </Layout>
  );
}

export default App;