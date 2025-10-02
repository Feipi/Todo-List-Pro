import React from 'react';
import { Card, Tag, Typography } from 'antd';
import { loadTagsFromLocalStorage, loadTasksFromLocalStorage } from '../utils/storage';

const { Title } = Typography;

const TagCloud = () => {
  // 获取所有标签和任务
  const tags = loadTagsFromLocalStorage();
  const tasks = loadTasksFromLocalStorage();
  
  // 计算每个标签的使用频率
  const tagFrequency = tags.map(tag => {
    const count = tasks.filter(task => 
      task.tagIds && task.tagIds.includes(tag.id)
    ).length;
    return {
      ...tag,
      count
    };
  }).filter(tag => tag.count > 0); // 只显示有任务的标签
  
  // 根据频率确定标签大小
  const getTagSize = (count, maxCount) => {
    if (maxCount === 0) return 'small';
    const ratio = count / maxCount;
    if (ratio > 0.7) return 'large';
    if (ratio > 0.4) return 'medium';
    return 'small';
  };
  
  // 获取标签字体大小
  const getTagFontSize = (count, maxCount) => {
    if (maxCount === 0) return '12px';
    const minSize = 12;
    const maxSize = 24;
    const ratio = count / maxCount;
    return `${minSize + (maxSize - minSize) * ratio}px`;
  };

  // 找到最大频率
  const maxCount = Math.max(...tagFrequency.map(tag => tag.count), 0);

  return (
    <Card title="标签云" style={{ margin: '20px 0' }}>
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '10px',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px'
      }}>
        {tagFrequency.length > 0 ? (
          tagFrequency.map(tag => (
            <Tag
              key={tag.id}
              color={tag.color}
              style={{ 
                fontSize: getTagFontSize(tag.count, maxCount),
                padding: '5px 10px',
                borderRadius: '15px'
              }}
            >
              {tag.name} ({tag.count})
            </Tag>
          ))
        ) : (
          <div style={{ textAlign: 'center', color: '#999' }}>
            <Title level={4}>暂无标签数据</Title>
            <p>创建标签并将其分配给任务以查看标签云</p>
          </div>
        )}
      </div>
      
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', color: '#999' }}>
          标签大小表示使用频率，括号内为任务数量
        </p>
      </div>
    </Card>
  );
};

export default TagCloud;