import React, { useState, useEffect } from 'react';
import { Card, List, Typography, Input, Button, Tag, Modal, Form, Select, DatePicker, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { loadTasksFromLocalStorage, saveTasksToLocalStorage } from '../utils/storage';
import moment from 'moment';

const { Title } = Typography;
const { TextArea } = Input;

const ProjectManager = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form] = Form.useForm();

  // 加载项目和任务
  useEffect(() => {
    const loadedTasks = loadTasksFromLocalStorage();
    setTasks(loadedTasks);
    
    // 从任务中提取项目信息
    const projectMap = new Map();
    loadedTasks.forEach(task => {
      if (task.projectId) {
        if (!projectMap.has(task.projectId)) {
          projectMap.set(task.projectId, {
            id: task.projectId,
            name: task.projectName || `项目 ${task.projectId}`,
            description: '',
            tasks: []
          });
        }
        projectMap.get(task.projectId).tasks.push(task);
      }
    });
    
    setProjects(Array.from(projectMap.values()));
  }, []);

  // 保存项目信息到任务中
  const saveProjectToTasks = (projectId, projectName, projectDescription) => {
    const updatedTasks = tasks.map(task => {
      if (task.projectId === projectId) {
        return {
          ...task,
          projectName: projectName
        };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    saveTasksToLocalStorage(updatedTasks);
  };

  // 创建新项目
  const createProject = (values) => {
    const newProject = {
      id: Date.now(),
      name: values.name,
      description: values.description,
      tasks: []
    };
    
    setProjects([...projects, newProject]);
    setIsModalVisible(false);
    form.resetFields();
    message.success('项目创建成功');
  };

  // 更新项目
  const updateProject = (values) => {
    const updatedProjects = projects.map(project => {
      if (project.id === editingProject.id) {
        const updatedProject = {
          ...project,
          name: values.name,
          description: values.description
        };
        
        // 保存到任务中
        saveProjectToTasks(project.id, values.name, values.description);
        
        return updatedProject;
      }
      return project;
    });
    
    setProjects(updatedProjects);
    setEditingProject(null);
    setIsModalVisible(false);
    form.resetFields();
    message.success('项目更新成功');
  };

  // 删除项目
  const deleteProject = (projectId) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除这个项目吗？项目中的任务不会被删除，但会失去项目关联。',
      onOk() {
        const updatedProjects = projects.filter(project => project.id !== projectId);
        setProjects(updatedProjects);
        
        // 移除任务中的项目关联
        const updatedTasks = tasks.map(task => {
          if (task.projectId === projectId) {
            const { projectId, projectName, ...rest } = task;
            return rest;
          }
          return task;
        });
        
        setTasks(updatedTasks);
        saveTasksToLocalStorage(updatedTasks);
        message.success('项目删除成功');
      }
    });
  };

  // 打开创建项目模态框
  const showCreateModal = () => {
    setEditingProject(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // 打开编辑项目模态框
  const showEditModal = (project) => {
    setEditingProject(project);
    form.setFieldsValue({
      name: project.name,
      description: project.description
    });
    setIsModalVisible(true);
  };

  // 处理表单提交
  const handleFormSubmit = (values) => {
    if (editingProject) {
      updateProject(values);
    } else {
      createProject(values);
    }
  };

  // 获取项目任务统计
  const getProjectStats = (project) => {
    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(task => task.completed).length;
    return { totalTasks, completedTasks };
  };

  return (
    <Card title="项目管理" style={{ margin: '20px 0' }}>
      <div style={{ marginBottom: '20px' }}>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={showCreateModal}
        >
          创建项目
        </Button>
      </div>
      
      <List
        grid={{ gutter: 16, column: 3 }}
        dataSource={projects}
        renderItem={project => {
          const stats = getProjectStats(project);
          return (
            <List.Item>
              <Card 
                title={project.name}
                extra={
                  <div>
                    <Button 
                      icon={<EditOutlined />} 
                      onClick={() => showEditModal(project)} 
                      style={{ marginRight: '8px' }}
                    />
                    <Button 
                      icon={<DeleteOutlined />} 
                      danger 
                      onClick={() => deleteProject(project.id)} 
                    />
                  </div>
                }
              >
                <p>{project.description || '暂无描述'}</p>
                <div style={{ marginTop: '10px' }}>
                  <Tag color="blue">任务: {stats.totalTasks}</Tag>
                  <Tag color="green">已完成: {stats.completedTasks}</Tag>
                  <Tag color="orange">进度: {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%</Tag>
                </div>
                <div style={{ marginTop: '10px' }}>
                  {project.tasks.slice(0, 3).map(task => (
                    <Tag 
                      key={task.id} 
                      color={task.completed ? 'green' : 'blue'}
                      style={{ marginRight: '5px', marginBottom: '5px' }}
                    >
                      {task.title}
                    </Tag>
                  ))}
                  {project.tasks.length > 3 && (
                    <Tag>... 还有 {project.tasks.length - 3} 个任务</Tag>
                  )}
                </div>
              </Card>
            </List.Item>
          );
        }}
      />
      
      <Modal
        title={editingProject ? "编辑项目" : "创建项目"}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingProject(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          onFinish={handleFormSubmit}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="项目名称"
            rules={[{ required: true, message: '请输入项目名称' }]}
          >
            <Input placeholder="请输入项目名称" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="项目描述"
          >
            <TextArea placeholder="请输入项目描述" rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ProjectManager;