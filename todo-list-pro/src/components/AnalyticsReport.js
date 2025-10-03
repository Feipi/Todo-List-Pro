import React, { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, Table, Tag, DatePicker, Button, Progress, Tabs, Typography, Divider } from 'antd';
import { loadTasksFromLocalStorage } from '../utils/storage';
import moment from 'moment';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import WorkEfficiency from './WorkEfficiency';
import useTodoStore from '../store/todoStore';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { Title, Text } = Typography;

const AnalyticsReport = () => {
  const tasks = useTodoStore(state => state.tasks);
  const tags = useTodoStore(state => state.tags);
  const [dateRange, setDateRange] = useState([
    moment().startOf('month'),
    moment().endOf('month')
  ]);

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
    
    // 按日期统计完成情况
    const completionByDate = {};
    filteredTasks.forEach(task => {
      if (task.completedDate) {
        const date = task.completedDate;
        if (!completionByDate[date]) {
          completionByDate[date] = 0;
        }
        completionByDate[date]++;
      }
    });
    
    // 计算平均每日完成任务数
    const daysInRange = endDate.diff(startDate, 'days') + 1;
    const avgDailyCompletion = completed > 0 ? (completed / daysInRange).toFixed(1) : 0;
    
    // 计算任务密集度（按截止日期分布）
    const taskDensityByDate = {};
    filteredTasks.forEach(task => {
      if (task.dueDate) {
        const date = task.dueDate;
        if (!taskDensityByDate[date]) {
          taskDensityByDate[date] = 0;
        }
        taskDensityByDate[date]++;
      }
    });
    
    return {
      todayPending,
      completed,
      overdue,
      total,
      completionRate,
      priorityStats,
      tagStats,
      completionByDate,
      avgDailyCompletion,
      taskDensityByDate
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

  // 生成完成趋势数据
  const generateCompletionTrendData = () => {
    const completionTrendData = [];
    const [startDate, endDate] = dateRange;
    const days = endDate.diff(startDate, 'days') + 1;
    
    for (let i = 0; i < days; i++) {
      const currentDate = startDate.clone().add(i, 'days');
      const dateStr = currentDate.format('YYYY-MM-DD');
      
      const completedCount = stats.completionByDate[dateStr] || 0;
      
      completionTrendData.push({
        date: currentDate.format('MM-DD'),
        completed: completedCount
      });
    }
    
    return completionTrendData;
  };

  const completionTrendData = generateCompletionTrendData();

  // 生成任务密度数据
  const generateTaskDensityData = () => {
    const densityData = [];
    const [startDate, endDate] = dateRange;
    const days = endDate.diff(startDate, 'days') + 1;
    
    for (let i = 0; i < days; i++) {
      const currentDate = startDate.clone().add(i, 'days');
      const dateStr = currentDate.format('YYYY-MM-DD');
      
      const taskCount = stats.taskDensityByDate[dateStr] || 0;
      
      densityData.push({
        date: currentDate.format('MM-DD'),
        tasks: taskCount
      });
    }
    
    return densityData;
  };

  const taskDensityData = generateTaskDensityData();

  // 颜色配置
  const COLORS = ['#ff4d4f', '#faad14', '#52c41a'];
  const priorityColors = {
    '高优先级': '#ff4d4f',
    '中优先级': '#faad14',
    '低优先级': '#52c41a'
  };

  // 获取标签信息
  const getTagInfo = (tagId) => {
    return tags.find(tag => tag.id === tagId) || { name: '未知标签', color: '#d9d9d9' };
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
              <Button onClick={() => {
                setDateRange([
                  moment().startOf('year'),
                  moment().endOf('year')
                ]);
              }} style={{ marginLeft: '10px' }}>
                本年
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
              <Col span={8}>
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
              <Col span={8}>
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
              <Col span={8}>
                <Card title="效率指标">
                  <Statistic 
                    title="平均每日完成任务" 
                    value={stats.avgDailyCompletion} 
                    suffix="个/天" 
                  />
                  <div style={{ marginTop: '20px' }}>
                    <Text>任务密度分析:</Text>
                    <br />
                    <Text type="secondary">
                      最密集日期: {Object.keys(stats.taskDensityByDate).length > 0 
                        ? Object.keys(stats.taskDensityByDate).reduce((a, b) => 
                            stats.taskDensityByDate[a] > stats.taskDensityByDate[b] ? a : b
                          ) 
                        : '暂无数据'}
                    </Text>
                  </div>
                </Card>
              </Col>
            </Row>
            
            <Divider>趋势分析</Divider>
            
            <Row gutter={16} style={{ marginBottom: '20px' }}>
              <Col span={12}>
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
              <Col span={12}>
                <Card title="完成趋势">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart
                      data={completionTrendData}
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
                      <Line 
                        type="monotone" 
                        dataKey="completed" 
                        name="每日完成数" 
                        stroke="#52c41a" 
                        activeDot={{ r: 8 }} 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
            </Row>
            
            <Row gutter={16} style={{ marginBottom: '20px' }}>
              <Col span={24}>
                <Card title="任务密度分布">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                      data={taskDensityData}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="tasks" name="任务数量" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
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
                          const tagInfo = getTagInfo(tagId);
                          return <Tag color={tagInfo.color}>{tagInfo.name}</Tag>;
                        }
                      },
                      {
                        title: '任务数',
                        dataIndex: 'count',
                        key: 'count',
                        sorter: (a, b) => a.count - b.count
                      },
                      {
                        title: '已完成',
                        dataIndex: 'completed',
                        key: 'completed',
                        sorter: (a, b) => a.completed - b.completed
                      },
                      {
                        title: '完成率',
                        dataIndex: 'completionRate',
                        key: 'completionRate',
                        sorter: (a, b) => a.completionRate - b.completionRate,
                        render: (rate) => (
                          <Progress 
                            percent={rate} 
                            size="small" 
                            strokeColor={rate >= 80 ? '#52c41a' : rate >= 50 ? '#faad14' : '#ff4d4f'}
                          />
                        )
                      }
                    ]}
                    pagination={{ pageSize: 5 }}
                  />
                </Card>
              </Col>
            </Row>
          </TabPane>
          
          <TabPane tab="工作效率" key="2">
            <WorkEfficiency />
          </TabPane>
          
          <TabPane tab="深度分析" key="3">
            <Card title="深度分析报告">
              <Title level={4}>任务完成模式分析</Title>
              <Text>
                <p>根据您的任务完成数据，我们发现以下模式：</p>
                <ul>
                  <li>您在{stats.completionRate >= 70 ? '大部分' : '部分'}任务上表现出色</li>
                  <li>高优先级任务完成率: {Math.round((stats.priorityStats.high / (stats.priorityStats.high + stats.priorityStats.medium + stats.priorityStats.low)) * 100 || 0)}%</li>
                  <li>平均每日完成 {stats.avgDailyCompletion} 个任务</li>
                  <li>{stats.overdue > 0 ? `有 ${stats.overdue} 个任务逾期` : '没有逾期任务，做得很好！'}</li>
                </ul>
              </Text>
              
              <Divider />
              
              <Title level={4}>改进建议</Title>
              <Text>
                <ul>
                  <li>{stats.completionRate >= 80 ? '继续保持当前的高效工作状态' : 
                      stats.completionRate >= 50 ? '可以尝试将更多任务分解为小步骤来提高完成率' : 
                      '建议制定更详细的任务计划和时间安排'}</li>
                  <li>{stats.overdue > 0 ? `需要更加关注截止日期，避免任务逾期` : '在任务时间管理方面表现良好'}</li>
                  <li>{stats.priorityStats.high > stats.priorityStats.low ? '高优先级任务处理得当' : '可以优先处理高优先级任务'}</li>
                </ul>
              </Text>
              
              <Divider />
              
              <Title level={4}>时间管理建议</Title>
              <Text>
                <p>根据您的任务分布情况，我们建议：</p>
                <ul>
                  <li>在任务密集的日期提前规划，避免临时抱佛脚</li>
                  <li>合理分配任务优先级，确保重要任务得到足够关注</li>
                  <li>保持每日任务完成的稳定性，避免集中完成或长时间不完成任务</li>
                </ul>
              </Text>
            </Card>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default AnalyticsReport;