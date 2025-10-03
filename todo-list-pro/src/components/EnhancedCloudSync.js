// components/EnhancedCloudSync.js
import React, { useState, useEffect } from 'react';
import { Card, Button, Progress, Alert, Space, Typography, Divider, Switch, Form, Input, InputNumber } from 'antd';
import { SyncOutlined, CloudUploadOutlined, CloudDownloadOutlined, CheckCircleOutlined, WarningOutlined, SettingOutlined } from '@ant-design/icons';
import useTodoStore from '../store/todoStore';
import useEnhancedStorage from '../hooks/useEnhancedStorage';
import { performFullSync } from '../services/syncService';
import { loadSettingsFromLocalStorage } from '../utils/storage';

const { Title, Text } = Typography;

const EnhancedCloudSync = () => {
  const tasks = useTodoStore(state => state.tasks);
  const tags = useTodoStore(state => state.tags);
  const user = useTodoStore(state => state.user);
  
  const { performSynchronization, syncToPersistentStorage } = useEnhancedStorage();
  
  const [syncStatus, setSyncStatus] = useState({
    isSyncing: false,
    lastSync: null,
    progress: 0,
    message: '',
    error: null
  });
  
  const [cloudSyncSettings, setCloudSyncSettings] = useState({
    enabled: false,
    serverUrl: '',
    syncInterval: 30,
    autoSync: true
  });
  
  const [networkStatus, setNetworkStatus] = useState(navigator.onLine);
  const [showSettings, setShowSettings] = useState(false);

  // 监听网络状态变化
  useEffect(() => {
    const handleOnline = () => {
      setNetworkStatus(true);
    };
    
    const handleOffline = () => {
      setNetworkStatus(false);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 加载云同步设置
  useEffect(() => {
    const settings = loadSettingsFromLocalStorage();
    if (settings && settings.cloudSync) {
      setCloudSyncSettings(settings.cloudSync);
    }
  }, []);

  // 自动同步
  useEffect(() => {
    if (cloudSyncSettings.enabled && cloudSyncSettings.autoSync && networkStatus && !syncStatus.isSyncing) {
      // 防抖处理
      const syncTimer = setTimeout(() => {
        handleManualSync();
      }, cloudSyncSettings.syncInterval * 1000); // 使用设置的同步间隔
      
      return () => clearTimeout(syncTimer);
    }
  }, [cloudSyncSettings, networkStatus, tasks, tags, syncStatus.isSyncing]);

  // 手动同步数据
  const handleManualSync = async () => {
    if (syncStatus.isSyncing) {
      return;
    }
    
    if (!cloudSyncSettings.enabled) {
      setSyncStatus(prev => ({
        ...prev,
        error: '云同步未启用，请在设置中启用云同步功能'
      }));
      return;
    }
    
    if (!cloudSyncSettings.serverUrl) {
      setSyncStatus(prev => ({
        ...prev,
        error: '未配置服务器地址，请在设置中配置云同步服务器地址'
      }));
      return;
    }
    
    setSyncStatus(prev => ({
      ...prev,
      isSyncing: true,
      progress: 0,
      message: '开始同步...',
      error: null
    }));
    
    try {
      // 更新进度
      setSyncStatus(prev => ({
        ...prev,
        progress: 20,
        message: '正在同步任务数据...'
      }));
      
      // 执行同步
      const result = await performFullSync(tasks, tags, cloudSyncSettings.serverUrl);
      
      // 更新进度
      setSyncStatus(prev => ({
        ...prev,
        progress: 80,
        message: '正在保存数据...'
      }));
      
      // 保存到本地存储
      await syncToPersistentStorage();
      
      // 完成同步
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        progress: 100,
        message: result.success ? '同步完成' : `同步完成，但有警告: ${result.message}`,
        lastSync: new Date(),
        error: result.success ? null : result.message
      }));
      
      // 3秒后清除消息
      setTimeout(() => {
        setSyncStatus(prev => ({
          ...prev,
          message: '',
          progress: 0
        }));
      }, 3000);
    } catch (error) {
      setSyncStatus(prev => ({
        ...prev,
        isSyncing: false,
        progress: 0,
        message: '',
        error: error.message
      }));
    }
  };

  // 仅同步任务
  const handleSyncTasks = async () => {
    // 这里可以实现仅同步任务的逻辑
    // 为简化，我们直接调用完整同步
    handleManualSync();
  };

  // 仅同步标签
  const handleSyncTags = async () => {
    // 这里可以实现仅同步标签的逻辑
    // 为简化，我们直接调用完整同步
    handleManualSync();
  };

  // 更新云同步设置
  const updateCloudSyncSettings = (newSettings) => {
    setCloudSyncSettings(newSettings);
    // 这里应该保存到本地存储，但在实际应用中，设置应该通过Settings组件来管理
  };

  return (
    <Card title="增强云同步" style={{ margin: '20px 0' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        {/* 网络状态 */}
        <Alert
          message={
            <Space>
              {networkStatus ? (
                <>
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  <Text>网络连接正常</Text>
                </>
              ) : (
                <>
                  <WarningOutlined style={{ color: '#faad14' }} />
                  <Text>网络连接断开</Text>
                </>
              )}
            </Space>
          }
          type={networkStatus ? "success" : "warning"}
          showIcon
        />
        
        {/* 云同步状态 */}
        <Alert
          message={
            <Space>
              {cloudSyncSettings.enabled ? (
                <>
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  <Text>云同步已启用</Text>
                </>
              ) : (
                <>
                  <WarningOutlined style={{ color: '#faad14' }} />
                  <Text>云同步未启用</Text>
                </>
              )}
            </Space>
          }
          type={cloudSyncSettings.enabled ? "success" : "warning"}
          showIcon
        />
        
        {/* 用户信息 */}
        {user ? (
          <Alert
            message={`当前用户: ${user.username}`}
            type="info"
            showIcon
          />
        ) : (
          <Alert
            message="未登录，数据将仅保存在本地"
            type="warning"
            showIcon
          />
        )}
        
        <Divider />
        
        {/* 同步控制 */}
        <div>
          <Space>
            <Button
              type="primary"
              icon={<SyncOutlined />}
              onClick={handleManualSync}
              loading={syncStatus.isSyncing}
              disabled={!networkStatus || !cloudSyncSettings.enabled}
            >
              立即同步
            </Button>
            <Button
              icon={<CloudUploadOutlined />}
              onClick={handleSyncTasks}
              disabled={!networkStatus || syncStatus.isSyncing || !cloudSyncSettings.enabled}
            >
              上传任务
            </Button>
            <Button
              icon={<CloudDownloadOutlined />}
              onClick={handleSyncTags}
              disabled={!networkStatus || syncStatus.isSyncing || !cloudSyncSettings.enabled}
            >
              下载标签
            </Button>
            <Button
              icon={<SettingOutlined />}
              onClick={() => setShowSettings(!showSettings)}
            >
              {showSettings ? '隐藏设置' : '同步设置'}
            </Button>
          </Space>
        </div>
        
        {/* 云同步设置 */}
        {showSettings && (
          <Card size="small" title="云同步设置">
            <Form layout="vertical">
              <Form.Item label="启用云同步">
                <Switch 
                  checked={cloudSyncSettings.enabled} 
                  onChange={(value) => updateCloudSyncSettings({...cloudSyncSettings, enabled: value})} 
                />
              </Form.Item>
              
              {cloudSyncSettings.enabled && (
                <>
                  <Form.Item label="服务器地址">
                    <Input 
                      value={cloudSyncSettings.serverUrl} 
                      onChange={(e) => updateCloudSyncSettings({...cloudSyncSettings, serverUrl: e.target.value})} 
                      placeholder="https://your-server.com/api"
                    />
                  </Form.Item>
                  
                  <Form.Item label="同步间隔（秒）">
                    <InputNumber 
                      min={10} 
                      max={300} 
                      value={cloudSyncSettings.syncInterval} 
                      onChange={(value) => updateCloudSyncSettings({...cloudSyncSettings, syncInterval: value})} 
                    />
                  </Form.Item>
                  
                  <Form.Item label="自动同步">
                    <Switch 
                      checked={cloudSyncSettings.autoSync} 
                      onChange={(value) => updateCloudSyncSettings({...cloudSyncSettings, autoSync: value})} 
                    />
                  </Form.Item>
                  
                  <Form.Item>
                    <Text type="secondary">
                      {'注意：请在"设置" -> "云同步"中配置完整的云同步参数'}
                    </Text>
                  </Form.Item>
                </>
              )}
            </Form>
          </Card>
        )}
        
        {/* 同步进度 */}
        {syncStatus.isSyncing && (
          <div>
            <Text>{syncStatus.message}</Text>
            <Progress percent={syncStatus.progress} status="active" />
          </div>
        )}
        
        {/* 同步结果 */}
        {syncStatus.message && !syncStatus.isSyncing && (
          <Alert
            message={syncStatus.message}
            type="success"
            showIcon
          />
        )}
        
        {/* 错误信息 */}
        {syncStatus.error && (
          <Alert
            message="同步错误"
            description={syncStatus.error}
            type="error"
            showIcon
          />
        )}
        
        {/* 上次同步时间 */}
        {syncStatus.lastSync && (
          <Text type="secondary">
            上次同步: {syncStatus.lastSync.toLocaleString()}
          </Text>
        )}
        
        {/* 数据统计 */}
        <Divider>数据统计</Divider>
        <div>
          <Space>
            <Text>任务数量: {tasks.length}</Text>
            <Text>标签数量: {tags.length}</Text>
          </Space>
        </div>
      </Space>
    </Card>
  );
};

export default EnhancedCloudSync;