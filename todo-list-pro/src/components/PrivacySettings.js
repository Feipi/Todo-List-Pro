import React, { useState } from 'react';
import { Card, Switch, Button, message, Modal, Input, List, Typography } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined, LockOutlined, UnlockOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { saveTasksToLocalStorage, loadTasksFromLocalStorage } from '../utils/storage';

const { Title, Text } = Typography;

const PrivacySettings = () => {
  const [privacyMode, setPrivacyMode] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [operationLogs, setOperationLogs] = useState([
    { id: 1, action: '登录', time: '2025-10-01 09:00:00', ip: '192.168.1.100' },
    { id: 2, action: '添加任务', time: '2025-10-01 09:05:00', ip: '192.168.1.100' },
    { id: 3, action: '编辑任务', time: '2025-10-01 09:10:00', ip: '192.168.1.100' },
    { id: 4, action: '删除任务', time: '2025-10-01 09:15:00', ip: '192.168.1.100' }
  ]);
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);
  const [importData, setImportData] = useState('');

  // 切换隐私模式
  const togglePrivacyMode = (checked) => {
    setPrivacyMode(checked);
    message.success(checked ? '隐私模式已开启' : '隐私模式已关闭');
  };

  // 导出数据
  const exportData = () => {
    const tasks = loadTasksFromLocalStorage();
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'todo-list-data.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    // 记录操作日志
    const newLog = {
      id: Date.now(),
      action: '导出数据',
      time: new Date().toLocaleString(),
      ip: '192.168.1.100'
    };
    setOperationLogs([newLog, ...operationLogs]);
    
    message.success('数据导出成功');
  };

  // 导入数据
  const importDataFromFile = () => {
    try {
      const tasks = JSON.parse(importData);
      saveTasksToLocalStorage(tasks);
      
      // 记录操作日志
      const newLog = {
        id: Date.now(),
        action: '导入数据',
        time: new Date().toLocaleString(),
        ip: '192.168.1.100'
      };
      setOperationLogs([newLog, ...operationLogs]);
      
      message.success('数据导入成功');
      setIsImportModalVisible(false);
      setImportData('');
    } catch (error) {
      message.error('数据格式错误，请检查后重试');
    }
  };

  // 清除所有数据
  const clearAllData = () => {
    Modal.confirm({
      title: '确认清除所有数据',
      content: '此操作将永久删除所有任务数据，且无法恢复。是否继续？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        localStorage.removeItem('todoListPro_tasks');
        localStorage.removeItem('todoListPro_tags');
        localStorage.removeItem('todoListPro_templates');
        localStorage.removeItem('todoListPro_quickPhrases');
        localStorage.removeItem('todoListPro_settings');
        localStorage.removeItem('todoListPro_savedFilters');
        localStorage.removeItem('todoListPro_achievements');
        
        // 记录操作日志
        const newLog = {
          id: Date.now(),
          action: '清除所有数据',
          time: new Date().toLocaleString(),
          ip: '192.168.1.100'
        };
        setOperationLogs([newLog, ...operationLogs]);
        
        message.success('所有数据已清除');
      }
    });
  };

  return (
    <Card title="隐私与安全" style={{ margin: '20px 0' }}>
      <div style={{ marginBottom: '20px' }}>
        <Title level={4}>隐私设置</Title>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ flex: 1 }}>
            <Text strong>隐私模式</Text>
            <br />
            <Text type="secondary">开启后将隐藏任务内容的详细信息</Text>
          </div>
          <Switch 
            checked={privacyMode} 
            onChange={togglePrivacyMode}
            checkedChildren={<EyeInvisibleOutlined />}
            unCheckedChildren={<EyeOutlined />}
          />
        </div>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <Title level={4}>数据管理</Title>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <Button 
            icon={<DownloadOutlined />} 
            onClick={exportData}
          >
            导出数据
          </Button>
          <Button 
            icon={<UploadOutlined />} 
            onClick={() => setIsImportModalVisible(true)}
          >
            导入数据
          </Button>
          <Button 
            icon={<UnlockOutlined />} 
            danger
            onClick={clearAllData}
          >
            清除所有数据
          </Button>
        </div>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <Title level={4}>操作日志</Title>
        <div style={{ marginBottom: '10px' }}>
          <Button 
            onClick={() => setShowLogs(!showLogs)}
          >
            {showLogs ? '隐藏日志' : '查看日志'}
          </Button>
        </div>
        
        {showLogs && (
          <List
            dataSource={operationLogs}
            renderItem={log => (
              <List.Item>
                <List.Item.Meta
                  title={log.action}
                  description={`${log.time} - ${log.ip}`}
                />
              </List.Item>
            )}
          />
        )}
      </div>
      
      {/* 导入数据模态框 */}
      <Modal
        title="导入数据"
        visible={isImportModalVisible}
        onCancel={() => {
          setIsImportModalVisible(false);
          setImportData('');
        }}
        onOk={importDataFromFile}
      >
        <Text>请粘贴要导入的JSON数据：</Text>
        <Input.TextArea
          rows={10}
          value={importData}
          onChange={(e) => setImportData(e.target.value)}
          placeholder='{"tasks": [...], "tags": [...]}'
        />
      </Modal>
    </Card>
  );
};

export default PrivacySettings;