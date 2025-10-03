import React, { useState } from 'react';
import { Modal, Steps, Button, Typography, Card, Collapse, Divider } from 'antd';
import { 
  FileAddOutlined, 
  TagOutlined, 
  BellOutlined, 
  BarChartOutlined,
  UserOutlined,
  SearchOutlined,
  CloudOutlined,
  LockOutlined,
  RobotOutlined,
  TrophyOutlined,
  MobileOutlined
} from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { Step } = Steps;
const { Panel } = Collapse;

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
              <li>添加子任务，将复杂任务分解为小步骤</li>
              <li>设置任务依赖，确保任务按正确顺序完成</li>
            </ul>
          </Card>
          
          <Divider />
          
          <Title level={5}>高级功能</Title>
          <Collapse>
            <Panel header="任务模板" key="1">
              <p>使用任务模板快速创建相似任务，提高效率。</p>
            </Panel>
            <Panel header="语音输入" key="2">
              <p>使用语音输入快速添加任务标题和描述。</p>
            </Panel>
            <Panel header="快速短语" key="3">
              <p>预设常用短语，一键添加到任务描述中。</p>
            </Panel>
          </Collapse>
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
              <li>使用标签云查看标签使用情况</li>
            </ul>
          </Card>
          
          <Divider />
          
          <Title level={5}>标签最佳实践</Title>
          <Collapse>
            <Panel header="标签分类建议" key="1">
              <p>建议按以下方式分类标签：</p>
              <ul>
                <li>工作相关：会议、项目、报告等</li>
                <li>个人生活：家庭、健康、娱乐等</li>
                <li>学习成长：读书、课程、技能等</li>
              </ul>
            </Panel>
          </Collapse>
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
              <li>可设置多个提醒时间</li>
              <li>智能提醒建议功能</li>
            </ul>
          </Card>
          
          <Divider />
          
          <Title level={5}>提醒设置技巧</Title>
          <Collapse>
            <Panel header="提醒时间建议" key="1">
              <p>根据不同任务类型设置提醒时间：</p>
              <ul>
                <li>紧急任务：提前1小时提醒</li>
                <li>日常工作：当天早上提醒</li>
                <li>长期项目：提前一天提醒</li>
              </ul>
            </Panel>
          </Collapse>
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
              <li>按优先级、状态等条件筛选</li>
              <li>保存常用筛选条件</li>
            </ul>
          </Card>
          
          <Divider />
          
          <Title level={5}>高级搜索技巧</Title>
          <Collapse>
            <Panel header="搜索语法" key="1">
              <p>支持以下搜索语法：</p>
              <ul>
                <li>关键词搜索：直接输入关键词</li>
                <li>标签搜索：使用 #标签名</li>
                <li>优先级搜索：使用 priority:high 等</li>
              </ul>
            </Panel>
          </Collapse>
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
              <li>分析标签使用情况</li>
              <li>查看工作效率分析</li>
            </ul>
          </Card>
          
          <Divider />
          
          <Title level={5}>数据解读</Title>
          <Collapse>
            <Panel header="如何提高完成率" key="1">
              <p>根据统计数据优化任务管理：</p>
              <ul>
                <li>关注逾期任务，分析原因</li>
                <li>合理分配任务优先级</li>
                <li>保持每日任务完成的稳定性</li>
              </ul>
            </Panel>
          </Collapse>
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
              <li>支持第三方登录（微信、QQ等）</li>
            </ul>
          </Card>
          
          <Divider />
          
          <Title level={5}>安全建议</Title>
          <Collapse>
            <Panel header="账户安全" key="1">
              <p>保护账户安全的建议：</p>
              <ul>
                <li>使用强密码</li>
                <li>定期更换密码</li>
                <li>不要在公共设备上保存登录状态</li>
              </ul>
            </Panel>
          </Collapse>
        </div>
      )
    },
    {
      title: '云同步',
      icon: <CloudOutlined />,
      content: (
        <div>
          <Title level={4}>跨设备同步任务数据</Title>
          <Paragraph>
            启用云同步功能，在不同设备间同步您的任务数据。
          </Paragraph>
          <Card size="small">
            <ul>
              <li>在设置中配置云同步服务器</li>
              <li>设置同步间隔时间</li>
              <li>支持手动和自动同步</li>
              <li>查看同步状态和日志</li>
              <li>处理同步冲突</li>
            </ul>
          </Card>
          
          <Divider />
          
          <Title level={5}>同步最佳实践</Title>
          <Collapse>
            <Panel header="同步设置建议" key="1">
              <p>优化云同步体验：</p>
              <ul>
                <li>在网络稳定时进行同步</li>
                <li>定期检查同步状态</li>
                <li>在重要操作前后手动同步</li>
              </ul>
            </Panel>
          </Collapse>
        </div>
      )
    },
    {
      title: '隐私安全',
      icon: <LockOutlined />,
      content: (
        <div>
          <Title level={4}>保护您的隐私数据</Title>
          <Paragraph>
            使用隐私功能保护您的敏感任务信息。
          </Paragraph>
          <Card size="small">
            <ul>
              <li>启用隐私模式隐藏任务内容</li>
              <li>数据加密保护导出文件</li>
              <li>设置访问控制和自动锁定</li>
              <li>查看操作日志</li>
              <li>安全清除所有数据</li>
            </ul>
          </Card>
          
          <Divider />
          
          <Title level={5}>隐私保护技巧</Title>
          <Collapse>
            <Panel header="隐私设置建议" key="1">
              <p>增强隐私保护：</p>
              <ul>
                <li>在公共场合启用隐私模式</li>
                <li>定期更改主密码</li>
                <li>谨慎导出数据</li>
              </ul>
            </Panel>
          </Collapse>
        </div>
      )
    },
    {
      title: 'AI助手',
      icon: <RobotOutlined />,
      content: (
        <div>
          <Title level={4}>智能任务管理助手</Title>
          <Paragraph>
            使用AI助手智能分析和优化您的任务。
          </Paragraph>
          <Card size="small">
            <ul>
              <li>智能任务分类建议</li>
              <li>优先级智能推荐</li>
              <li>任务描述优化</li>
              <li>提醒时间智能建议</li>
              <li>标签智能推荐</li>
            </ul>
          </Card>
          
          <Divider />
          
          <Title level={5}>AI使用技巧</Title>
          <Collapse>
            <Panel header="提高AI效果" key="1">
              <p>获得更好的AI建议：</p>
              <ul>
                <li>提供详细的任务描述</li>
                <li>设置明确的截止日期</li>
                <li>定期更新AI模型</li>
              </ul>
            </Panel>
          </Collapse>
        </div>
      )
    },
    {
      title: '成就系统',
      icon: <TrophyOutlined />,
      content: (
        <div>
          <Title level={4}>激励您完成更多任务</Title>
          <Paragraph>
            通过完成任务解锁成就，激励您更好地管理时间。
          </Paragraph>
          <Card size="small">
            <ul>
              <li>完成任务解锁成就</li>
              <li>查看成就统计和进度</li>
              <li>按类别筛选成就</li>
              <li>分享成就到社交平台</li>
            </ul>
          </Card>
          
          <Divider />
          
          <Title level={5}>成就解锁技巧</Title>
          <Collapse>
            <Panel header="快速解锁成就" key="1">
              <p>高效完成任务解锁成就：</p>
              <ul>
                <li>保持每日完成任务的习惯</li>
                <li>挑战更高难度的任务</li>
                <li>参与团队协作任务</li>
              </ul>
            </Panel>
          </Collapse>
        </div>
      )
    },
    {
      title: '多端支持',
      icon: <MobileOutlined />,
      content: (
        <div>
          <Title level={4}>随时随地管理任务</Title>
          <Paragraph>
            支持桌面端和移动端，随时随地管理您的任务。
          </Paragraph>
          <Card size="small">
            <ul>
              <li>响应式设计适配不同屏幕</li>
              <li>移动端优化触控操作</li>
              <li>离线模式支持</li>
              <li>数据自动同步</li>
            </ul>
          </Card>
          
          <Divider />
          
          <Title level={5}>移动端使用技巧</Title>
          <Collapse>
            <Panel header="移动设备优化" key="1">
              <p>在移动设备上获得更好的体验：</p>
              <ul>
                <li>使用手势操作快速完成任务</li>
                <li>启用推送通知及时提醒</li>
                <li>使用语音输入快速添加任务</li>
              </ul>
            </Panel>
          </Collapse>
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
      title="To-Do List Pro 使用指南"
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
      width={800}
    >
      <Steps current={currentStep} style={{ marginBottom: 20 }}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} icon={item.icon} />
        ))}
      </Steps>
      <div style={{ minHeight: 400, maxHeight: 500, overflowY: 'auto' }}>
        {steps[currentStep].content}
      </div>
    </Modal>
  );
};

export default Guide;