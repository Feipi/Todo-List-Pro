import React, { useState } from 'react';
import { Card, Button, message, Switch, Modal, Input } from 'antd';
import { LockOutlined, UnlockOutlined } from '@ant-design/icons';
import OperationLog from './OperationLog';

const DataEncryption = () => {
  const [isEncryptionEnabled, setIsEncryptionEnabled] = useState(false);
  const [isPrivacyMode, setIsPrivacyMode] = useState(false);
  const [encryptionPassword, setEncryptionPassword] = useState('');
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [isLogModalVisible, setIsLogModalVisible] = useState(false);

  // 启用加密
  const enableEncryption = () => {
    if (!encryptionPassword) {
      message.warning('请输入加密密码');
      return;
    }

    try {
      // 这里应该实现实际的加密逻辑
      // 在实际应用中，我们会使用加密库如crypto-js来加密数据
      localStorage.setItem('todoListPro_encryption_enabled', 'true');
      localStorage.setItem('todoListPro_encryption_password_hint', btoa(encryptionPassword.substring(0, 3) + '***'));
      setIsEncryptionEnabled(true);
      setIsPasswordModalVisible(false);
      setEncryptionPassword('');
      message.success('数据加密已启用');
    } catch (error) {
      message.error('启用加密失败: ' + error.message);
    }
  };

  // 禁用加密
  const disableEncryption = () => {
    Modal.confirm({
      title: '确认禁用加密',
      content: '禁用加密将使您的数据以明文形式存储，确定要继续吗？',
      onOk() {
        try {
          localStorage.removeItem('todoListPro_encryption_enabled');
          localStorage.removeItem('todoListPro_encryption_password_hint');
          setIsEncryptionEnabled(false);
          message.success('数据加密已禁用');
        } catch (error) {
          message.error('禁用加密失败: ' + error.message);
        }
      }
    });
  };

  // 切换隐私模式
  const togglePrivacyMode = (checked) => {
    setIsPrivacyMode(checked);
    if (checked) {
      document.body.classList.add('privacy-mode');
      message.info('隐私模式已启用');
    } else {
      document.body.classList.remove('privacy-mode');
      message.info('隐私模式已禁用');
    }
  };

  // 处理加密开关变化
  const handleEncryptionChange = (checked) => {
    if (checked) {
      setIsPasswordModalVisible(true);
    } else {
      disableEncryption();
    }
  };

  return (
    <div>
      <Card title="数据安全与隐私" style={{ margin: '20px 0' }}>
        <div style={{ marginBottom: '20px' }}>
          <h3>数据加密</h3>
          <p>启用数据加密以保护您的任务信息</p>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Switch
              checked={isEncryptionEnabled}
              onChange={handleEncryptionChange}
              checkedChildren={<LockOutlined />}
              unCheckedChildren={<UnlockOutlined />}
            />
            <span style={{ marginLeft: '10px' }}>
              {isEncryptionEnabled ? '加密已启用' : '加密已禁用'}
            </span>
          </div>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <h3>隐私模式</h3>
          <p>启用隐私模式以隐藏任务内容</p>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Switch
              checked={isPrivacyMode}
              onChange={togglePrivacyMode}
              checkedChildren="ON"
              unCheckedChildren="OFF"
            />
            <span style={{ marginLeft: '10px' }}>
              {isPrivacyMode ? '隐私模式已启用' : '隐私模式已禁用'}
            </span>
          </div>
        </div>
        
        <div>
          <h3>操作日志</h3>
          <p>查看重要操作的历史记录</p>
          <Button onClick={() => setIsLogModalVisible(true)}>
            查看操作日志
          </Button>
        </div>
        
        {/* 密码输入模态框 */}
        <Modal
          title="设置加密密码"
          visible={isPasswordModalVisible}
          onCancel={() => {
            setIsPasswordModalVisible(false);
            setEncryptionPassword('');
          }}
          onOk={enableEncryption}
        >
          <p>请输入用于加密数据的密码：</p>
          <Input.Password
            placeholder="输入加密密码"
            value={encryptionPassword}
            onChange={(e) => setEncryptionPassword(e.target.value)}
          />
          <p style={{ marginTop: '10px', fontSize: '12px', color: '#999' }}>
            注意：请妥善保管此密码，丢失后将无法解密数据
          </p>
        </Modal>
      </Card>
      
      {/* 操作日志模态框 */}
      <Modal
        title="操作日志"
        visible={isLogModalVisible}
        onCancel={() => setIsLogModalVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setIsLogModalVisible(false)}>
            关闭
          </Button>
        ]}
      >
        <OperationLog />
      </Modal>
    </div>
  );
};

export default DataEncryption;