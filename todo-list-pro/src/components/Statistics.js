import React from 'react';
import { Card, Tabs } from 'antd';
import BasicStatistics from './BasicStatistics';
import AnalyticsReport from './AnalyticsReport';
import TrendAnalysis from './TrendAnalysis';

const { TabPane } = Tabs;

const Statistics = () => {
  return (
    <div>
      <Card title="统计分析" style={{ margin: '20px 0' }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="基础统计" key="1">
            <BasicStatistics />
          </TabPane>
          <TabPane tab="分析报告" key="2">
            <AnalyticsReport />
          </TabPane>
          <TabPane tab="趋势分析" key="3">
            <TrendAnalysis />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default Statistics;