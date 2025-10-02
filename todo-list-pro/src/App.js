import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import TaskManager from './components/TaskManager';
import TagManager from './components/TagManager';
import './App.css';

const { Header, Content, Footer } = Layout;

function App() {
  const [activeTab, setActiveTab] = useState('1');

  const renderContent = () => {
    switch (activeTab) {
      case '1':
        return <TaskManager />;
      case '2':
        return <TagManager />;
      case '3':
        return <div>统计分析功能正在开发中...</div>;
      default:
        return <TaskManager />;
    }
  };

  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu 
          theme="dark" 
          mode="horizontal" 
          defaultSelectedKeys={['1']} 
          selectedKeys={[activeTab]}
          onClick={({ key }) => setActiveTab(key)}
        >
          <Menu.Item key="1">任务管理</Menu.Item>
          <Menu.Item key="2">标签管理</Menu.Item>
          <Menu.Item key="3">统计分析</Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content">
          {renderContent()}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>To-Do List Pro ©2025 Created by Qoder</Footer>
    </Layout>
  );
}

export default App;