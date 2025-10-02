import React, { useState } from 'react';
import { Modal, Steps, Button, Typography, Card } from 'antd';
import { 
  FileAddOutlined, 
  TagOutlined, 
  BellOutlined, 
  BarChartOutlined,
  UserOutlined,
  SearchOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { Step } = Steps;

const Guide = ({ visible, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: '创建任务',
      icon: <FileAddOutlined />,
      content: (
        <div>
          <Title level={4}>添加您的第一个任务</Title>
          <Paragraph>
            在"任务管理"页面，输入任务标题、描述、截止日期等信息，点击"添加"按钮即可创建任务。
          </Paragraph>
          <Card size="small">
            <ul>
              <li>设置任务优先级（高/中/低）</li>
              <li>添加提醒时间，不会错过重要任务</li>
              <li>为任务分配标签，方便分类管理</li>
            </ul>
          </Card>
        </div>
      )
    },
    {
      title: '管理标签',
      icon: <TagOutlined />,
      content: (
        <div>
          <Title level={4}>使用标签分类任务</Title>
          <Paragraph>
            在"标签管理"页面，您可以创建不同颜色的标签，用于分类您的任务。
          </Paragraph>
          <Card size="small">
            <ul>
              <li>点击"添加标签"创建新标签</li>
              <li>为标签设置专属颜色</li>
              <li>在任务中选择对应标签</li>
              <li>通过标签快速筛选任务</li>
            </ul>
          </Card>
        </div>
      )
    },
    {
      title: '设置提醒',
      icon: <BellOutlined />,
      content: (
        <div>
          <Title level={4}>不再错过重要任务</Title>
          <Paragraph>
            为任务设置提醒时间，系统会在指定时间通过浏览器通知和页面弹窗提醒您。
          </Paragraph>
          <Card size="small">
            <ul>
              <li>在添加任务时设置提醒时间</li>
              <li>系统会自动触发提醒</li>
              <li>支持浏览器通知和页面内提醒</li>
            </ul>
          </Card>
        </div>
      )
    },
    {
      title: '搜索筛选',
      icon: <SearchOutlined />,
      content: (
        <div>
          <Title level={4}>快速找到目标任务</Title>
          <Paragraph>
            使用搜索和标签筛选功能，快速定位您要找的任务。
          </Paragraph>
          <Card size="small">
            <ul>
              <li>在搜索框输入关键词查找任务</li>
              <li>通过标签筛选任务</li>
              <li>支持同时使用多种筛选条件</li>
            </ul>
          </Card>
        </div>
      )
    },
    {
      title: '统计分析',
      icon: <BarChartOutlined />,
      content: (
        <div>
          <Title level={4}>了解您的任务完成情况</Title>
          <Paragraph>
            在"统计分析"页面，您可以查看任务统计数据和完成情况。
          </Paragraph>
          <Card size="small">
            <ul>
              <li>查看今日待办、已完成、逾期任务数</li>
              <li>了解不同优先级任务的分布</li>
              <li>按日期范围查看任务统计</li>
            </ul>
          </Card>
        </div>
      )
    },
    {
      title: '账户管理',
      icon: <UserOutlined />,
      content: (
        <div>
          <Title level={4}>保护您的数据安全</Title>
          <Paragraph>
            注册/登录账户，确保您的任务数据安全，并支持跨设备同步。
          </Paragraph>
          <Card size="small">
            <ul>
              <li>注册账户保存您的任务数据</li>
              <li>登录后可在不同设备访问数据</li>
              <li>随时退出登录保护隐私</li>
            </ul>
          </Card>
        </div>
      )
    }
  ];

  const next = () => {
    setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <Modal
      title="To-Do List Pro 新手引导"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={prev} disabled={currentStep === 0}>
          上一步
        </Button>,
        currentStep === steps.length - 1 ? (
          <Button key="done" type="primary" onClick={onClose}>
            开始使用
          </Button>
        ) : (
          <Button key="next" type="primary" onClick={next}>
            下一步
          </Button>
        )
      ]}
      width={600}
    >
      <Steps current={currentStep} style={{ marginBottom: 20 }}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} icon={item.icon} />
        ))}
      </Steps>
      <div style={{ minHeight: 200 }}>
        {steps[currentStep].content}
      </div>
    </Modal>
  );
};

export default Guide;