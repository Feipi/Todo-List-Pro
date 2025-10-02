import React, { useState, useEffect } from 'react';
import { Card, DatePicker, Select, Typography } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { loadTasksFromLocalStorage } from '../utils/storage';
import moment from 'moment';

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const TrendAnalysis = () => {
  const [tasks, setTasks] = useState([]);
  const [dateRange, setDateRange] = useState([
    moment().startOf('month'),
    moment().endOf('month')
  ]);
  const [chartType, setChartType] = useState('daily');

  // 组件挂载时从LocalStorage加载任务
  useEffect(() => {
    const loadedTasks = loadTasksFromLocalStorage();
    setTasks(loadedTasks);
  }, []);

  // 生成每日任务数据
  const generateDailyData = () => {
    const data = [];
    const [startDate, endDate] = dateRange;
    const days = endDate.diff(startDate, 'days') + 1;
    
    for (let i = 0; i < days; i++) {
      const currentDate = startDate.clone().add(i, 'days');
      const dateStr = currentDate.format('YYYY-MM-DD');
      
      const dayTasks = tasks.filter(task => 
        task.dueDate === dateStr
      );
      
      const completedTasks = dayTasks.filter(task => task.completed).length;
      
      data.push({
        date: currentDate.format('MM-DD'),
        tasks: dayTasks.length,
        completed: completedTasks,
        pending: dayTasks.length - completedTasks
      });
    }
    
    return data;
  };

  // 生成优先级分布数据
  const generatePriorityData = () => {
    const priorityCounts = {
      high: 0,
      medium: 0,
      low: 0
    };
    
    tasks.forEach(task => {
      if (task.priority) {
        priorityCounts[task.priority]++;
      }
    });
    
    return [
      { name: '高优先级', value: priorityCounts.high },
      { name: '中优先级', value: priorityCounts.medium },
      { name: '低优先级', value: priorityCounts.low }
    ];
  };

  // 生成时间分布数据
  const generateTimeData = () => {
    const timeCounts = {
      morning: 0,    // 6:00-12:00
      afternoon: 0,  // 12:00-18:00
      evening: 0,    // 18:00-24:00
      night: 0       // 0:00-6:00
    };
    
    tasks.forEach(task => {
      if (task.remindTime) {
        const hour = parseInt(task.remindTime.split(':')[0]);
        if (hour >= 6 && hour < 12) {
          timeCounts.morning++;
        } else if (hour >= 12 && hour < 18) {
          timeCounts.afternoon++;
        } else if (hour >= 18 && hour < 24) {
          timeCounts.evening++;
        } else {
          timeCounts.night++;
        }
      }
    });
    
    return [
      { name: '早晨 (6-12点)', value: timeCounts.morning },
      { name: '下午 (12-18点)', value: timeCounts.afternoon },
      { name: '晚上 (18-24点)', value: timeCounts.evening },
      { name: '夜间 (0-6点)', value: timeCounts.night }
    ];
  };

  const dailyData = generateDailyData();
  const priorityData = generatePriorityData();
  const timeData = generateTimeData();

  // 颜色配置
  const COLORS = ['#ff4d4f', '#faad14', '#52c41a', '#1890ff'];
  const TIME_COLORS = ['#ff7a45', '#ffc53d', '#73d13d', '#40a9ff'];

  return (
    <Card title="趋势分析" style={{ margin: '20px 0' }}>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '20px' }}>
        <RangePicker 
          value={dateRange}
          onChange={setDateRange}
          style={{ marginRight: '10px' }}
        />
        <Select
          value={chartType}
          onChange={setChartType}
          style={{ width: '150px' }}
        >
          <Option value="daily">每日趋势</Option>
          <Option value="priority">优先级分布</Option>
          <Option value="time">时间分布</Option>
        </Select>
      </div>
      
      {chartType === 'daily' && (
        <div>
          <Title level={5} style={{ textAlign: 'center', marginBottom: '20px' }}>
            任务完成趋势
          </Title>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={dailyData}
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
              <Bar dataKey="pending" name="待完成" fill="#faad14" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      
      {chartType === 'priority' && (
        <div>
          <Title level={5} style={{ textAlign: 'center', marginBottom: '20px' }}>
            任务优先级分布
          </Title>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {priorityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
      
      {chartType === 'time' && (
        <div>
          <Title level={5} style={{ textAlign: 'center', marginBottom: '20px' }}>
            任务提醒时间分布
          </Title>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={timeData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                name="任务数量" 
                stroke="#1890ff" 
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};

export default TrendAnalysis;