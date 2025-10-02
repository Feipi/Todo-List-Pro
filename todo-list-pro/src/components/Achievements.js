import React, { useState, useEffect } from 'react';
import { Card, List, Progress, Tag, Typography, Row, Col } from 'antd';
import { CrownOutlined, StarOutlined, TrophyOutlined, FireOutlined } from '@ant-design/icons';
import { loadTasksFromLocalStorage, loadAchievementsFromLocalStorage, saveAchievementsToLocalStorage } from '../utils/storage';

const { Title, Text } = Typography;

const Achievements = () => {
  const [tasks, setTasks] = useState([]);
  const [achievements, setAchievements] = useState(loadAchievementsFromLocalStorage() || []);

  // 组件挂载时从LocalStorage加载任务
  useEffect(() => {
    const loadedTasks = loadTasksFromLocalStorage();
    setTasks(loadedTasks);
    checkAchievements(loadedTasks);
  }, []);

  // 检查成就
  const checkAchievements = (tasksList) => {
    const completedTasks = tasksList.filter(task => task.completed);
    const today = new Date().toISOString().split('T')[0];
    const todayCompleted = completedTasks.filter(task => 
      task.completedDate && task.completedDate === today
    ).length;
    
    const newAchievements = [...achievements];
    let achievementsUpdated = false;
    
    // 检查首次完成任务成就
    if (completedTasks.length >= 1 && !achievements.some(a => a.id === 'first_task')) {
      newAchievements.push({
        id: 'first_task',
        name: '首次完成',
        description: '完成第一个任务',
        icon: <StarOutlined />,
        date: new Date().toISOString().split('T')[0]
      });
      achievementsUpdated = true;
    }
    
    // 检查完成10个任务成就
    if (completedTasks.length >= 10 && !achievements.some(a => a.id === 'ten_tasks')) {
      newAchievements.push({
        id: 'ten_tasks',
        name: '任务达人',
        description: '完成10个任务',
        icon: <TrophyOutlined />,
        date: new Date().toISOString().split('T')[0]
      });
      achievementsUpdated = true;
    }
    
    // 检查连续打卡成就
    // 这里简化处理，实际应用中需要更复杂的逻辑
    if (todayCompleted >= 1 && !achievements.some(a => a.id === 'daily_checkin')) {
      newAchievements.push({
        id: 'daily_checkin',
        name: '每日打卡',
        description: '完成今日任务',
        icon: <FireOutlined />,
        date: new Date().toISOString().split('T')[0]
      });
      achievementsUpdated = true;
    }
    
    // 检查完成所有任务成就
    if (completedTasks.length > 0 && completedTasks.length === tasksList.length && 
        !achievements.some(a => a.id === 'all_tasks')) {
      newAchievements.push({
        id: 'all_tasks',
        name: '完美主义者',
        description: '完成所有任务',
        icon: <CrownOutlined />,
        date: new Date().toISOString().split('T')[0]
      });
      achievementsUpdated = true;
    }
    
    if (achievementsUpdated) {
      setAchievements(newAchievements);
      saveAchievementsToLocalStorage(newAchievements);
    }
  };

  // 任务数据变化时检查成就
  useEffect(() => {
    checkAchievements(tasks);
  }, [tasks]);

  // 计算统计数据
  const calculateStats = () => {
    const completedTasks = tasks.filter(task => task.completed);
    const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
    
    // 计算连续打卡天数（简化处理）
    const checkinDays = achievements.filter(a => a.id === 'daily_checkin').length;
    
    return {
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      completionRate,
      checkinDays
    };
  };

  const stats = calculateStats();

  // 成就列表
  const achievementList = [
    {
      id: 'first_task',
      name: '首次完成',
      description: '完成第一个任务',
      icon: <StarOutlined />,
      unlocked: achievements.some(a => a.id === 'first_task')
    },
    {
      id: 'ten_tasks',
      name: '任务达人',
      description: '完成10个任务',
      icon: <TrophyOutlined />,
      unlocked: achievements.some(a => a.id === 'ten_tasks')
    },
    {
      id: 'daily_checkin',
      name: '每日打卡',
      description: '完成今日任务',
      icon: <FireOutlined />,
      unlocked: achievements.some(a => a.id === 'daily_checkin')
    },
    {
      id: 'all_tasks',
      name: '完美主义者',
      description: '完成所有任务',
      icon: <CrownOutlined />,
      unlocked: achievements.some(a => a.id === 'all_tasks')
    }
  ];

  return (
    <Card title="成就系统" style={{ margin: '20px 0' }}>
      <Row gutter={16} style={{ marginBottom: '20px' }}>
        <Col span={6}>
          <Card size="small">
            <Text strong>总任务数</Text><br />
            <Text style={{ fontSize: '24px', color: '#1890ff' }}>{stats.totalTasks}</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Text strong>已完成</Text><br />
            <Text style={{ fontSize: '24px', color: '#52c41a' }}>{stats.completedTasks}</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Text strong>完成率</Text><br />
            <Text style={{ fontSize: '24px', color: '#faad14' }}>{stats.completionRate}%</Text>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Text strong>连续打卡</Text><br />
            <Text style={{ fontSize: '24px', color: '#ff4d4f' }}>{stats.checkinDays}天</Text>
          </Card>
        </Col>
      </Row>
      
      <div style={{ marginBottom: '20px' }}>
        <Text strong>总体进度:</Text>
        <Progress 
          percent={stats.completionRate} 
          status={stats.completionRate === 100 ? 'success' : 'normal'} 
        />
      </div>
      
      <Title level={4}>成就列表</Title>
      <List
        dataSource={achievementList}
        renderItem={achievement => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <div style={{ 
                  fontSize: '24px', 
                  color: achievement.unlocked ? '#faad14' : '#d9d9d9' 
                }}>
                  {achievement.icon}
                </div>
              }
              title={
                <span style={{ 
                  color: achievement.unlocked ? 'inherit' : '#d9d9d9',
                  textDecoration: achievement.unlocked ? 'none' : 'line-through'
                }}>
                  {achievement.name}
                </span>
              }
              description={
                <span style={{ 
                  color: achievement.unlocked ? 'inherit' : '#d9d9d9'
                }}>
                  {achievement.description}
                </span>
              }
            />
            {achievement.unlocked ? (
              <Tag color="gold">已解锁</Tag>
            ) : (
              <Tag>未解锁</Tag>
            )}
          </List.Item>
        )}
      />
    </Card>
  );
};

export default Achievements;