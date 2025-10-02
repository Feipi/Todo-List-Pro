import React, { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, Table, Tag, DatePicker, Button, Progress, Tabs } from 'antd';
import { loadTasksFromLocalStorage } from '../utils/storage';
import moment from 'moment';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import WorkEfficiency from './WorkEfficiency';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

const AnalyticsReport = () => {
  const [tasks, setTasks] = useState([]);
  const [dateRange, setDateRange] = useState([
    moment().startOf('month'),
    moment().endOf('month')
  ]);

  // 组件挂载时从LocalStorage加载任务
  useEffect(() => {
    const loadedTasks = loadTasksFromLocalStorage();
    setTasks(loadedTasks);
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
    
    // 完成率
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // 按优先级统计
    const priorityStats = {
      high: filteredTasks.filter(task => task.priority === 'high').length,
      medium: filteredTasks.filter(task => task.priority === 'medium').length,
      low: filteredTasks.filter(task => task.priority === 'low').length
    };
    
    // 按标签统计
    const tagStats = {};
    filteredTasks.forEach(task => {
      if (task.tagIds) {
        task.tagIds.forEach(tagId => {
          if (!tagStats[tagId]) {
            tagStats[tagId] = { count: 0, completed: 0 };
          }
          tagStats[tagId].count++;
          if (task.completed) {
            tagStats[tagId].completed++;
          }
        });
      }
    });
    
    return {
      todayPending,
      completed,
      overdue,
      total,
      completionRate,
      priorityStats,
      tagStats
    };
  };

  const stats = calculateStatistics();

  // 生成优先级图表数据
  const priorityChartData = [
    { name: '高优先级', value: stats.priorityStats.high },
    { name: '中优先级', value: stats.priorityStats.medium },
    { name: '低优先级', value: stats.priorityStats.low }
  ];

  // 生成时间趋势数据
  const generateTrendData = () => {
    const trendData = [];
    const [startDate, endDate] = dateRange;
    const days = endDate.diff(startDate, 'days') + 1;
    
    for (let i = 0; i < days; i++) {
      const currentDate = startDate.clone().add(i, 'days');
      const dateStr = currentDate.format('YYYY-MM-DD');
      
      const dayTasks = tasks.filter(task => 
        task.dueDate === dateStr
      );
      
      const completedTasks = dayTasks.filter(task => task.completed).length;
      
      trendData.push({
        date: currentDate.format('MM-DD'),
        tasks: dayTasks.length,
        completed: completedTasks
      });
    }
    
    return trendData;
  };

  const trendData = generateTrendData();

  // 颜色配置
  const COLORS = ['#ff4d4f', '#faad14', '#52c41a'];
  const priorityColors = {
    '高优先级': '#ff4d4f',
    '中优先级': '#faad14',
    '低优先级': '#52c41a'
  };

  return (
    <div>
      <Card title="分析报告" style={{ margin: '20px 0' }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="数据概览" key="1">
            <div style={{ marginBottom: '20px' }}>
              <RangePicker 
                value={dateRange}
                onChange={setDateRange}
                style={{ marginRight: '10px' }}
              />
              <Button onClick={() => {
                setDateRange([
                  moment().startOf('month'),
                  moment().endOf('month')
                ]);
              }}>
                本月
              </Button>
              <Button onClick={() => {
                setDateRange([
                  moment().startOf('week'),
                  moment().endOf('week')
                ]);
              }} style={{ marginLeft: '10px' }}>
                本周
              </Button>
            </div>
            
            <Row gutter={16} style={{ marginBottom: '20px' }}>
              <Col span={6}>
                <Card>
                  <Statistic title="今日待办" value={stats.todayPending} />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic title="已完成" value={stats.completed} />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic title="逾期任务" value={stats.overdue} />
                </Card>
              </Col>
              <Col span={6}>
                <Card>
                  <Statistic title="总任务数" value={stats.total} />
                </Card>
              </Col>
            </Row>
            
            <Row gutter={16} style={{ marginBottom: '20px' }}>
              <Col span={12}>
                <Card title="完成率">
                  <Progress 
                    type="circle" 
                    percent={stats.completionRate} 
                    width={120}
                    strokeColor={stats.completionRate >= 80 ? '#52c41a' : stats.completionRate >= 50 ? '#faad14' : '#ff4d4f'}
                  />
                  <div style={{ marginTop: '20px' }}>
                    <p>完成率: {stats.completionRate}%</p>
                    <p>建议: {stats.completionRate >= 80 ? '表现优秀，继续保持！' : 
                             stats.completionRate >= 50 ? '还有提升空间，加油！' : 
                             '需要更加努力完成任务哦！'}</p>
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="优先级分布">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={priorityChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {priorityChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>
            
            <Row gutter={16} style={{ marginBottom: '20px' }}>
              <Col span={24}>
                <Card title="任务趋势">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={trendData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="tasks" name="总任务数" fill="#1890ff" />
                      <Bar dataKey="completed" name="已完成" fill="#52c41a" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col span={24}>
                <Card title="标签分析">
                  <Table 
                    dataSource={Object.keys(stats.tagStats).map(tagId => ({
                      key: tagId,
                      tagId: parseInt(tagId),
                      count: stats.tagStats[tagId].count,
                      completed: stats.tagStats[tagId].completed,
                      completionRate: stats.tagStats[tagId].count > 0 ? 
                        Math.round((stats.tagStats[tagId].completed / stats.tagStats[tagId].count) * 100) : 0
                    }))}
                    columns={[
                      {
                        title: '标签',
                        dataIndex: 'tagId',
                        key: 'tagId',
                        render: (tagId) => {
                          // 这里应该从标签数据中获取标签信息
                          return <Tag color="#1890ff">标签 {tagId}</Tag>;
                        }
                      },
                      {
                        title: '任务数',
                        dataIndex: 'count',
                        key: 'count'
                      },
                      {
                        title: '已完成',
                        dataIndex: 'completed',
                        key: 'completed'
                      },
                      {
                        title: '完成率',
                        dataIndex: 'completionRate',
                        key: 'completionRate',
                        render: (rate) => `${rate}%`
                      }
                    ]}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>
          
          <TabPane tab="工作效率" key="2">
            <WorkEfficiency />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default AnalyticsReport;