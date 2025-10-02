import React, { useState, useEffect } from 'react';
import { Card, Button, List, Input, Modal, Form, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { loadQuickPhrasesFromLocalStorage, saveQuickPhrasesToLocalStorage } from '../utils/storage';

const QuickPhrases = ({ onApplyPhrase }) => {
  const [phrases, setPhrases] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingPhrase, setEditingPhrase] = useState(null);
  const [form] = Form.useForm();

  // 组件挂载时从LocalStorage加载短语
  useEffect(() => {
    const loadedPhrases = loadQuickPhrasesFromLocalStorage();
    setPhrases(loadedPhrases);
  }, []);

  // 保存短语到LocalStorage
  const savePhrases = (newPhrases) => {
    setPhrases(newPhrases);
    saveQuickPhrasesToLocalStorage(newPhrases);
  };

  // 添加或更新短语
  const handleAddPhrase = (values) => {
    const phrase = {
      id: editingPhrase ? editingPhrase.id : Date.now(),
      text: values.text,
      title: values.title
    };

    if (editingPhrase) {
      // 更新现有短语
      const updatedPhrases = phrases.map(p => 
        p.id === editingPhrase.id ? phrase : p
      );
      savePhrases(updatedPhrases);
      message.success('短语更新成功');
    } else {
      // 添加新短语
      savePhrases([...phrases, phrase]);
      message.success('短语添加成功');
    }

    setIsModalVisible(false);
    form.resetFields();
    setEditingPhrase(null);
  };

  // 删除短语
  const handleDeletePhrase = (id) => {
    const updatedPhrases = phrases.filter(p => p.id !== id);
    savePhrases(updatedPhrases);
    message.success('短语删除成功');
  };

  // 编辑短语
  const handleEditPhrase = (phrase) => {
    setEditingPhrase(phrase);
    form.setFieldsValue({
      title: phrase.title,
      text: phrase.text
    });
    setIsModalVisible(true);
  };

  // 应用短语
  const handleApplyPhrase = (phrase) => {
    onApplyPhrase(phrase.text);
  };

  // 取消编辑
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingPhrase(null);
  };

  return (
    <Card title="快速短语" size="small">
      <Button 
        type="primary" 
        icon={<PlusOutlined />} 
        onClick={() => setIsModalVisible(true)}
        size="small"
        style={{ marginBottom: '10px' }}
      >
        添加短语
      </Button>
      
      <List
        dataSource={phrases}
        renderItem={phrase => (
          <List.Item
            actions={[
              <Button 
                icon={<EditOutlined />} 
                onClick={() => handleEditPhrase(phrase)}
                size="small"
              />,
              <Button 
                icon={<DeleteOutlined />} 
                onClick={() => handleDeletePhrase(phrase.id)}
                size="small"
                danger
              />
            ]}
          >
            <div style={{ width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div><strong>{phrase.title}</strong></div>
                  <div>{phrase.text}</div>
                </div>
                <Button 
                  type="primary" 
                  size="small"
                  onClick={() => handleApplyPhrase(phrase)}
                >
                  应用
                </Button>
              </div>
            </div>
          </List.Item>
        )}
      />
      
      {/* 添加/编辑短语模态框 */}
      <Modal
        title={editingPhrase ? "编辑短语" : "添加短语"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddPhrase}
        >
          <Form.Item
            name="title"
            label="短语标题"
            rules={[{ required: true, message: '请输入短语标题' }]}
          >
            <Input placeholder="短语标题" />
          </Form.Item>
          
          <Form.Item
            name="text"
            label="短语内容"
            rules={[{ required: true, message: '请输入短语内容' }]}
          >
            <Input.TextArea placeholder="短语内容" rows={3} />
          </Form.Item>
          
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editingPhrase ? "更新短语" : "添加短语"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default QuickPhrases;