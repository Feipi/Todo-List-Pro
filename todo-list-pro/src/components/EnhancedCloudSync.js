// components/EnhancedCloudSync.js
import React, { useState, useEffect } from 'react';
import { Card, Button, Progress, Alert, Space, Typography, Divider, Switch } from 'antd';
import { SyncOutlined, CloudUploadOutlined, CloudDownloadOutlined, CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';
import useTodoStore from '../store/todoStore';
import useEnhancedStorage from '../hooks/useEnhancedStorage';
import { performFullSync } from '../services/syncService';

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
  
  const [autoSync, setAutoSync] = useState(true);
  const [networkStatus, setNetworkStatus] = useState(navigator.onLine);

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

  // 自动同步
  useEffect(() => {
    if (autoSync && networkStatus && !syncStatus.isSyncing) {
      // 防抖处理
      const syncTimer = setTimeout(() => {
        handleManualSync();
      }, 30000); // 30秒自动同步一次
      
      return () => clearTimeout(syncTimer);
    }
  }, [autoSync, networkStatus, tasks, tags]);

  // 手动同步数据
  const handleManualSync = async () => {
    if (syncStatus.isSyncing) {
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
      const result = await performFullSync(tasks, tags);
      
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
              disabled={!networkStatus}
            >
              立即同步
            </Button>
            <Button
              icon={<CloudUploadOutlined />}
              onClick={handleSyncTasks}
              disabled={!networkStatus || syncStatus.isSyncing}
            >
              上传任务
            </Button>
            <Button
              icon={<CloudDownloadOutlined />}
              onClick={handleSyncTags}
              disabled={!networkStatus || syncStatus.isSyncing}
            >
              下载标签
            </Button>
          </Space>
        </div>
        
        {/* 自动同步开关 */}
        <div>
          <Space>
            <Text>自动同步:</Text>
            <Switch
              checked={autoSync}
              onChange={setAutoSync}
              checkedChildren="开启"
              unCheckedChildren="关闭"
            />
          </Space>
        </div>
        
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