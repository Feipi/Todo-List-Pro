import React, { useState, useEffect } from 'react';
import { Card, List, Button, Tag, Typography, Modal, Form, Select, TimePicker, message } from 'antd';
import { loadTasksFromLocalStorage, saveTasksToLocalStorage } from '../utils/storage';
import moment from 'moment';

const { Title, Text } = Typography;
const { Option } = Select;

const SmartReminders = () => {
  const [tasks, setTasks] = useState([]);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [form] = Form.useForm();

  // 组件挂载时从LocalStorage加载任务
  useEffect(() => {
    const loadedTasks = loadTasksFromLocalStorage();
    setTasks(loadedTasks);
    
    // 检查逾期任务
    checkOverdueTasks(loadedTasks);
  }, []);

  // 检查逾期任务
  const checkOverdueTasks = (tasksList) => {
    const now = moment();
    const overdueList = tasksList.filter(task => 
      !task.completed && 
      task.dueDate && 
      moment(task.dueDate).isBefore(now, 'day')
    );
    setOverdueTasks(overdueList);
  };

  // 任务数据变化时保存到LocalStorage
  useEffect(() => {
    saveTasksToLocalStorage(tasks);
  }, [tasks]);

  // 延期任务
  const postponeTask = (task, days) => {
    const updatedTasks = tasks.map(t => {
      if (t.id === task.id) {
        const newDueDate = moment(task.dueDate).add(days, 'days').format('YYYY-MM-DD');
        return { ...t, dueDate: newDueDate };
      }
      return t;
    });
    setTasks(updatedTasks);
    checkOverdueTasks(updatedTasks);
    message.success(`任务已延期${days}天`);
  };

  // 拆分任务
  const splitTask = (task) => {
    setSelectedTask(task);
    setIsModalVisible(true);
  };

  // 归档任务
  const archiveTask = (task) => {
    const updatedTasks = tasks.map(t => 
      t.id === task.id ? { ...t, archived: true } : t
    );
    setTasks(updatedTasks);
    checkOverdueTasks(updatedTasks);
    message.success('任务已归档');
  };

  // 设置智能提醒时间
  const setSmartReminder = (values) => {
    if (selectedTask) {
      const remindTime = values.remindTime.format('HH:mm');
      const updatedTasks = tasks.map(t => 
        t.id === selectedTask.id ? { ...t, remindTime } : t
      );
      setTasks(updatedTasks);
      setIsModalVisible(false);
      form.resetFields();
      setSelectedTask(null);
      message.success('智能提醒时间已设置');
    }
  };

  // 获取优先级颜色
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ff4d4f';
      case 'medium': return '#faad14';
      case 'low': return '#52c41a';
      default: return '#d9d9d9';
    }
  };

  return (
    <Card title="智能提醒" style={{ margin: '20px 0' }}>
      {overdueTasks.length > 0 ? (
        <List
          dataSource={overdueTasks}
          renderItem={task => (
            <List.Item>
              <div style={{ width: '100%' }}>
                <Title level={5}>
                  {task.title}
                  {task.priority && (
                    <Tag color={getPriorityColor(task.priority)} style={{ marginLeft: '10px' }}>
                      {task.priority === 'high' ? '高优先级' : 
                       task.priority === 'medium' ? '中优先级' : '低优先级'}
                    </Tag>
                  )}
                </Title>
                <Text>截止日期: {task.dueDate}</Text><br />
                <Text>逾期天数: {moment().diff(moment(task.dueDate), 'days')}天</Text>
                <div style={{ marginTop: '10px' }}>
                  <Button 
                    onClick={() => postponeTask(task, 1)} 
                    style={{ marginRight: '10px' }}
                  >
                    推迟到明天
                  </Button>
                  <Button 
                    onClick={() => postponeTask(task, 7)} 
                    style={{ marginRight: '10px' }}
                  >
                    推迟一周
                  </Button>
                  <Button 
                    onClick={() => splitTask(task)} 
                    style={{ marginRight: '10px' }}
                  >
                    拆分任务
                  </Button>
                  <Button 
                    onClick={() => archiveTask(task)} 
                    danger
                  >
                    归档
                  </Button>
                </div>
              </div>
            </List.Item>
          )}
        />
      ) : (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Text>暂无逾期任务，继续保持！</Text>
        </div>
      )}
      
      {/* 拆分任务模态框 */}
      <Modal
        title="拆分任务"
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setSelectedTask(null);
        }}
        footer={null}
      >
        {selectedTask && (
          <Form
            form={form}
            layout="vertical"
            onFinish={setSmartReminder}
          >
            <Form.Item
              label="为拆分后的任务设置提醒时间"
              name="remindTime"
              rules={[{ required: true, message: '请选择提醒时间' }]}
            >
              <TimePicker format="HH:mm" style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                确认拆分
              </Button>
            </Form.Item>
          </Form>
        )}
      </Modal>
    </Card>
  );
};

export default SmartReminders;