import React, { useState, useEffect } from 'react';
import { Card, Switch, Select, Button, message, Divider, Row, Col, Tabs, ColorPicker, Slider, Input, Form, InputNumber } from 'antd';
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
    rememberLastFilter: true,
    borderRadius: 8,
    fontSize: 14,
    primaryColor: '#177ddc',
    // 云同步设置
    cloudSync: {
      enabled: false,
      serverUrl: '',
      syncInterval: 30, // 同步间隔（秒）
      autoSync: true
    },
    // AI设置
    ai: {
      enabled: false,
      serverUrl: '',
      apiKey: ''
    }
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
    
    // 应用样式变化
    document.documentElement.style.setProperty('--primary-color', newSettings.primaryColor);
    document.documentElement.style.setProperty('--border-radius', `${newSettings.borderRadius}px`);
    document.documentElement.style.setProperty('--font-size', `${newSettings.fontSize}px`);
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

  const handleBorderRadiusChange = (value) => {
    const newSettings = { ...settings, borderRadius: value };
    saveSettings(newSettings);
  };

  const handleFontSizeChange = (value) => {
    const newSettings = { ...settings, fontSize: value };
    saveSettings(newSettings);
  };

  const handlePrimaryColorChange = (value) => {
    const newSettings = { ...settings, primaryColor: value.toHexString() };
    saveSettings(newSettings);
  };

  // 云同步设置变更处理
  const handleCloudSyncChange = (field, value) => {
    const newSettings = {
      ...settings,
      cloudSync: {
        ...settings.cloudSync,
        [field]: value
      }
    };
    saveSettings(newSettings);
  };

  // AI设置变更处理
  const handleAIChange = (field, value) => {
    const newSettings = {
      ...settings,
      ai: {
        ...settings.ai,
        [field]: value
      }
    };
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
                  <Option value="blue">蓝色主题</Option>
                  <Option value="green">绿色主题</Option>
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
          
          <Divider />
          
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <h3>界面美化</h3>
              <div style={{ marginBottom: '10px' }}>
                <div>圆角大小: {settings.borderRadius}px</div>
                <Slider 
                  min={0} 
                  max={20} 
                  value={settings.borderRadius} 
                  onChange={handleBorderRadiusChange} 
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <div>字体大小: {settings.fontSize}px</div>
                <Slider 
                  min={12} 
                  max={20} 
                  value={settings.fontSize} 
                  onChange={handleFontSizeChange} 
                />
              </div>
            </Col>
            
            <Col span={12}>
              <h3>主题色</h3>
              <div style={{ marginBottom: '10px' }}>
                <ColorPicker 
                  value={settings.primaryColor} 
                  onChange={handlePrimaryColorChange} 
                  showText 
                />
                <div style={{ marginTop: '10px' }}>
                  <Button onClick={() => handlePrimaryColorChange({ toHexString: () => '#177ddc' })}>恢复默认</Button>
                </div>
              </div>
            </Col>
          </Row>
        </TabPane>
        
        <TabPane tab="云同步" key="2">
          <Form layout="vertical">
            <Form.Item label="启用云同步">
              <Switch 
                checked={settings.cloudSync.enabled} 
                onChange={(value) => handleCloudSyncChange('enabled', value)} 
              />
            </Form.Item>
            
            {settings.cloudSync.enabled && (
              <>
                <Form.Item label="服务器地址">
                  <Input 
                    value={settings.cloudSync.serverUrl} 
                    onChange={(e) => handleCloudSyncChange('serverUrl', e.target.value)} 
                    placeholder="https://your-server.com/api"
                  />
                </Form.Item>
                
                <Form.Item label="同步间隔（秒）">
                  <InputNumber 
                    min={10} 
                    max={300} 
                    value={settings.cloudSync.syncInterval} 
                    onChange={(value) => handleCloudSyncChange('syncInterval', value)} 
                  />
                </Form.Item>
                
                <Form.Item label="自动同步">
                  <Switch 
                    checked={settings.cloudSync.autoSync} 
                    onChange={(value) => handleCloudSyncChange('autoSync', value)} 
                  />
                </Form.Item>
                
                <Form.Item>
                  <Button type="primary" onClick={() => message.info('同步功能已更新')}>
                    保存同步设置
                  </Button>
                </Form.Item>
              </>
            )}
          </Form>
        </TabPane>
        
        <TabPane tab="AI功能" key="3">
          <Form layout="vertical">
            <Form.Item label="启用AI功能">
              <Switch 
                checked={settings.ai.enabled} 
                onChange={(value) => handleAIChange('enabled', value)} 
              />
            </Form.Item>
            
            {settings.ai.enabled && (
              <>
                <Form.Item label="AI服务器地址">
                  <Input 
                    value={settings.ai.serverUrl} 
                    onChange={(e) => handleAIChange('serverUrl', e.target.value)} 
                    placeholder="https://your-ai-server.com/api"
                  />
                </Form.Item>
                
                <Form.Item label="API密钥">
                  <Input.Password 
                    value={settings.ai.apiKey} 
                    onChange={(e) => handleAIChange('apiKey', e.target.value)} 
                    placeholder="输入您的API密钥"
                  />
                </Form.Item>
                
                <Form.Item>
                  <Button type="primary" onClick={() => message.info('AI设置已更新')}>
                    保存AI设置
                  </Button>
                </Form.Item>
              </>
            )}
          </Form>
        </TabPane>
        
        <TabPane tab="隐私与安全" key="4">
          <PrivacySettings />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default Settings;