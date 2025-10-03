import React, { useState } from 'react';
import { Card, Switch, Button, message, Modal, Input, List, Typography, Divider, Collapse, Form, Select } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined, LockOutlined, UnlockOutlined, DownloadOutlined, UploadOutlined, SecurityScanOutlined, KeyOutlined } from '@ant-design/icons';
import { saveTasksToLocalStorage, loadTasksFromLocalStorage } from '../utils/storage';
import { encryptObject, decryptObject } from '../utils/encryption';

const { Title, Text } = Typography;
const { Panel } = Collapse;
const { Option } = Select;

const PrivacySettings = () => {
  const [privacyMode, setPrivacyMode] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [operationLogs, setOperationLogs] = useState([
    { id: 1, action: '登录', time: '2025-10-01 09:00:00', ip: '192.168.1.100' },
    { id: 2, action: '添加任务', time: '2025-10-01 09:05:00', ip: '192.168.1.100' },
    { id: 3, action: '编辑任务', time: '2025-10-01 09:10:00', ip: '192.168.1.100' },
    { id: 4, action: '删除任务', time: '2025-10-01 09:15:00', ip: '192.168.1.100' }
  ]);
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);
  const [importData, setImportData] = useState('');
  const [encryptionEnabled, setEncryptionEnabled] = useState(false);
  const [masterPassword, setMasterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSecuritySettings, setShowSecuritySettings] = useState(false);

  // 切换隐私模式
  const togglePrivacyMode = (checked) => {
    setPrivacyMode(checked);
    // 应用隐私模式到body
    if (checked) {
      document.body.classList.add('privacy-mode');
    } else {
      document.body.classList.remove('privacy-mode');
    }
    message.success(checked ? '隐私模式已开启' : '隐私模式已关闭');
    
    // 记录操作日志
    const newLog = {
      id: Date.now(),
      action: checked ? '开启隐私模式' : '关闭隐私模式',
      time: new Date().toLocaleString(),
      ip: '192.168.1.100'
    };
    setOperationLogs([newLog, ...operationLogs]);
  };

  // 切换数据加密
  const toggleEncryption = (checked) => {
    if (checked) {
      // 启用加密前需要设置主密码
      Modal.confirm({
        title: '设置主密码',
        content: (
          <div>
            <p>启用数据加密需要设置主密码：</p>
            <Input.Password 
              placeholder="请输入主密码" 
              onChange={(e) => setMasterPassword(e.target.value)}
              style={{ marginBottom: '10px' }}
            />
            <Input.Password 
              placeholder="请确认主密码" 
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        ),
        onOk: () => {
          if (!masterPassword || masterPassword !== confirmPassword) {
            message.error('密码不能为空且两次输入必须一致');
            return Promise.reject();
          }
          
          // 保存主密码（在实际应用中应该更安全地存储）
          localStorage.setItem('todoListPro_masterPassword', masterPassword);
          setEncryptionEnabled(true);
          message.success('数据加密已启用');
          
          // 记录操作日志
          const newLog = {
            id: Date.now(),
            action: '启用数据加密',
            time: new Date().toLocaleString(),
            ip: '192.168.1.100'
          };
          setOperationLogs([newLog, ...operationLogs]);
          
          return Promise.resolve();
        },
        onCancel: () => {
          setEncryptionEnabled(false);
        }
      });
    } else {
      setEncryptionEnabled(false);
      localStorage.removeItem('todoListPro_masterPassword');
      message.success('数据加密已禁用');
      
      // 记录操作日志
      const newLog = {
        id: Date.now(),
        action: '禁用数据加密',
        time: new Date().toLocaleString(),
        ip: '192.168.1.100'
      };
      setOperationLogs([newLog, ...operationLogs]);
    }
  };

  // 导出数据
  const exportData = async () => {
    try {
      const tasks = loadTasksFromLocalStorage();
      let dataToExport = tasks;
      
      // 如果启用了加密，对数据进行加密
      if (encryptionEnabled) {
        const password = localStorage.getItem('todoListPro_masterPassword');
        if (password) {
          const encryptedData = await encryptObject(tasks, password);
          dataToExport = encryptedData;
        }
      }
      
      const dataStr = JSON.stringify(dataToExport, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = encryptionEnabled ? 'todo-list-data-encrypted.json' : 'todo-list-data.json';
      
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
    } catch (error) {
      message.error('数据导出失败：' + error.message);
    }
  };

  // 导入数据
  const importDataFromFile = async () => {
    try {
      let tasks = importData;
      
      // 如果启用了加密，对导入的数据进行解密
      if (encryptionEnabled) {
        const password = localStorage.getItem('todoListPro_masterPassword');
        if (password) {
          tasks = await decryptObject(importData, password);
        }
      } else {
        // 如果没有加密，直接解析JSON
        tasks = JSON.parse(importData);
      }
      
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
      message.error('数据格式错误或解密失败，请检查后重试');
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
        localStorage.removeItem('todoListPro_masterPassword');
        
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

  // 更改主密码
  const changeMasterPassword = () => {
    if (!encryptionEnabled) {
      message.error('请先启用数据加密功能');
      return;
    }
    
    Modal.confirm({
      title: '更改主密码',
      content: (
        <div>
          <Input.Password 
            placeholder="请输入当前主密码" 
            onChange={(e) => setMasterPassword(e.target.value)}
            style={{ marginBottom: '10px' }}
          />
          <Input.Password 
            placeholder="请输入新主密码" 
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      ),
      onOk: () => {
        const currentPassword = localStorage.getItem('todoListPro_masterPassword');
        if (masterPassword !== currentPassword) {
          message.error('当前密码错误');
          return Promise.reject();
        }
        
        // 保存新密码
        localStorage.setItem('todoListPro_masterPassword', confirmPassword);
        message.success('主密码已更改');
        
        // 记录操作日志
        const newLog = {
          id: Date.now(),
          action: '更改主密码',
          time: new Date().toLocaleString(),
          ip: '192.168.1.100'
        };
        setOperationLogs([newLog, ...operationLogs]);
        
        return Promise.resolve();
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
      
      <Divider />
      
      <div style={{ marginBottom: '20px' }}>
        <Title level={4}>数据安全</Title>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ flex: 1 }}>
            <Text strong>数据加密</Text>
            <br />
            <Text type="secondary">启用后将对导出的数据进行加密保护</Text>
          </div>
          <Switch 
            checked={encryptionEnabled} 
            onChange={toggleEncryption}
            checkedChildren={<LockOutlined />}
            unCheckedChildren={<UnlockOutlined />}
          />
        </div>
        
        {encryptionEnabled && (
          <div style={{ marginBottom: '10px' }}>
            <Button 
              icon={<KeyOutlined />} 
              onClick={changeMasterPassword}
            >
              更改主密码
            </Button>
          </div>
        )}
      </div>
      
      <Divider />
      
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
      
      <Divider />
      
      <div style={{ marginBottom: '20px' }}>
        <Title level={4}>安全设置</Title>
        <div style={{ marginBottom: '10px' }}>
          <Button 
            icon={<SecurityScanOutlined />}
            onClick={() => setShowSecuritySettings(!showSecuritySettings)}
          >
            {showSecuritySettings ? '隐藏安全设置' : '显示安全设置'}
          </Button>
        </div>
        
        {showSecuritySettings && (
          <Collapse>
            <Panel header="访问控制" key="1">
              <Form layout="vertical">
                <Form.Item label="自动锁定时间">
                  <Select defaultValue="never">
                    <Option value="never">从不</Option>
                    <Option value="5">5分钟后</Option>
                    <Option value="10">10分钟后</Option>
                    <Option value="30">30分钟后</Option>
                    <Option value="60">1小时后</Option>
                  </Select>
                </Form.Item>
                
                <Form.Item label="登录验证">
                  <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                </Form.Item>
              </Form>
            </Panel>
            
            <Panel header="数据备份" key="2">
              <p>自动备份设置</p>
              <Switch checkedChildren="启用自动备份" unCheckedChildren="禁用自动备份" />
            </Panel>
          </Collapse>
        )}
      </div>
      
      <Divider />
      
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
        {encryptionEnabled && (
          <Text type="secondary" style={{ marginTop: '10px', display: 'block' }}>
            注意：导入的数据将根据当前设置进行解密处理
          </Text>
        )}
      </Modal>
    </Card>
  );
};

export default PrivacySettings;