import React, { useState, useEffect } from 'react';
import { Statistic, Row, Col, Table, Tag, DatePicker, Card } from 'antd';
import { loadTasksFromLocalStorage } from '../utils/storage';
import moment from 'moment';

const { RangePicker } = DatePicker;

const BasicStatistics = () => {
  const [tasks, setTasks] = useState([]);
  const [dateRange, setDateRange] = useState([
    moment().startOf('month'),
    moment().endOf('month')
  ]);

  // 组件挂载时从LocalStorage加载任务
  useEffect(() => {
    const loadedTasks = loadTasksFromLocalStorage();
    setTasks(loadedTasks);
    
    // 添加窗口焦点事件监听器，当用户回到页面时重新加载任务
    const handleFocus = () => {
      const loadedTasks = loadTasksFromLocalStorage();
      setTasks(loadedTasks);
    };
    
    window.addEventListener('focus', handleFocus);
    
    // 清理事件监听器
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // 计算统计数据
  const calculateStatistics = () => {
    const today = moment().format('YYYY-MM-DD');
    const [startDate, endDate] = dateRange;
    
    // 过滤指定日期范围内的任务
    const filteredTasks = tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = moment(task.dueDate);
      return taskDate.isSameOrAfter(startDate) && taskDate.isSameOrBefore(endDate);
    });
    
    // 今日待办数
    const todayPending = filteredTasks.filter(task => 
      !task.completed && task.dueDate === today
    ).length;
    
    // 已完成数
    const completed = filteredTasks.filter(task => task.completed).length;
    
    // 逾期数
    const overdue = filteredTasks.filter(task => 
      !task.completed && task.dueDate && moment(task.dueDate).isBefore(today)
    ).length;
    
    // 总任务数
    const total = filteredTasks.length;
    
    // 按优先级统计
    const priorityStats = {
      high: filteredTasks.filter(task => task.priority === 'high').length,
      medium: filteredTasks.filter(task => task.priority === 'medium').length,
      low: filteredTasks.filter(task => task.priority === 'low').length
    };
    
    return {
      todayPending,
      completed,
      overdue,
      total,
      priorityStats
    };
  };

  const stats = calculateStatistics();

  // 任务列表列定义
  const columns = [
    {
      title: '任务标题',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: '截止日期',
      dataIndex: 'dueDate',
      key: 'dueDate'
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => {
        const priorityMap = {
          'high': { text: '高', color: 'red' },
          'medium': { text: '中', color: 'orange' },
          'low': { text: '低', color: 'green' }
        };
        const priorityInfo = priorityMap[priority] || { text: '未知', color: 'default' };
        return <Tag color={priorityInfo.color}>{priorityInfo.text}</Tag>;
      }
    },
    {
      title: '状态',
      dataIndex: 'completed',
      key: 'completed',
      render: (completed) => (
        <Tag color={completed ? 'green' : 'red'}>
          {completed ? '已完成' : '未完成'}
        </Tag>
      )
    }
  ];

  // 过滤指定日期范围内的任务
  const [startDate, endDate] = dateRange;
  const filteredTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    const taskDate = moment(task.dueDate);
    return taskDate.isSameOrAfter(startDate) && taskDate.isSameOrBefore(endDate);
  });

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: '20px' }}>
        <Col span={6}>
          <Statistic title="今日待办" value={stats.todayPending} />
        </Col>
        <Col span={6}>
          <Statistic title="已完成" value={stats.completed} />
        </Col>
        <Col span={6}>
          <Statistic title="逾期任务" value={stats.overdue} />
        </Col>
        <Col span={6}>
          <Statistic title="总任务数" value={stats.total} />
        </Col>
      </Row>
      
      <Row gutter={16} style={{ marginBottom: '20px' }}>
        <Col span={8}>
          <Card title="高优先级任务">
            <Statistic value={stats.priorityStats.high} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="中优先级任务">
            <Statistic value={stats.priorityStats.medium} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="低优先级任务">
            <Statistic value={stats.priorityStats.low} />
          </Card>
        </Col>
      </Row>
      
      <div style={{ marginBottom: '20px' }}>
        <RangePicker 
          value={dateRange}
          onChange={setDateRange}
          style={{ marginRight: '10px' }}
        />
      </div>
      
      <Table 
        dataSource={filteredTasks} 
        columns={columns} 
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default BasicStatistics;