import React, { useState, useEffect, useCallback } from 'react';
import { Card, List, Progress, Tag, Typography, Row, Col, Tabs, Statistic } from 'antd';
import { CrownOutlined, StarOutlined, TrophyOutlined, FireOutlined, CalendarOutlined, HourglassOutlined, RocketOutlined, TeamOutlined, LikeOutlined, FlagOutlined } from '@ant-design/icons';
import { loadAchievementsFromLocalStorage, saveAchievementsToLocalStorage } from '../utils/storage';
import useTodoStore from '../store/todoStore';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const Achievements = () => {
  const tasks = useTodoStore(state => state.tasks);
  const [achievements, setAchievements] = useState(loadAchievementsFromLocalStorage() || []);

  // 组件挂载时从LocalStorage加载成就
  useEffect(() => {
    const loadedAchievements = loadAchievementsFromLocalStorage();
    if (loadedAchievements) {
      setAchievements(loadedAchievements);
    }
  }, []);

  // 检查成就的回调函数
  const checkAchievements = useCallback((tasksList) => {
    const completedTasks = tasksList.filter(task => task.completed);
    const today = new Date().toISOString().split('T')[0];
    
    // 获取本周和本月的完成任务
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const thisWeekCompleted = completedTasks.filter(task => {
      if (!task.completedDate) return false;
      const completedDate = new Date(task.completedDate);
      return completedDate >= oneWeekAgo;
    });
    
    const thisMonthCompleted = completedTasks.filter(task => {
      if (!task.completedDate) return false;
      const completedDate = new Date(task.completedDate);
      return completedDate >= oneMonthAgo;
    });
    
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
        date: new Date().toISOString().split('T')[0],
        category: '基础'
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
        date: new Date().toISOString().split('T')[0],
        category: '数量'
      });
      achievementsUpdated = true;
    }
    
    // 检查完成50个任务成就
    if (completedTasks.length >= 50 && !achievements.some(a => a.id === 'fifty_tasks')) {
      newAchievements.push({
        id: 'fifty_tasks',
        name: '任务专家',
        description: '完成50个任务',
        icon: <CrownOutlined />,
        date: new Date().toISOString().split('T')[0],
        category: '数量'
      });
      achievementsUpdated = true;
    }
    
    // 检查完成100个任务成就
    if (completedTasks.length >= 100 && !achievements.some(a => a.id === 'hundred_tasks')) {
      newAchievements.push({
        id: 'hundred_tasks',
        name: '任务大师',
        description: '完成100个任务',
        icon: <RocketOutlined />,
        date: new Date().toISOString().split('T')[0],
        category: '数量'
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
        date: new Date().toISOString().split('T')[0],
        category: '连续性'
      });
      achievementsUpdated = true;
    }
    
    // 检查一周内完成10个任务成就
    if (thisWeekCompleted.length >= 10 && !achievements.some(a => a.id === 'ten_tasks_week')) {
      newAchievements.push({
        id: 'ten_tasks_week',
        name: '周度高效',
        description: '一周内完成10个任务',
        icon: <CalendarOutlined />,
        date: new Date().toISOString().split('T')[0],
        category: '时间'
      });
      achievementsUpdated = true;
    }
    
    // 检查一个月内完成30个任务成就
    if (thisMonthCompleted.length >= 30 && !achievements.some(a => a.id === 'thirty_tasks_month')) {
      newAchievements.push({
        id: 'thirty_tasks_month',
        name: '月度达人',
        description: '一个月内完成30个任务',
        icon: <FlagOutlined />,
        date: new Date().toISOString().split('T')[0],
        category: '时间'
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
        icon: <LikeOutlined />,
        date: new Date().toISOString().split('T')[0],
        category: '完成度'
      });
      achievementsUpdated = true;
    }
    
    // 检查高效完成任务成就（同一天创建并完成）
    const sameDayCompleted = completedTasks.filter(task => {
      if (!task.createdDate || !task.completedDate) return false;
      return task.createdDate === task.completedDate;
    });
    
    if (sameDayCompleted.length >= 5 && !achievements.some(a => a.id === 'efficient_worker')) {
      newAchievements.push({
        id: 'efficient_worker',
        name: '高效工作者',
        description: '同一天创建并完成5个任务',
        icon: <HourglassOutlined />,
        date: new Date().toISOString().split('T')[0],
        category: '效率'
      });
      achievementsUpdated = true;
    }
    
    if (achievementsUpdated) {
      setAchievements(newAchievements);
      saveAchievementsToLocalStorage(newAchievements);
    }
  }, [achievements]);

  // 任务数据变化时检查成就
  useEffect(() => {
    checkAchievements(tasks);
  }, [tasks, checkAchievements]);

  // 计算统计数据
  const calculateStats = () => {
    const completedTasks = tasks.filter(task => task.completed);
    const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
    
    // 计算连续打卡天数（简化处理）
    const checkinDays = achievements.filter(a => a.id === 'daily_checkin').length;
    
    // 计算本周完成任务数
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const thisWeekCompleted = completedTasks.filter(task => {
      if (!task.completedDate) return false;
      const completedDate = new Date(task.completedDate);
      return completedDate >= oneWeekAgo;
    }).length;
    
    // 计算本月完成任务数
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const thisMonthCompleted = completedTasks.filter(task => {
      if (!task.completedDate) return false;
      const completedDate = new Date(task.completedDate);
      return completedDate >= oneMonthAgo;
    }).length;
    
    return {
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      completionRate,
      checkinDays,
      thisWeekCompleted,
      thisMonthCompleted
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
      unlocked: achievements.some(a => a.id === 'first_task'),
      category: '基础'
    },
    {
      id: 'ten_tasks',
      name: '任务达人',
      description: '完成10个任务',
      icon: <TrophyOutlined />,
      unlocked: achievements.some(a => a.id === 'ten_tasks'),
      category: '数量'
    },
    {
      id: 'fifty_tasks',
      name: '任务专家',
      description: '完成50个任务',
      icon: <CrownOutlined />,
      unlocked: achievements.some(a => a.id === 'fifty_tasks'),
      category: '数量'
    },
    {
      id: 'hundred_tasks',
      name: '任务大师',
      description: '完成100个任务',
      icon: <RocketOutlined />,
      unlocked: achievements.some(a => a.id === 'hundred_tasks'),
      category: '数量'
    },
    {
      id: 'daily_checkin',
      name: '每日打卡',
      description: '完成今日任务',
      icon: <FireOutlined />,
      unlocked: achievements.some(a => a.id === 'daily_checkin'),
      category: '连续性'
    },
    {
      id: 'ten_tasks_week',
      name: '周度高效',
      description: '一周内完成10个任务',
      icon: <CalendarOutlined />,
      unlocked: achievements.some(a => a.id === 'ten_tasks_week'),
      category: '时间'
    },
    {
      id: 'thirty_tasks_month',
      name: '月度达人',
      description: '一个月内完成30个任务',
      icon: <FlagOutlined />,
      unlocked: achievements.some(a => a.id === 'thirty_tasks_month'),
      category: '时间'
    },
    {
      id: 'all_tasks',
      name: '完美主义者',
      description: '完成所有任务',
      icon: <LikeOutlined />,
      unlocked: achievements.some(a => a.id === 'all_tasks'),
      category: '完成度'
    },
    {
      id: 'efficient_worker',
      name: '高效工作者',
      description: '同一天创建并完成5个任务',
      icon: <HourglassOutlined />,
      unlocked: achievements.some(a => a.id === 'efficient_worker'),
      category: '效率'
    }
  ];

  // 按类别过滤成就
  const filterAchievementsByCategory = (category) => {
    if (category === 'all') return achievementList;
    return achievementList.filter(achievement => achievement.category === category);
  };

  return (
    <Card title="成就系统" style={{ margin: '20px 0' }}>
      <Tabs defaultActiveKey="1">
        <TabPane tab="统计概览" key="1">
          <Row gutter={16} style={{ marginBottom: '20px' }}>
            <Col span={6}>
              <Card size="small">
                <Statistic
                  title="总任务数"
                  value={stats.totalTasks}
                  prefix={<FlagOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small">
                <Statistic
                  title="已完成"
                  value={stats.completedTasks}
                  prefix={<LikeOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small">
                <Statistic
                  title="完成率"
                  value={stats.completionRate}
                  suffix="%"
                  prefix={<TrophyOutlined />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small">
                <Statistic
                  title="连续打卡"
                  value={stats.checkinDays}
                  suffix="天"
                  prefix={<FireOutlined />}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Card>
            </Col>
          </Row>
          
          <Row gutter={16} style={{ marginBottom: '20px' }}>
            <Col span={6}>
              <Card size="small">
                <Statistic
                  title="本周完成"
                  value={stats.thisWeekCompleted}
                  prefix={<CalendarOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small">
                <Statistic
                  title="本月完成"
                  value={stats.thisMonthCompleted}
                  prefix={<TeamOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small">
                <Statistic
                  title="成就总数"
                  value={achievementList.length}
                  prefix={<StarOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small">
                <Statistic
                  title="已解锁"
                  value={achievements.length}
                  prefix={<RocketOutlined />}
                  valueStyle={{ color: '#177ddc' }}
                />
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
        </TabPane>
        
        <TabPane tab="成就列表" key="2">
          <div style={{ marginBottom: '20px' }}>
            <Text>成就分类: </Text>
            <Tag color="blue">基础</Tag>
            <Tag color="green">数量</Tag>
            <Tag color="orange">时间</Tag>
            <Tag color="red">连续性</Tag>
            <Tag color="purple">效率</Tag>
            <Tag color="cyan">完成度</Tag>
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
                      <Tag style={{ marginLeft: '10px' }} color={achievement.unlocked ? 'blue' : 'default'}>
                        {achievement.category}
                      </Tag>
                    </span>
                  }
                  description={
                    <span style={{ 
                      color: achievement.unlocked ? 'inherit' : '#d9d9d9'
                    }}>
                      {achievement.description}
                      {achievement.unlocked && (
                        <div style={{ marginTop: '5px', fontSize: '12px', color: '#888' }}>
                          解锁时间: {achievement.date}
                        </div>
                      )}
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
        </TabPane>
        
        <TabPane tab="成就详情" key="3">
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <RocketOutlined style={{ fontSize: '48px', color: '#177ddc', marginBottom: '20px' }} />
            <Title level={3}>成就系统说明</Title>
            <Text>
              <p>成就系统旨在激励您更好地管理任务和提高工作效率。</p>
              <p>通过完成各种任务和达成特定目标，您可以解锁不同的成就。</p>
              <p>成就分为多个类别：</p>
              <ul style={{ textAlign: 'left', display: 'inline-block' }}>
                <li><strong>基础类</strong>：完成基本操作即可解锁</li>
                <li><strong>数量类</strong>：完成一定数量的任务</li>
                <li><strong>时间类</strong>：在特定时间内完成任务</li>
                <li><strong>连续性类</strong>：保持连续完成任务的习惯</li>
                <li><strong>效率类</strong>：高效地完成任务</li>
                <li><strong>完成度类</strong>：完成所有任务或达到高完成率</li>
              </ul>
              <p>继续努力，解锁更多成就吧！</p>
            </Text>
          </div>
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default Achievements;