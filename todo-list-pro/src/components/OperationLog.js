import React, { useState, useEffect } from 'react';
import { Card, List, Typography, Button, Modal, DatePicker, Select } from 'antd';
import { ClockCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const OperationLog = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [operationType, setOperationType] = useState('all');
  const [isLogModalVisible, setIsLogModalVisible] = useState(false);

  // 模拟操作日志数据
  const mockLogs = [
    {
      id: 1,
      type: 'task_create',
      description: '创建任务: 完成项目报告',
      timestamp: '2025-10-01T09:30:00Z',
      userId: 1
    },
    {
      id: 2,
      type: 'task_complete',
      description: '完成任务: 回复客户邮件',
      timestamp: '2025-10-01T10:15:00Z',
      userId: 1
    },
    {
      id: 3,
      type: 'task_edit',
      description: '编辑任务: 准备会议材料',
      timestamp: '2025-10-01T11:20:00Z',
      userId: 1
    },
    {
      id: 4,
      type: 'task_delete',
      description: '删除任务: 旧项目清理',
      timestamp: '2025-10-01T14:45:00Z',
      userId: 1
    },
    {
      id: 5,
      type: 'tag_create',
      description: '创建标签: 重要',
      timestamp: '2025-10-01T16:30:00Z',
      userId: 1
    },
    {
      id: 6,
      type: 'settings_change',
      description: '更改设置: 启用深色主题',
      timestamp: '2025-10-02T08:45:00Z',
      userId: 1
    },
    {
      id: 7,
      type: 'task_create',
      description: '创建任务: 购买办公用品',
      timestamp: '2025-10-02T09:15:00Z',
      userId: 1
    }
  ];

  // 初始化日志数据
  useEffect(() => {
    // 在实际应用中，这里会从localStorage或服务器加载日志
    setLogs(mockLogs);
    setFilteredLogs(mockLogs);
  }, []);

  // 根据筛选条件过滤日志
  useEffect(() => {
    let result = [...logs];
    
    // 按日期范围过滤
    if (dateRange.length === 2) {
      const [startDate, endDate] = dateRange;
      result = result.filter(log => {
        const logDate = moment(log.timestamp);
        return logDate.isSameOrAfter(startDate, 'day') && logDate.isSameOrBefore(endDate, 'day');
      });
    }
    
    // 按操作类型过滤
    if (operationType !== 'all') {
      result = result.filter(log => log.type === operationType);
    }
    
    setFilteredLogs(result);
  }, [dateRange, operationType, logs]);

  // 格式化时间
  const formatTime = (timestamp) => {
    return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
  };

  // 获取操作类型描述
  const getOperationTypeText = (type) => {
    switch (type) {
      case 'task_create': return '创建任务';
      case 'task_complete': return '完成任务';
      case 'task_edit': return '编辑任务';
      case 'task_delete': return '删除任务';
      case 'tag_create': return '创建标签';
      case 'settings_change': return '设置变更';
      default: return '其他操作';
    }
  };

  // 获取操作类型颜色
  const getOperationTypeColor = (type) => {
    switch (type) {
      case 'task_create': return 'blue';
      case 'task_complete': return 'green';
      case 'task_edit': return 'orange';
      case 'task_delete': return 'red';
      case 'tag_create': return 'purple';
      case 'settings_change': return 'cyan';
      default: return 'gray';
    }
  };

  // 清空日志
  const clearLogs = () => {
    Modal.confirm({
      title: '确认清空日志',
      content: '确定要清空所有操作日志吗？此操作不可恢复。',
      onOk() {
        setLogs([]);
        setFilteredLogs([]);
        // 在实际应用中，这里会清空localStorage或服务器上的日志数据
      }
    });
  };

  // 显示日志详情
  const showLogDetails = (log) => {
    Modal.info({
      title: '操作详情',
      content: (
        <div>
          <p><strong>操作类型:</strong> {getOperationTypeText(log.type)}</p>
          <p><strong>操作描述:</strong> {log.description}</p>
          <p><strong>操作时间:</strong> {formatTime(log.timestamp)}</p>
          <p><strong>操作ID:</strong> {log.id}</p>
        </div>
      )
    });
  };

  return (
    <Card title="操作日志" style={{ margin: '20px 0' }}>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <RangePicker 
          onChange={(dates) => setDateRange(dates || [])}
          placeholder={['开始日期', '结束日期']}
        />
        <Select
          style={{ width: 120 }}
          placeholder="操作类型"
          value={operationType}
          onChange={setOperationType}
        >
          <Option value="all">全部类型</Option>
          <Option value="task_create">创建任务</Option>
          <Option value="task_complete">完成任务</Option>
          <Option value="task_edit">编辑任务</Option>
          <Option value="task_delete">删除任务</Option>
          <Option value="tag_create">创建标签</Option>
          <Option value="settings_change">设置变更</Option>
        </Select>
        <Button 
          icon={<DeleteOutlined />} 
          onClick={clearLogs}
          danger
        >
          清空日志
        </Button>
      </div>
      
      <List
        dataSource={filteredLogs}
        renderItem={log => (
          <List.Item
            actions={[
              <Button 
                type="link" 
                onClick={() => showLogDetails(log)}
              >
                详情
              </Button>
            ]}
          >
            <List.Item.Meta
              avatar={<ClockCircleOutlined style={{ fontSize: '18px', color: getOperationTypeColor(log.type) }} />}
              title={log.description}
              description={
                <div>
                  <span>{formatTime(log.timestamp)}</span>
                  <span style={{ 
                    marginLeft: '10px', 
                    padding: '2px 6px', 
                    backgroundColor: getOperationTypeColor(log.type),
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '12px'
                  }}>
                    {getOperationTypeText(log.type)}
                  </span>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default OperationLog;