import React, { useState, useEffect } from 'react';
import { Card, Button, message, Modal, Spin, List, Tag, Typography, Divider } from 'antd';
import { RobotOutlined, ThunderboltOutlined, HighlightOutlined, BellOutlined, TagOutlined } from '@ant-design/icons';
import AIService from '../services/aiService';
import { loadSettingsFromLocalStorage } from '../utils/storage';

const { Title, Text } = Typography;

const AIAssistant = ({ task, onTaskUpdate }) => {
  const [aiService, setAiService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [suggestions, setSuggestions] = useState({
    category: null,
    priority: null,
    description: null,
    remindTime: null,
    tags: null
  });

  // 初始化AI服务
  useEffect(() => {
    const settings = loadSettingsFromLocalStorage();
    if (settings && settings.ai && settings.ai.enabled && settings.ai.apiKey && settings.ai.serverUrl) {
      const service = new AIService(settings.ai.apiKey, settings.ai.serverUrl);
      setAiService(service);
    }
  }, []);

  // 检查AI服务是否可用
  const isAIEnabled = () => {
    return aiService && aiService.isAvailable();
  };

  // 智能分类任务
  const handleCategorizeTask = async () => {
    if (!isAIEnabled()) {
      message.error('AI功能未启用或配置不完整');
      return;
    }

    setLoading(true);
    try {
      const result = await aiService.categorizeTask(task.title, task.description);
      setSuggestions(prev => ({ ...prev, category: result }));
      message.success(`任务分类建议: ${result.category}`);
    } catch (error) {
      message.error(`分类失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 智能优先级建议
  const handleSuggestPriority = async () => {
    if (!isAIEnabled()) {
      message.error('AI功能未启用或配置不完整');
      return;
    }

    setLoading(true);
    try {
      const result = await aiService.suggestPriority(task.title, task.description, task.dueDate);
      setSuggestions(prev => ({ ...prev, priority: result }));
      message.success(`优先级建议: ${result.priority}`);
    } catch (error) {
      message.error(`优先级建议失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 智能任务描述优化
  const handleOptimizeDescription = async () => {
    if (!isAIEnabled()) {
      message.error('AI功能未启用或配置不完整');
      return;
    }

    setLoading(true);
    try {
      const result = await aiService.optimizeTaskDescription(task.title, task.description);
      setSuggestions(prev => ({ ...prev, description: result }));
      message.success('任务描述优化完成');
    } catch (error) {
      message.error(`任务描述优化失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 智能提醒时间建议
  const handleSuggestReminder = async () => {
    if (!isAIEnabled()) {
      message.error('AI功能未启用或配置不完整');
      return;
    }

    setLoading(true);
    try {
      const result = await aiService.suggestReminderTime(task.dueDate);
      setSuggestions(prev => ({ ...prev, remindTime: result }));
      message.success(`提醒时间建议: ${result.remindTime}`);
    } catch (error) {
      message.error(`提醒时间建议失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 智能标签建议
  const handleSuggestTags = async () => {
    if (!isAIEnabled()) {
      message.error('AI功能未启用或配置不完整');
      return;
    }

    setLoading(true);
    try {
      const result = await aiService.suggestTags(task.title, task.description);
      setSuggestions(prev => ({ ...prev, tags: result }));
      message.success(`标签建议: ${result.tags.join(', ')}`);
    } catch (error) {
      message.error(`标签建议失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 应用所有建议
  const applyAllSuggestions = () => {
    const updates = {};
    
    if (suggestions.category) {
      // 这里可以将分类作为标签添加
    }
    
    if (suggestions.priority) {
      updates.priority = suggestions.priority.priority;
    }
    
    if (suggestions.description) {
      updates.description = suggestions.description.description;
    }
    
    if (suggestions.remindTime) {
      updates.remindTime = suggestions.remindTime.remindTime;
    }
    
    if (suggestions.tags) {
      // 这里需要根据建议的标签名称查找或创建标签ID
    }
    
    if (Object.keys(updates).length > 0) {
      onTaskUpdate(task.id, updates);
      message.success('已应用AI建议');
      setModalVisible(false);
      setSuggestions({
        category: null,
        priority: null,
        description: null,
        remindTime: null,
        tags: null
      });
    } else {
      message.info('没有可应用的建议');
    }
  };

  // 应用单个建议
  const applySuggestion = (type) => {
    const suggestion = suggestions[type];
    if (!suggestion) {
      message.info('没有可用的建议');
      return;
    }
    
    const updates = {};
    
    switch (type) {
      case 'priority':
        updates.priority = suggestion.priority;
        break;
      case 'description':
        updates.description = suggestion.description;
        break;
      case 'remindTime':
        updates.remindTime = suggestion.remindTime;
        break;
      default:
        message.info('此建议需要手动应用');
        return;
    }
    
    onTaskUpdate(task.id, updates);
    message.success('已应用建议');
    setSuggestions(prev => ({ ...prev, [type]: null }));
  };

  if (!isAIEnabled()) {
    return (
      <Card size="small" title="AI助手" style={{ marginTop: '20px' }}>
        <Text type="secondary">AI功能未启用，请在设置中配置AI参数</Text>
      </Card>
    );
  }

  return (
    <>
      <Card size="small" title="AI助手" style={{ marginTop: '20px' }}>
        <Button 
          type="primary" 
          icon={<RobotOutlined />} 
          onClick={() => setModalVisible(true)}
          block
        >
          AI智能助手
        </Button>
      </Card>
      
      <Modal
        title="AI智能助手"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={applyAllSuggestions}
        okText="应用所有建议"
        width={800}
      >
        <Spin spinning={loading}>
          <div style={{ marginBottom: '20px' }}>
            <Title level={5}>任务: {task.title}</Title>
            <Text type="secondary">{task.description}</Text>
          </div>
          
          <Divider>AI功能</Divider>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
            <Button 
              icon={<HighlightOutlined />} 
              onClick={handleCategorizeTask}
              disabled={!!suggestions.category}
            >
              智能分类
            </Button>
            <Button 
              icon={<ThunderboltOutlined />} 
              onClick={handleSuggestPriority}
              disabled={!!suggestions.priority}
            >
              优先级建议
            </Button>
            <Button 
              icon={<HighlightOutlined />} 
              onClick={handleOptimizeDescription}
              disabled={!!suggestions.description}
            >
              描述优化
            </Button>
            <Button 
              icon={<BellOutlined />} 
              onClick={handleSuggestReminder}
              disabled={!!suggestions.remindTime}
            >
              提醒时间建议
            </Button>
            <Button 
              icon={<TagOutlined />} 
              onClick={handleSuggestTags}
              disabled={!!suggestions.tags}
            >
              标签建议
            </Button>
          </div>
          
          <Divider>AI建议</Divider>
          
          <List
            dataSource={Object.entries(suggestions).filter(([key, value]) => value !== null)}
            renderItem={([key, value]) => (
              <List.Item
                actions={[
                  <Button 
                    size="small" 
                    onClick={() => applySuggestion(key)}
                    disabled={!value}
                  >
                    应用
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={
                    <span>
                      {key === 'category' && '任务分类'}
                      {key === 'priority' && '优先级建议'}
                      {key === 'description' && '描述优化'}
                      {key === 'remindTime' && '提醒时间建议'}
                      {key === 'tags' && '标签建议'}
                    </span>
                  }
                  description={
                    <div>
                      {key === 'category' && (
                        <div>
                          <Tag color="blue">{value.category}</Tag>
                          <Text type="secondary"> 置信度: {Math.round(value.confidence * 100)}%</Text>
                        </div>
                      )}
                      {key === 'priority' && (
                        <div>
                          <Tag color={value.priority === 'high' ? 'red' : value.priority === 'medium' ? 'orange' : 'green'}>
                            {value.priority === 'high' ? '高优先级' : value.priority === 'medium' ? '中优先级' : '低优先级'}
                          </Tag>
                          <Text type="secondary"> 原因: {value.reason}</Text>
                        </div>
                      )}
                      {key === 'description' && (
                        <div>
                          <Text>{value.description}</Text>
                          <div style={{ marginTop: '5px' }}>
                            {value.suggestions && value.suggestions.map((suggestion, index) => (
                              <Tag key={index} color="blue">{suggestion}</Tag>
                            ))}
                          </div>
                        </div>
                      )}
                      {key === 'remindTime' && (
                        <div>
                          <Tag color="purple">{value.remindTime}</Tag>
                          <Text type="secondary"> 原因: {value.reason}</Text>
                        </div>
                      )}
                      {key === 'tags' && (
                        <div>
                          {value.tags.map((tag, index) => (
                            <Tag key={index} color="green">{tag}</Tag>
                          ))}
                          <Text type="secondary"> 置信度: {Math.round(value.confidence * 100)}%</Text>
                        </div>
                      )}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Spin>
      </Modal>
    </>
  );
};

export default AIAssistant;