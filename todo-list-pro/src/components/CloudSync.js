import React, { useState } from 'react';
import { Card, Button, message, Upload, Modal } from 'antd';
import { UploadOutlined, DownloadOutlined, SyncOutlined } from '@ant-design/icons';

const CloudSync = () => {
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, success, error
  const [backupStatus, setBackupStatus] = useState('idle'); // idle, backingup, success, error

  // 模拟同步到云端
  const handleSyncToCloud = () => {
    setSyncStatus('syncing');
    // 模拟网络请求
    setTimeout(() => {
      setSyncStatus('success');
      message.success('数据已同步到云端');
    }, 2000);
  };

  // 模拟从云端同步
  const handleSyncFromCloud = () => {
    setSyncStatus('syncing');
    // 模拟网络请求
    setTimeout(() => {
      setSyncStatus('success');
      message.success('数据已从云端同步');
    }, 2000);
  };

  // 模拟备份数据
  const handleBackup = () => {
    setBackupStatus('backingup');
    // 模拟备份过程
    setTimeout(() => {
      setBackupStatus('success');
      message.success('数据备份完成');
    }, 1500);
  };

  // 导出数据
  const handleExport = () => {
    // 获取所有数据
    const tasks = JSON.parse(localStorage.getItem('todoListPro_tasks') || '[]');
    const tags = JSON.parse(localStorage.getItem('todoListPro_tags') || '[]');
    const settings = JSON.parse(localStorage.getItem('todoListPro_settings') || '{}');
    const templates = JSON.parse(localStorage.getItem('todoListPro_templates') || '[]');
    const phrases = JSON.parse(localStorage.getItem('todoListPro_quickPhrases') || '[]');
    const filters = JSON.parse(localStorage.getItem('todoListPro_savedFilters') || '[]');
    const achievements = JSON.parse(localStorage.getItem('todoListPro_achievements') || '[]');
    const user = JSON.parse(localStorage.getItem('todoListPro_user') || '{}');
    
    // 创建导出数据对象
    const exportData = {
      tasks,
      tags,
      settings,
      templates,
      phrases,
      filters,
      achievements,
      user,
      exportDate: new Date().toISOString()
    };
    
    // 创建下载链接
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `todo-list-pro-export-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    message.success('数据导出成功');
  };

  // 导入数据
  const handleImport = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target.result);
        
        // 确认是否覆盖数据
        Modal.confirm({
          title: '确认导入',
          content: '导入将覆盖当前所有数据，是否继续？',
          onOk() {
            // 保存导入的数据到localStorage
            if (importData.tasks) {
              localStorage.setItem('todoListPro_tasks', JSON.stringify(importData.tasks));
            }
            if (importData.tags) {
              localStorage.setItem('todoListPro_tags', JSON.stringify(importData.tags));
            }
            if (importData.settings) {
              localStorage.setItem('todoListPro_settings', JSON.stringify(importData.settings));
            }
            if (importData.templates) {
              localStorage.setItem('todoListPro_templates', JSON.stringify(importData.templates));
            }
            if (importData.phrases) {
              localStorage.setItem('todoListPro_quickPhrases', JSON.stringify(importData.phrases));
            }
            if (importData.filters) {
              localStorage.setItem('todoListPro_savedFilters', JSON.stringify(importData.filters));
            }
            if (importData.achievements) {
              localStorage.setItem('todoListPro_achievements', JSON.stringify(importData.achievements));
            }
            if (importData.user) {
              localStorage.setItem('todoListPro_user', JSON.stringify(importData.user));
            }
            
            message.success('数据导入成功，请刷新页面查看');
          }
        });
      } catch (error) {
        message.error('导入文件格式错误');
      }
    };
    reader.readAsText(file);
    return false;
  };

  return (
    <Card title="跨平台同步" style={{ margin: '20px 0' }}>
      <div style={{ marginBottom: '20px' }}>
        <h3>云同步</h3>
        <p>在多设备间实时同步您的任务数据</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button 
            type="primary" 
            icon={<SyncOutlined />} 
            onClick={handleSyncToCloud}
            loading={syncStatus === 'syncing'}
          >
            同步到云端
          </Button>
          <Button 
            icon={<SyncOutlined />} 
            onClick={handleSyncFromCloud}
            loading={syncStatus === 'syncing'}
          >
            从云端同步
          </Button>
        </div>
        {syncStatus === 'success' && (
          <p style={{ color: '#52c41a', marginTop: '10px' }}>✓ 同步成功</p>
        )}
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <h3>数据备份</h3>
        <p>自动备份重要数据，防止数据丢失</p>
        <Button 
          type="primary" 
          onClick={handleBackup}
          loading={backupStatus === 'backingup'}
        >
          立即备份
        </Button>
        {backupStatus === 'success' && (
          <p style={{ color: '#52c41a', marginTop: '10px' }}>✓ 备份完成</p>
        )}
      </div>
      
      <div>
        <h3>数据导入/导出</h3>
        <p>支持与其他任务管理工具的数据交换</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button 
            type="primary" 
            icon={<DownloadOutlined />} 
            onClick={handleExport}
          >
            导出数据
          </Button>
          <Upload 
            beforeUpload={handleImport}
            showUploadList={false}
            accept=".json"
          >
            <Button icon={<UploadOutlined />}>导入数据</Button>
          </Upload>
        </div>
      </div>
    </Card>
  );
};

export default CloudSync;