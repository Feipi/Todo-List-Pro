import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, message, Dropdown } from 'antd';
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
import EnhancedCloudSync from './components/EnhancedCloudSync';
import DataEncryption from './components/DataEncryption';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import useTodoStore from './store/todoStore';
import { loadCurrentUser } from './utils/userDB';
import './App.css';

const { Header, Content, Footer } = Layout;

function App() {
  const [activeTab, setActiveTab] = useState('1');
  const user = useTodoStore(state => state.user);
  const setUser = useTodoStore(state => state.setUser);
  const logout = useTodoStore(state => state.logout);
  const initialize = useTodoStore(state => state.initialize);
  
  const [showGuide, setShowGuide] = useState(false);
  const [theme, setTheme] = useState('light');
  const [layout, setLayout] = useState('default');
  const [showShortcuts, setShowShortcuts] = useState(false);

  // 组件挂载时检查用户登录状态
  useEffect(() => {
    // 初始化用户状态
    initialize();
    
    // 检查是否显示新手引导
    const guideShown = localStorage.getItem('todoListPro_guide_shown');
    if (!guideShown) {
      setShowGuide(true);
    }
  }, [initialize]);

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
    logout();
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
        return <EnhancedCloudSync />;
      case '10':
        return <DataEncryption />;
      default:
        return <TaskManager />;
    }
  };

  // 使用新的items API替换旧的children API
  const menuItems = [
    { key: '1', label: '列表视图' },
    { key: '4', label: '日历视图' },
    { key: '5', label: '看板视图' },
    { key: '6', label: '时间轴视图' }
  ];

  const viewMenu = {
    items: menuItems,
    onClick: ({ key }) => setActiveTab(key)
  };

  // 主菜单项
  const mainMenuItems = [
    { key: '1', label: '任务管理' },
    { key: '2', label: '标签管理' },
    { key: '3', label: '统计分析' },
    {
      key: 'views',
      label: (
        <Dropdown menu={viewMenu}>
          <Button type="link" style={{ color: 'white' }}>
            视图切换 <DownOutlined />
          </Button>
        </Dropdown>
      )
    },
    { key: '7', label: '设置' },
    { 
      key: '8', 
      label: (
        <>
          <TrophyOutlined /> 成就
        </>
      )
    },
    { key: '9', label: '云同步' },
    { 
      key: '10', 
      label: (
        <>
          <LockOutlined /> 安全与隐私
        </>
      )
    },
    { 
      key: '11', 
      label: (
        <>
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
        </>
      ),
      style: { float: 'right' }
    }
  ];

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
          items={mainMenuItems}
          onClick={({ key }) => {
            // 特殊处理视图切换下拉菜单
            if (key === 'views') return;
            // 特殊处理右侧按钮
            if (key === '11') return;
            setActiveTab(key);
          }}
        />
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