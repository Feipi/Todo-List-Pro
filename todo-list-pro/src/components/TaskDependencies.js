import React, { useState, useEffect } from 'react';
import { Card, List, Typography, Select, Button, message } from 'antd';
import { loadTasksFromLocalStorage, saveTasksToLocalStorage } from '../utils/storage';

const { Title } = Typography;
const { Option } = Select;

const TaskDependencies = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [dependencies, setDependencies] = useState([]);

  // 加载任务
  useEffect(() => {
    const loadedTasks = loadTasksFromLocalStorage();
    setTasks(loadedTasks);
  }, []);

  // 保存任务依赖关系
  const saveDependencies = (taskId, newDependencies) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, dependencies: newDependencies };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
    message.success('任务依赖已保存');
  };

  // 添加依赖
  const addDependency = (dependencyId) => {
    if (!selectedTask) return;
    
    // 检查是否已经添加了该依赖
    if (selectedTask.dependencies && selectedTask.dependencies.includes(dependencyId)) {
      message.warning('该依赖已存在');
      return;
    }
    
    // 检查循环依赖
    if (dependencyId === selectedTask.id) {
      message.error('不能将任务设置为依赖自身');
      return;
    }
    
    const newDependencies = selectedTask.dependencies 
      ? [...selectedTask.dependencies, dependencyId] 
      : [dependencyId];
      
    saveDependencies(selectedTask.id, newDependencies);
    
    // 更新本地状态
    setSelectedTask({ ...selectedTask, dependencies: newDependencies });
  };

  // 移除依赖
  const removeDependency = (dependencyId) => {
    if (!selectedTask || !selectedTask.dependencies) return;
    
    const newDependencies = selectedTask.dependencies.filter(id => id !== dependencyId);
    saveDependencies(selectedTask.id, newDependencies);
    
    // 更新本地状态
    setSelectedTask({ ...selectedTask, dependencies: newDependencies });
  };

  // 获取依赖任务的详细信息
  const getDependencyTask = (taskId) => {
    return tasks.find(task => task.id === taskId);
  };

  // 检查任务是否可以开始（所有依赖任务都已完成）
  const canTaskStart = (task) => {
    if (!task.dependencies || task.dependencies.length === 0) return true;
    
    return task.dependencies.every(depId => {
      const depTask = tasks.find(t => t.id === depId);
      return depTask && depTask.completed;
    });
  };

  return (
    <Card title="任务依赖管理" style={{ margin: '20px 0' }}>
      <div style={{ marginBottom: '20px' }}>
        <Title level={4}>选择任务</Title>
        <Select
          style={{ width: '100%' }}
          placeholder="选择一个任务来管理依赖"
          onChange={(value) => {
            const task = tasks.find(t => t.id === value);
            setSelectedTask(task);
          }}
          showSearch
          optionFilterProp="children"
        >
          {tasks.map(task => (
            <Option key={task.id} value={task.id}>
              {task.title}
            </Option>
          ))}
        </Select>
      </div>

      {selectedTask && (
        <div>
          <Title level={4}>设置依赖</Title>
          <div style={{ marginBottom: '20px' }}>
            <Select
              style={{ width: '80%', marginRight: '10px' }}
              placeholder="选择依赖的任务"
              showSearch
              optionFilterProp="children"
            >
              {tasks
                .filter(task => task.id !== selectedTask.id && 
                  (!selectedTask.dependencies || !selectedTask.dependencies.includes(task.id)))
                .map(task => (
                  <Option key={task.id} value={task.id}>
                    {task.title}
                  </Option>
                ))}
            </Select>
            <Button 
              type="primary"
              onClick={(e) => {
                const selectElement = e.target.parentElement.querySelector('select');
                const selectedValue = selectElement.value;
                if (selectedValue) {
                  addDependency(Number(selectedValue));
                }
              }}
            >
              添加依赖
            </Button>
          </div>

          <Title level={4}>当前依赖</Title>
          {selectedTask.dependencies && selectedTask.dependencies.length > 0 ? (
            <List
              bordered
              dataSource={selectedTask.dependencies}
              renderItem={depId => {
                const depTask = getDependencyTask(depId);
                return (
                  <List.Item
                    actions={[
                      <Button 
                        type="link" 
                        danger 
                        onClick={() => removeDependency(depId)}
                      >
                        移除
                      </Button>
                    ]}
                  >
                    <div>
                      <span>{depTask ? depTask.title : `未知任务 (${depId})`}</span>
                      {depTask && (
                        <span style={{ 
                          marginLeft: '10px', 
                          color: depTask.completed ? '#52c41a' : '#faad14' 
                        }}>
                          ({depTask.completed ? '已完成' : '未完成'})
                        </span>
                      )}
                    </div>
                  </List.Item>
                );
              }}
            />
          ) : (
            <p>当前任务没有依赖</p>
          )}

          <div style={{ marginTop: '20px' }}>
            <Title level={4}>依赖状态</Title>
            <p>
              该任务{canTaskStart(selectedTask) ? (
                <span style={{ color: '#52c41a' }}>可以开始执行</span>
              ) : (
                <span style={{ color: '#faad14' }}>需要等待依赖任务完成</span>
              )}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default TaskDependencies;