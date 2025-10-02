import React, { useState, useEffect } from 'react';
import { Card, Switch, Select, Button, message, Divider, Row, Col, Tabs } from 'antd';
import { saveSettingsToLocalStorage, loadSettingsFromLocalStorage } from '../utils/storage';
import PrivacySettings from './PrivacySettings';

const { Option } = Select;
const { TabPane } = Tabs;

const Settings = ({ onThemeChange, onLayoutChange }) => {
  const [settings, setSettings] = useState({
    theme: 'light',
    layout: 'default',
    defaultView: 'list',
    enableAnimations: true,
    enableKeyboardShortcuts: true,
    rememberLastFilter: true
  });

  // 组件挂载时加载设置
  useEffect(() => {
    const loadedSettings = loadSettingsFromLocalStorage();
    if (loadedSettings) {
      setSettings(loadedSettings);
      // 应用主题
      onThemeChange(loadedSettings.theme);
      // 应用布局
      onLayoutChange(loadedSettings.layout);
    }
  }, [onThemeChange, onLayoutChange]);

  // 保存设置
  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    saveSettingsToLocalStorage(newSettings);
    message.success('设置已保存');
    
    // 应用设置
    onThemeChange(newSettings.theme);
    onLayoutChange(newSettings.layout);
  };

  const handleThemeChange = (value) => {
    const newSettings = { ...settings, theme: value };
    saveSettings(newSettings);
  };

  const handleLayoutChange = (value) => {
    const newSettings = { ...settings, layout: value };
    saveSettings(newSettings);
  };

  const handleDefaultViewChange = (value) => {
    const newSettings = { ...settings, defaultView: value };
    saveSettings(newSettings);
  };

  const handleToggle = (field) => {
    const newSettings = { ...settings, [field]: !settings[field] };
    saveSettings(newSettings);
  };

  return (
    <Card title="设置" style={{ margin: '20px 0' }}>
      <Tabs defaultActiveKey="1">
        <TabPane tab="常规设置" key="1">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <h3>主题设置</h3>
              <div style={{ marginBottom: '10px' }}>
                <Select
                  value={settings.theme}
                  onChange={handleThemeChange}
                  style={{ width: '100%' }}
                >
                  <Option value="light">浅色主题</Option>
                  <Option value="dark">深色主题</Option>
                </Select>
              </div>
            </Col>
            
            <Col span={12}>
              <h3>布局设置</h3>
              <div style={{ marginBottom: '10px' }}>
                <Select
                  value={settings.layout}
                  onChange={handleLayoutChange}
                  style={{ width: '100%' }}
                >
                  <Option value="default">默认布局</Option>
                  <Option value="compact">紧凑布局</Option>
                  <Option value="spacious">宽松布局</Option>
                </Select>
              </div>
            </Col>
          </Row>
          
          <Divider />
          
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <h3>默认视图</h3>
              <div style={{ marginBottom: '10px' }}>
                <Select
                  value={settings.defaultView}
                  onChange={handleDefaultViewChange}
                  style={{ width: '100%' }}
                >
                  <Option value="list">列表视图</Option>
                  <Option value="calendar">日历视图</Option>
                  <Option value="kanban">看板视图</Option>
                  <Option value="timeline">时间轴视图</Option>
                </Select>
              </div>
            </Col>
            
            <Col span={12}>
              <h3>功能设置</h3>
              <div style={{ marginBottom: '10px' }}>
                <div>动画效果 <Switch checked={settings.enableAnimations} onChange={() => handleToggle('enableAnimations')} /></div>
                <div>键盘快捷键 <Switch checked={settings.enableKeyboardShortcuts} onChange={() => handleToggle('enableKeyboardShortcuts')} /></div>
                <div>记住筛选条件 <Switch checked={settings.rememberLastFilter} onChange={() => handleToggle('rememberLastFilter')} /></div>
              </div>
            </Col>
          </Row>
        </TabPane>
        
        <TabPane tab="隐私与安全" key="2">
          <PrivacySettings />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default Settings;