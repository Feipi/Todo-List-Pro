import React, { useState } from 'react';
import { Card, Badge, Modal, List, Typography, Button } from 'antd';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { loadTasksFromLocalStorage } from '../utils/storage';

const { Title, Text } = Typography;
const localizer = momentLocalizer(moment);

const CalendarView = () => {
  const [tasks] = useState(loadTasksFromLocalStorage());
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // 将任务转换为日历事件
  const events = tasks.map(task => ({
    id: task.id,
    title: task.title,
    start: task.dueDate ? new Date(task.dueDate) : new Date(),
    end: task.dueDate ? new Date(task.dueDate) : new Date(),
    allDay: true,
    resource: task
  }));

  // 事件点击处理
  const handleSelectEvent = (event) => {
    setSelectedTask(event.resource);
    setModalVisible(true);
  };

  // 事件样式处理
  const eventStyleGetter = (event) => {
    let backgroundColor = '#3174ad';
    
    // 根据优先级设置颜色
    switch (event.resource.priority) {
      case 'high':
        backgroundColor = '#ff4d4f';
        break;
      case 'medium':
        backgroundColor = '#faad14';
        break;
      case 'low':
        backgroundColor = '#52c41a';
        break;
      default:
        backgroundColor = '#3174ad';
    }
    
    const style = {
      backgroundColor,
      borderRadius: '4px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block'
    };
    
    return {
      style
    };
  };

  return (
    <Card title="日历视图" style={{ margin: '20px 0' }}>
      <div style={{ height: '700px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={eventStyleGetter}
          messages={{
            next: "下一页",
            previous: "上一页",
            today: "今天",
            month: "月",
            week: "周",
            day: "日",
            agenda: "日程",
            date: "日期",
            time: "时间",
            event: "事件"
          }}
        />
      </div>
      
      {/* 任务详情模态框 */}
      <Modal
        title="任务详情"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            关闭
          </Button>
        ]}
      >
        {selectedTask && (
          <div>
            <Title level={4}>{selectedTask.title}</Title>
            <p>{selectedTask.description}</p>
            <Text>截止日期: {selectedTask.dueDate}</Text><br />
            <Text>优先级: {selectedTask.priority}</Text><br />
            {selectedTask.remindTime && <Text>提醒时间: {selectedTask.remindTime}</Text>}
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default CalendarView;