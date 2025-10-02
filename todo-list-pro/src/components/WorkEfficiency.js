import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Typography, Statistic, Row, Col, Progress } from 'antd';
import { loadTasksFromLocalStorage } from '../utils/storage';
import moment from 'moment';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const WorkEfficiency = () => {
  const [tasks, setTasks] = useState([]);
  const [dateRange, setDateRange] = useState([
    moment().startOf('week'),
    moment().endOf('week')
  ]);

  // 组件挂载时从LocalStorage加载任务
  useEffect(() => {
    const loadedTasks = loadTasksFromLocalStorage();
    setTasks(loadedTasks);
  }, []);

  // 计算工作效率数据
  const calculateEfficiencyData = () => {
    const [startDate, endDate] = dateRange;
    
    // 过滤指定日期范围内的任务
    const filteredTasks = tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = moment(task.dueDate);
      return taskDate.isSameOrAfter(startDate) && taskDate.isSameOrBefore(endDate);
    });
    
    // 计算完成率
    const totalTasks = filteredTasks.length;
    const completedTasks = filteredTasks.filter(task => task.completed).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // 计算按时完成率
    const onTimeTasks = filteredTasks.filter(task => {
      if (!task.completed || !task.dueDate || !task.completedDate) return false;
      return moment(task.completedDate).isSameOrBefore(moment(task.dueDate));
    }).length;
    const onTimeRate = completedTasks > 0 ? Math.round((onTimeTasks / completedTasks) * 100) : 0;
    
    // 计算平均完成时间
    let totalCompletionDays = 0;
    let completedTaskCount = 0;
    
    filteredTasks.forEach(task => {
      if (task.completed && task.dueDate && task.createdAt) {
        const createdDate = moment(task.createdAt);
        const completedDate = moment(task.completedDate || new Date());
        const days = completedDate.diff(createdDate, 'days');
        if (days >= 0) {
          totalCompletionDays += days;
          completedTaskCount++;
        }
      }
    });
    
    const avgCompletionDays = completedTaskCount > 0 ? 
      (totalCompletionDays / completedTaskCount).toFixed(1) : 0;
    
    // 按天统计任务完成情况
    const dailyStats = {};
    const days = endDate.diff(startDate, 'days') + 1;
    
    for (let i = 0; i < days; i++) {
      const currentDate = startDate.clone().add(i, 'days');
      const dateStr = currentDate.format('YYYY-MM-DD');
      
      dailyStats[dateStr] = {
        date: currentDate.format('MM-DD'),
        total: 0,
        completed: 0
      };
    }
    
    filteredTasks.forEach(task => {
      if (task.dueDate && dailyStats[task.dueDate]) {
        dailyStats[task.dueDate].total++;
        if (task.completed) {
          dailyStats[task.dueDate].completed++;
        }
      }
    });
    
    const dailyData = Object.values(dailyStats);
    
    return {
      totalTasks,
      completedTasks,
      completionRate,
      onTimeRate,
      avgCompletionDays,
      dailyData
    };
  };

  const efficiencyData = calculateEfficiencyData();

  return (
    <Card title="工作效率分析" style={{ margin: '20px 0' }}>
      <div style={{ marginBottom: '20px' }}>
        <RangePicker 
          value={dateRange}
          onChange={setDateRange}
          style={{ marginRight: '10px' }}
        />
        <Text type="secondary" style={{ marginLeft: '10px' }}>
          分析周期: {dateRange[0].format('YYYY-MM-DD')} 至 {dateRange[1].format('YYYY-MM-DD')}
        </Text>
      </div>
      
      <Row gutter={16} style={{ marginBottom: '20px' }}>
        <Col span={6}>
          <Card size="small">
            <Statistic title="总任务数" value={efficiencyData.totalTasks} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="已完成" value={efficiencyData.completedTasks} />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="完成率" value={efficiencyData.completionRate} suffix="%" />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic title="按时完成率" value={efficiencyData.onTimeRate} suffix="%" />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={16} style={{ marginBottom: '20px' }}>
        <Col span={12}>
          <Card size="small">
            <Statistic 
              title="平均完成时间" 
              value={efficiencyData.avgCompletionDays} 
              suffix="天" 
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small">
            <div>
              <Text strong>总体表现:</Text>
              <div style={{ marginTop: '10px' }}>
                <Progress 
                  type="circle" 
                  percent={efficiencyData.completionRate} 
                  width={80}
                  strokeColor={
                    efficiencyData.completionRate >= 80 ? '#52c41a' : 
                    efficiencyData.completionRate >= 60 ? '#faad14' : '#ff4d4f'
                  }
                />
                <div style={{ marginTop: '10px' }}>
                  {efficiencyData.completionRate >= 80 ? '表现优秀，继续保持！' : 
                   efficiencyData.completionRate >= 60 ? '还有提升空间，加油！' : 
                   '需要更加努力完成任务哦！'}
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
      
      <div style={{ marginTop: '20px' }}>
        <Title level={5}>每日任务完成情况</Title>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
          {efficiencyData.dailyData.map((day, index) => (
            <div key={index} style={{ textAlign: 'center', minWidth: '60px' }}>
              <div>{day.date}</div>
              <Progress 
                type="circle" 
                percent={day.total > 0 ? Math.round((day.completed / day.total) * 100) : 0} 
                width={50}
                strokeWidth={8}
              />
              <div style={{ fontSize: '12px' }}>
                {day.completed}/{day.total}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f2f5', borderRadius: '4px' }}>
        <Title level={5}>效率提升建议</Title>
        <ul>
          <li>优先处理高优先级任务</li>
          <li>合理安排任务截止时间，避免堆积</li>
          <li>每天固定时间检查任务完成情况</li>
          <li>将大任务分解为小任务逐步完成</li>
        </ul>
      </div>
    </Card>
  );
};

export default WorkEfficiency;