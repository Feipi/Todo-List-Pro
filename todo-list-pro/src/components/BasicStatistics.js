import React, { useState, useEffect } from 'react';
import { Statistic, Row, Col, Card, Progress, Tag } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const BasicStatistics = ({ statistics }) => {
  // 如果没有传入统计数据，使用默认值
  const stats = statistics || {
    total: 0,
    completed: 0,
    pending: 0,
    byPriority: { high: 0, medium: 0, low: 0 },
    byTag: []
  };
  
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="总任务数"
              value={stats.total}
              prefix={<ExclamationCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已完成"
              value={stats.completed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待完成"
              value={stats.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="完成率"
              value={completionRate}
              suffix="%"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={16} style={{ marginTop: '20px' }}>
        <Col span={8}>
          <Card title="按优先级统计">
            <p>高优先级: {stats.byPriority.high}</p>
            <Progress percent={stats.total > 0 ? Math.round((stats.byPriority.high / stats.total) * 100) : 0} status="exception" />
            <p>中优先级: {stats.byPriority.medium}</p>
            <Progress percent={stats.total > 0 ? Math.round((stats.byPriority.medium / stats.total) * 100) : 0} status="normal" />
            <p>低优先级: {stats.byPriority.low}</p>
            <Progress percent={stats.total > 0 ? Math.round((stats.byPriority.low / stats.total) * 100) : 0} status="success" />
          </Card>
        </Col>
        <Col span={16}>
          <Card title="按标签统计">
            {stats.byTag.map(({ tag, count }) => (
              <div key={tag.id} style={{ marginBottom: '10px' }}>
                <Tag color={tag.color}>{tag.name}</Tag>
                <span style={{ marginLeft: '10px' }}>{count} 个任务</span>
                <Progress 
                  percent={stats.total > 0 ? Math.round((count / stats.total) * 100) : 0} 
                  size="small" 
                  style={{ marginTop: '5px' }}
                />
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BasicStatistics;