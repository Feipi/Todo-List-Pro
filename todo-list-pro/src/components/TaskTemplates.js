import React, { useState, useEffect } from 'react';
import { Card, Button, List, Input, Tag, Modal, Form, Select, message } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { loadTemplatesFromLocalStorage, saveTemplatesToLocalStorage } from '../utils/storage';

const { TextArea } = Input;
const { Option } = Select;

const TaskTemplates = ({ onApplyTemplate }) => {
  const [templates, setTemplates] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [form] = Form.useForm();

  // 组件挂载时加载模板
  useEffect(() => {
    const loadedTemplates = loadTemplatesFromLocalStorage();
    setTemplates(loadedTemplates);
  }, []);

  // 保存模板到LocalStorage
  const saveTemplates = (newTemplates) => {
    setTemplates(newTemplates);
    saveTemplatesToLocalStorage(newTemplates);
  };

  // 添加或更新模板
  const handleAddTemplate = (values) => {
    const template = {
      id: editingTemplate ? editingTemplate.id : Date.now(),
      name: values.name,
      title: values.title,
      description: values.description,
      priority: values.priority,
      tagIds: values.tagIds || []
    };

    if (editingTemplate) {
      // 更新现有模板
      const updatedTemplates = templates.map(t => 
        t.id === editingTemplate.id ? template : t
      );
      saveTemplates(updatedTemplates);
      message.success('模板更新成功');
    } else {
      // 添加新模板
      saveTemplates([...templates, template]);
      message.success('模板添加成功');
    }

    setIsModalVisible(false);
    form.resetFields();
    setEditingTemplate(null);
  };

  // 删除模板
  const handleDeleteTemplate = (id) => {
    const updatedTemplates = templates.filter(t => t.id !== id);
    saveTemplates(updatedTemplates);
    message.success('模板删除成功');
  };

  // 编辑模板
  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    form.setFieldsValue({
      name: template.name,
      title: template.title,
      description: template.description,
      priority: template.priority,
      tagIds: template.tagIds || []
    });
    setIsModalVisible(true);
  };

  // 应用模板
  const handleApplyTemplate = (template) => {
    onApplyTemplate({
      title: template.title,
      description: template.description,
      priority: template.priority,
      tagIds: template.tagIds || []
    });
  };

  // 取消编辑
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingTemplate(null);
  };

  return (
    <Card title="任务模板" style={{ margin: '20px 0' }}>
      <Button 
        type="primary" 
        icon={<PlusOutlined />} 
        onClick={() => setIsModalVisible(true)}
        style={{ marginBottom: '20px' }}
      >
        添加模板
      </Button>
      
      <List
        dataSource={templates}
        renderItem={template => (
          <List.Item
            actions={[
              <Button 
                icon={<EditOutlined />} 
                onClick={() => handleEditTemplate(template)}
              >
                编辑
              </Button>,
              <Button 
                icon={<DeleteOutlined />} 
                onClick={() => handleDeleteTemplate(template.id)}
                danger
              >
                删除
              </Button>
            ]}
          >
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3>{template.name}</h3>
                  <p><strong>标题:</strong> {template.title}</p>
                  <p><strong>描述:</strong> {template.description}</p>
                  <p>
                    <strong>优先级:</strong> 
                    <Tag color={
                      template.priority === 'high' ? '#ff4d4f' : 
                      template.priority === 'medium' ? '#faad14' : '#52c41a'
                    }>
                      {template.priority === 'high' ? '高' : 
                       template.priority === 'medium' ? '中' : '低'}
                    </Tag>
                  </p>
                </div>
                <Button 
                  type="primary" 
                  onClick={() => handleApplyTemplate(template)}
                >
                  应用模板
                </Button>
              </div>
            </div>
          </List.Item>
        )}
      />
      
      {/* 添加/编辑模板模态框 */}
      <Modal
        title={editingTemplate ? "编辑模板" : "添加模板"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddTemplate}
        >
          <Form.Item
            name="name"
            label="模板名称"
            rules={[{ required: true, message: '请输入模板名称' }]}
          >
            <Input placeholder="模板名称" />
          </Form.Item>
          
          <Form.Item
            name="title"
            label="任务标题"
            rules={[{ required: true, message: '请输入任务标题' }]}
          >
            <Input placeholder="任务标题" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="任务描述"
          >
            <TextArea placeholder="任务描述" rows={3} />
          </Form.Item>
          
          <Form.Item
            name="priority"
            label="优先级"
            initialValue="medium"
          >
            <Select>
              <Option value="high">高</Option>
              <Option value="medium">中</Option>
              <Option value="low">低</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="tagIds"
            label="标签"
          >
            <Select mode="multiple" placeholder="选择标签">
              {/* 这里可以从父组件传递标签数据 */}
              <Option value={1}>工作</Option>
              <Option value={2}>个人</Option>
              <Option value={3}>学习</Option>
            </Select>
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editingTemplate ? "更新模板" : "添加模板"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default TaskTemplates;