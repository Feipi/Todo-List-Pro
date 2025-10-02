import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, Button, List, Typography, Input, DatePicker, Checkbox, Select, TimePicker, message, Tag, Collapse, Modal, Tabs } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined, CopyOutlined, UnorderedListOutlined, BellOutlined, ShareAltOutlined, AudioOutlined } from '@ant-design/icons';
import { saveTasksToLocalStorage, loadTasksFromLocalStorage, loadTagsFromLocalStorage } from '../utils/storage';
import moment from 'moment';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import TaskTemplates from './TaskTemplates';
import BatchOperations from './BatchOperations';
import SmartReminders from './SmartReminders';
import QuickPhrases from './QuickPhrases';
import EnhancedSearch from './EnhancedSearch';
import MobileOptimization from './MobileOptimization';
import TaskSharing from './TaskSharing';
import VoiceInput from './VoiceInput';
import TaskDependencies from './TaskDependencies';
import ProjectManager from './ProjectManager';
import TaskComments from './TaskComments';
import '../styles/TaskAnimations.css';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;
const { TabPane } = Tabs;

// 子任务组件
const SubTaskItem = ({ subTask, onToggle, onDelete, onEdit }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
      <Checkbox 
        checked={subTask.completed} 
        onChange={() => onToggle(subTask.id)} 
        style={{ marginRight: '10px' }}
      />
      <span style={{ textDecoration: subTask.completed ? 'line-through' : 'none', flex: 1 }}>
        {subTask.title}
      </span>
      <Button 
        icon={<EditOutlined />} 
        size="small" 
        onClick={() => onEdit(subTask)} 
        style={{ marginRight: '5px' }}
      />
      <Button 
        icon={<DeleteOutlined />} 
        size="small" 
        danger 
        onClick={() => onDelete(subTask.id)}
      />
    </div>
  );
};

// 拖拽任务项组件
const TaskItem = ({ task, index, moveTask, startEdit, deleteTask, toggleComplete, allTags, onDoubleClick, selected, onSelect }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'task',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    type: 'task',
    accept: 'task',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveTask(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  // 获取优先级显示颜色
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ff4d4f';
      case 'medium': return '#faad14';
      case 'low': return '#52c41a';
      default: return '#d9d9d9';
    }
  };

  // 获取标签信息
  const getTagInfo = (tagId) => {
    return allTags.find(tag => tag.id === tagId) || { name: '未知标签', color: '#d9d9d9' };
  };

  // 检查任务是否可以开始（所有依赖任务都已完成）
  const canTaskStart = (task, allTasks) => {
    if (!task.dependencies || task.dependencies.length === 0) return true;
    
    return task.dependencies.every(depId => {
      const depTask = allTasks.find(t => t.id === depId);
      return depTask && depTask.completed;
    });
  };

  // 获取评论数量
  const getCommentCount = (task) => {
    return task.comments ? task.comments.length : 0;
  };

  return (
    <div 
      ref={(node) => drag(drop(node))} 
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onDoubleClick={() => onDoubleClick(task)}
    >
      <List.Item
        actions={[
          task.subTasks && task.subTasks.length > 0 && (
            <Button icon={<UnorderedListOutlined />} onClick={() => {}}>
              子任务 ({task.subTasks.filter(st => st.completed).length}/{task.subTasks.length})
            </Button>
          ),
          task.remindTime && (
            <Button icon={<BellOutlined />} onClick={() => {}}>
              提醒 {task.remindTime}
            </Button>
          ),
          <Button icon={<ShareAltOutlined />} onClick={() => {}}>分享</Button>,
          <Button icon={<EditOutlined />} onClick={() => startEdit(task)}>编辑</Button>,
          <Button icon={<DeleteOutlined />} onClick={() => deleteTask(task.id)} danger>删除</Button>
        ]}
      >
        <>
          <Checkbox 
            checked={selected} 
            onChange={(e) => onSelect(task.id, e.target.checked)} 
            style={{ marginRight: '10px' }}
          />
          <Checkbox checked={task.completed} onChange={() => toggleComplete(task.id)} />
          <div style={{ marginLeft: '10px', textDecoration: task.completed ? 'line-through' : 'none' }}>
            <Title level={5}>
              {task.title}
              {task.priority && (
                <span style={{ 
                  color: getPriorityColor(task.priority), 
                  fontSize: '12px', 
                  marginLeft: '10px',
                  fontWeight: 'normal'
                }}>
                  {task.priority === 'high' ? '高优先级' : 
                   task.priority === 'medium' ? '中优先级' : '低优先级'}
                </span>
              )}
              {!task.completed && !canTaskStart(task, []) && (
                <Tag color="orange" style={{ marginLeft: '10px' }}>等待依赖</Tag>
              )}
              {getCommentCount(task) > 0 && (
                <Tag color="blue" style={{ marginLeft: '10px' }}>评论 ({getCommentCount(task)})</Tag>
              )}
            </Title>
            <p>{task.description}</p>
            <p>截止日期: {task.dueDate}</p>
            {task.remindTime && <p>提醒时间: {task.remindTime}</p>}
            <div>
              {task.tagIds && task.tagIds.map(tagId => {
                const tagInfo = getTagInfo(tagId);
                return (
                  <Tag color={tagInfo.color} key={tagId}>
                    {tagInfo.name}
                  </Tag>
                );
              })}
            </div>
            {/* 依赖任务显示 */}
            {task.dependencies && task.dependencies.length > 0 && (
              <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f0f5ff', borderRadius: '4px' }}>
                <div>依赖任务:</div>
                {task.dependencies.map(depId => {
                  // 这里需要获取所有任务来查找依赖任务，但在当前组件中无法获取
                  // 在实际应用中，可以通过props传递所有任务
                  return (
                    <Tag key={depId} color="blue">
                      任务 #{depId}
                    </Tag>
                  );
                })}
              </div>
            )}
            {/* 子任务显示 */}
            {task.subTasks && task.subTasks.length > 0 && (
              <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                <div>子任务:</div>
                {task.subTasks.map(subTask => (
                  <SubTaskItem 
                    key={subTask.id}
                    subTask={subTask}
                    onToggle={() => {}}
                    onDelete={() => {}}
                    onEdit={() => {}}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      </List.Item>
    </div>
  );
};

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [tags, setTags] = useState([]); // 标签列表
  const [searchText, setSearchText] = useState(''); // 搜索文本
  const [selectedTag, setSelectedTag] = useState('all'); // 选中的标签
  const [selectedTasks, setSelectedTasks] = useState([]); // 选中的任务
  const [searchCriteria, setSearchCriteria] = useState({
    text: '',
    tag: 'all',
    priority: 'all',
    status: 'all'
  });
  
  const [newTask, setNewTask] = useState({ 
    title: '', 
    description: '', 
    dueDate: null,
    priority: 'medium', // 默认中优先级
    remindTime: null, // 提醒时间
    tagIds: [], // 关联的标签ID数组
    subTasks: [], // 子任务数组
    dependencies: [], // 依赖任务ID数组
    projectId: null, // 项目ID
    comments: [] // 评论数组
  });
  const [editingTask, setEditingTask] = useState(null);
  const [subTaskModalVisible, setSubTaskModalVisible] = useState(false);
  const [currentSubTasks, setCurrentSubTasks] = useState([]);
  const [newSubTask, setNewSubTask] = useState('');
  
  // 使用useRef来存储提醒任务ID，避免循环依赖
  const remindersRef = useRef(new Set());
  
  // 输入框引用
  const titleInputRef = useRef(null);
  
  // 为每个任务创建独立的ref，避免findDOMNode问题
  const taskRefs = useRef({});

  // 组件挂载时从LocalStorage加载任务和标签
  useEffect(() => {
    const loadedTasks = loadTasksFromLocalStorage();
    setTasks(loadedTasks);
    
    // 加载标签
    const loadedTags = loadTagsFromLocalStorage();
    setTags(loadedTags);
    
    // 聚焦到标题输入框
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []);

  // 键盘快捷键处理
  useEffect(() => {
    const handleKeyDown = (e) => {
      // ESC键取消编辑
      if (e.key === 'Escape' && editingTask) {
        e.preventDefault();
        setEditingTask(null);
      }
      
      // 回车键添加任务（在输入框中有内容时）
      if (e.key === 'Enter' && !editingTask && newTask.title.trim() !== '') {
        // 检查是否是在输入框中按的回车
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
          e.preventDefault();
          addTask();
        }
      }
      
      // Ctrl+A 全选任务
      if (e.ctrlKey && e.key === 'a' && !editingTask) {
        e.preventDefault();
        setSelectedTasks(tasks.map(task => task.id));
      }
      
      // Ctrl+N 新建任务
      if (e.ctrlKey && e.key === 'n' && !editingTask) {
        e.preventDefault();
        if (titleInputRef.current) {
          titleInputRef.current.focus();
        }
      }
      
      // Ctrl+S 保存编辑
      if (e.ctrlKey && e.key === 's' && editingTask) {
        e.preventDefault();
        saveEdit();
      }
      
      // Ctrl+D 删除选中任务
      if (e.ctrlKey && e.key === 'd' && selectedTasks.length > 0 && !editingTask) {
        e.preventDefault();
        Modal.confirm({
          title: '确认删除',
          content: `确定要删除选中的 ${selectedTasks.length} 个任务吗？`,
          onOk() {
            selectedTasks.forEach(id => deleteTask(id));
            setSelectedTasks([]);
          }
        });
      }
      
      // Ctrl+E 编辑选中任务
      if (e.ctrlKey && e.key === 'e' && selectedTasks.length === 1 && !editingTask) {
        e.preventDefault();
        const taskToEdit = tasks.find(task => task.id === selectedTasks[0]);
        if (taskToEdit) {
          startEdit(taskToEdit);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [newTask, editingTask, tasks, selectedTasks]);

  // 检查提醒
  const checkReminders = useCallback((tasksList) => {
    const now = moment();
    const pendingReminders = [];
    
    tasksList.forEach(task => {
      if (!task.completed && task.remindTime && task.dueDate) {
        const remindDateTime = moment(`${task.dueDate} ${task.remindTime}`, 'YYYY-MM-DD HH:mm');
        // 检查是否已经提醒过
        if (remindDateTime.isSameOrBefore(now) && !remindersRef.current.has(task.id)) {
          pendingReminders.push(task);
        }
      }
    });
    
    // 触发提醒
    pendingReminders.forEach(task => {
      showReminder(task);
      // 添加到已提醒集合
      remindersRef.current.add(task.id);
    });
  }, []);

  // 任务数据变化时保存到LocalStorage
  useEffect(() => {
    saveTasksToLocalStorage(tasks);
  }, [tasks]);

  // 检查提醒的副作用
  useEffect(() => {
    if (tasks.length > 0) {
      checkReminders(tasks);
    }
  }, [tasks, checkReminders]);

  // 过滤任务
  const filteredTasks = tasks.filter(task => {
    // 搜索过滤
    const matchesSearch = searchCriteria.text === '' || 
                          task.title.toLowerCase().includes(searchCriteria.text.toLowerCase()) || 
                          task.description.toLowerCase().includes(searchCriteria.text.toLowerCase());
    
    // 标签过滤
    const matchesTag = searchCriteria.tag === 'all' || 
                       (task.tagIds && task.tagIds.includes(Number(searchCriteria.tag)));
    
    // 优先级过滤
    const matchesPriority = searchCriteria.priority === 'all' || 
                            task.priority === searchCriteria.priority;
    
    // 状态过滤
    const matchesStatus = searchCriteria.status === 'all' || 
                          (searchCriteria.status === 'completed' && task.completed) || 
                          (searchCriteria.status === 'pending' && !task.completed);
    
    return matchesSearch && matchesTag && matchesPriority && matchesStatus;
  });

  // 显示提醒
  const showReminder = (task) => {
    // 浏览器通知
    if (Notification.permission === 'granted') {
      new Notification('任务提醒', {
        body: `任务 "${task.title}" 已到提醒时间`,
        icon: '/favicon.ico'
      });
    }
    
    // 页面内提醒
    message.info({
      content: `任务 "${task.title}" 已到提醒时间`,
      duration: 10
    });
  };

  // 请求通知权限
  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          message.success('通知权限已获取');
        }
      });
    }
  };

  const addTask = () => {
    if (newTask.title.trim() !== '') {
      const task = {
        id: Date.now(),
        title: newTask.title,
        description: newTask.description,
        completed: false,
        dueDate: newTask.dueDate ? newTask.dueDate.format('YYYY-MM-DD') : '',
        priority: newTask.priority,
        remindTime: newTask.remindTime ? newTask.remindTime.format('HH:mm') : '',
        tagIds: newTask.tagIds,
        subTasks: newTask.subTasks,
        dependencies: newTask.dependencies || [],
        projectId: newTask.projectId,
        comments: newTask.comments || []
      };
      setTasks([...tasks, task]);
      setNewTask({ 
        title: '', 
        description: '', 
        dueDate: null,
        priority: 'medium',
        remindTime: null,
        tagIds: [],
        subTasks: [],
        dependencies: [],
        projectId: null,
        comments: []
      });
      
      // 重新聚焦到标题输入框
      if (titleInputRef.current) {
        titleInputRef.current.focus();
      }
    }
  };

  // 应用模板
  const handleApplyTemplate = (templateData) => {
    setNewTask({
      ...newTask,
      ...templateData
    });
    
    // 聚焦到标题输入框
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  };

  // 应用快速短语
  const handleApplyPhrase = (phraseText) => {
    setNewTask({
      ...newTask,
      description: phraseText
    });
  };

  // 应用语音输入
  const handleVoiceInput = (transcript) => {
    setNewTask({
      ...newTask,
      title: transcript
    });
  };

  // 应用语音输入到描述
  const handleVoiceInputDescription = (transcript) => {
    setNewTask({
      ...newTask,
      description: transcript
    });
  };

  // 处理搜索
  const handleSearch = (criteria) => {
    setSearchCriteria(criteria);
  };

  // 处理过滤器应用
  const handleFilter = (criteria) => {
    setSearchCriteria(criteria);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
    // 从提醒集合中移除
    remindersRef.current.delete(id);
    // 从选中任务中移除
    setSelectedTasks(selectedTasks.filter(taskId => taskId !== id));
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const startEdit = (task) => {
    setEditingTask({
      ...task,
      dueDate: task.dueDate ? moment(task.dueDate) : null,
      remindTime: task.remindTime ? moment(task.remindTime, 'HH:mm') : null
    });
    setCurrentSubTasks(task.subTasks || []);
  };

  const saveEdit = () => {
    setTasks(tasks.map(task => 
      task.id === editingTask.id ? {
        ...editingTask,
        dueDate: editingTask.dueDate ? editingTask.dueDate.format('YYYY-MM-DD') : '',
        remindTime: editingTask.remindTime ? editingTask.remindTime.format('HH:mm') : '',
        subTasks: currentSubTasks,
        dependencies: editingTask.dependencies || [],
        comments: editingTask.comments || []
      } : task
    ));
    setEditingTask(null);
    setCurrentSubTasks([]);
  };

  // 双击任务直接进入编辑状态
  const handleTaskDoubleClick = (task) => {
    startEdit(task);
  };

  // 移动任务位置
  const moveTask = (fromIndex, toIndex) => {
    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(fromIndex, 1);
    updatedTasks.splice(toIndex, 0, movedTask);
    setTasks(updatedTasks);
  };

  // 选择任务
  const handleTaskSelect = (taskId, selected) => {
    if (selected) {
      setSelectedTasks([...selectedTasks, taskId]);
    } else {
      setSelectedTasks(selectedTasks.filter(id => id !== taskId));
    }
  };

  // 全选/取消全选
  const toggleSelectAll = (checked) => {
    if (checked) {
      setSelectedTasks(filteredTasks.map(task => task.id));
    } else {
      setSelectedTasks([]);
    }
  };

  // 添加子任务
  const addSubTask = () => {
    if (newSubTask.trim() !== '') {
      const subTask = {
        id: Date.now(),
        title: newSubTask,
        completed: false
      };
      setCurrentSubTasks([...currentSubTasks, subTask]);
      setNewSubTask('');
    }
  };

  // 删除子任务
  const deleteSubTask = (id) => {
    setCurrentSubTasks(currentSubTasks.filter(subTask => subTask.id !== id));
  };

  // 切换子任务完成状态
  const toggleSubTaskComplete = (id) => {
    setCurrentSubTasks(currentSubTasks.map(subTask => 
      subTask.id === id ? { ...subTask, completed: !subTask.completed } : subTask
    ));
  };

  // 编辑子任务
  const editSubTask = (subTask) => {
    const newTitle = prompt('编辑子任务:', subTask.title);
    if (newTitle !== null) {
      setCurrentSubTasks(currentSubTasks.map(st => 
        st.id === subTask.id ? { ...st, title: newTitle } : st
      ));
    }
  };

  // 组件挂载时请求通知权限
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <Card title="任务管理" style={{ margin: '20px 0' }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="桌面版" key="1">
            {/* 增强搜索区域 */}
            <EnhancedSearch 
              tasks={tasks}
              tags={tags}
              onSearch={handleSearch}
              onFilter={handleFilter}
            />
            
            {/* 批量操作区域 */}
            <div style={{ marginBottom: '20px' }}>
              <Checkbox 
                onChange={(e) => toggleSelectAll(e.target.checked)}
                checked={selectedTasks.length === filteredTasks.length && filteredTasks.length > 0}
                style={{ marginRight: '10px' }}
              >
                全选
              </Checkbox>
              <BatchOperations 
                selectedTasks={selectedTasks} 
                tasks={tasks} 
                setTasks={setTasks} 
                tags={tags} 
              />
            </div>
            
            {/* 添加任务区域 */}
            <Collapse style={{ marginBottom: '20px' }}>
              <Panel header="任务模板" key="1">
                <TaskTemplates onApplyTemplate={handleApplyTemplate} />
              </Panel>
              <Panel header="智能提醒" key="2">
                <SmartReminders />
              </Panel>
              <Panel header="快速短语" key="3">
                <QuickPhrases onApplyPhrase={handleApplyPhrase} />
              </Panel>
              <Panel header="任务分享" key="4">
                <TaskSharing />
              </Panel>
              <Panel header="任务依赖" key="5">
                <TaskDependencies />
              </Panel>
              <Panel header="项目管理" key="6">
                <ProjectManager />
              </Panel>
            </Collapse>
            
            <div style={{ marginBottom: '20px' }}>
              <Input 
                ref={titleInputRef}
                placeholder="任务标题" 
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                style={{ width: '200px', marginRight: '10px' }}
                suffix={<VoiceInput onTranscript={handleVoiceInput} />}
              />
              <DatePicker 
                placeholder="截止日期"
                onChange={(date) => setNewTask({...newTask, dueDate: date})}
                style={{ marginRight: '10px' }}
              />
              <Select
                value={newTask.priority}
                onChange={(value) => setNewTask({...newTask, priority: value})}
                style={{ width: '100px', marginRight: '10px' }}
              >
                <Option value="high">高</Option>
                <Option value="medium">中</Option>
                <Option value="low">低</Option>
              </Select>
              <TimePicker
                placeholder="提醒时间"
                onChange={(time) => setNewTask({...newTask, remindTime: time})}
                style={{ marginRight: '10px' }}
              />
              <br /><br />
              <Select
                mode="multiple"
                placeholder="选择标签"
                value={newTask.tagIds}
                onChange={(value) => setNewTask({...newTask, tagIds: value})}
                style={{ width: '300px', marginRight: '10px' }}
              >
                {tags.map(tag => (
                  <Option key={tag.id} value={tag.id}>
                    <Tag color={tag.color}>{tag.name}</Tag>
                  </Option>
                ))}
              </Select>
              <Button type="primary" icon={<PlusOutlined />} onClick={addTask}>
                添加 (Enter)
              </Button>
            </div>
            
            <TextArea 
              placeholder="任务描述"
              value={newTask.description}
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              rows={2}
              style={{ width: '500px', marginBottom: '20px' }}
              suffix={<VoiceInput onTranscript={handleVoiceInputDescription} />}
            />
            
            {/* 子任务区域 */}
            <div style={{ marginBottom: '20px' }}>
              <h4>子任务</h4>
              <div style={{ display: 'flex', marginBottom: '10px' }}>
                <Input 
                  placeholder="添加子任务" 
                  value={newSubTask}
                  onChange={(e) => setNewSubTask(e.target.value)}
                  style={{ flex: 1, marginRight: '10px' }}
                  onPressEnter={addSubTask}
                />
                <Button onClick={addSubTask}>添加</Button>
              </div>
              {newTask.subTasks && newTask.subTasks.map(subTask => (
                <div key={subTask.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                  <Checkbox 
                    checked={subTask.completed} 
                    onChange={() => {
                      const updatedSubTasks = newTask.subTasks.map(st => 
                        st.id === subTask.id ? { ...st, completed: !st.completed } : st
                      );
                      setNewTask({ ...newTask, subTasks: updatedSubTasks });
                    }} 
                    style={{ marginRight: '10px' }}
                  />
                  <span style={{ textDecoration: subTask.completed ? 'line-through' : 'none', flex: 1 }}>
                    {subTask.title}
                  </span>
                  <Button 
                    icon={<EditOutlined />} 
                    size="small" 
                    onClick={() => {
                      const newTitle = prompt('编辑子任务:', subTask.title);
                      if (newTitle !== null) {
                        const updatedSubTasks = newTask.subTasks.map(st => 
                          st.id === subTask.id ? { ...st, title: newTitle } : st
                        );
                        setNewTask({ ...newTask, subTasks: updatedSubTasks });
                      }
                    }} 
                    style={{ marginRight: '5px' }}
                  />
                  <Button 
                    icon={<DeleteOutlined />} 
                    size="small" 
                    danger 
                    onClick={() => {
                      const updatedSubTasks = newTask.subTasks.filter(st => st.id !== subTask.id);
                      setNewTask({ ...newTask, subTasks: updatedSubTasks });
                    }}
                  />
                </div>
              ))}
            </div>
            
            {/* 任务列表 */}
            <TransitionGroup>
              {filteredTasks.map((task, index) => {
                // 确保每个任务都有对应的ref
                if (!taskRefs.current[task.id]) {
                  taskRefs.current[task.id] = React.createRef();
                }
                
                return (
                  <CSSTransition
                    key={task.id}
                    timeout={300}
                    classNames="list-item"
                    nodeRef={taskRefs.current[task.id]}
                  >
                    <div ref={taskRefs.current[task.id]}>
                      {editingTask && editingTask.id === task.id ? (
                        <List.Item
                          actions={[
                            <Button icon={<EditOutlined />} onClick={saveEdit}>保存 (Ctrl+S)</Button>,
                            <Button onClick={() => {
                              setEditingTask(null);
                              setCurrentSubTasks([]);
                            }}>取消 (ESC)</Button>
                          ]}
                        >
                          <div style={{ width: '100%' }}>
                            <Input 
                              value={editingTask.title}
                              onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                              style={{ width: '200px', marginRight: '10px' }}
                              onPressEnter={saveEdit}
                            />
                            <DatePicker 
                              value={editingTask.dueDate}
                              onChange={(date) => setEditingTask({...editingTask, dueDate: date})}
                              style={{ marginRight: '10px' }}
                            />
                            <Select
                              value={editingTask.priority}
                              onChange={(value) => setEditingTask({...editingTask, priority: value})}
                              style={{ width: '100px', marginRight: '10px' }}
                            >
                              <Option value="high">高</Option>
                              <Option value="medium">中</Option>
                              <Option value="low">低</Option>
                            </Select>
                            <TimePicker
                              value={editingTask.remindTime}
                              onChange={(time) => setEditingTask({...editingTask, remindTime: time})}
                              style={{ marginRight: '10px' }}
                            />
                            <br /><br />
                            <Select
                              mode="multiple"
                              placeholder="选择标签"
                              value={editingTask.tagIds}
                              onChange={(value) => setEditingTask({...editingTask, tagIds: value})}
                              style={{ width: '300px', marginRight: '10px' }}
                            >
                              {tags.map(tag => (
                                <Option key={tag.id} value={tag.id}>
                                  <Tag color={tag.color}>{tag.name}</Tag>
                                </Option>
                              ))}
                            </Select>
                            <br /><br />
                            
                            {/* 编辑子任务 */}
                            <div style={{ marginBottom: '20px' }}>
                              <h4>子任务</h4>
                              <div style={{ display: 'flex', marginBottom: '10px' }}>
                                <Input 
                                  placeholder="添加子任务" 
                                  value={newSubTask}
                                  onChange={(e) => setNewSubTask(e.target.value)}
                                  style={{ flex: 1, marginRight: '10px' }}
                                  onPressEnter={addSubTask}
                                />
                                <Button onClick={addSubTask}>添加</Button>
                              </div>
                              {currentSubTasks.map(subTask => (
                                <div key={subTask.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                                  <Checkbox 
                                    checked={subTask.completed} 
                                    onChange={() => toggleSubTaskComplete(subTask.id)} 
                                    style={{ marginRight: '10px' }}
                                  />
                                  <span style={{ textDecoration: subTask.completed ? 'line-through' : 'none', flex: 1 }}>
                                    {subTask.title}
                                  </span>
                                  <Button 
                                    icon={<EditOutlined />} 
                                    size="small" 
                                    onClick={() => editSubTask(subTask)} 
                                    style={{ marginRight: '5px' }}
                                  />
                                  <Button 
                                    icon={<DeleteOutlined />} 
                                    size="small" 
                                    danger 
                                    onClick={() => deleteSubTask(subTask.id)}
                                  />
                                </div>
                              ))}
                            </div>
                            
                            {/* 评论区域 */}
                            <div style={{ marginBottom: '20px' }}>
                              <h4>任务评论</h4>
                              <TaskComments 
                                taskId={editingTask.id}
                                comments={editingTask.comments || []}
                                onAddComment={(comment) => {
                                  const updatedComments = editingTask.comments 
                                    ? [...editingTask.comments, comment] 
                                    : [comment];
                                  setEditingTask({ ...editingTask, comments: updatedComments });
                                }}
                              />
                            </div>
                            
                            <Button type="primary" onClick={saveEdit}>保存 (Ctrl+S)</Button>
                            <Button onClick={() => {
                              setEditingTask(null);
                              setCurrentSubTasks([]);
                            }} style={{ marginLeft: '10px' }}>取消 (ESC)</Button>
                            <TextArea 
                              value={editingTask.description}
                              onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                              rows={2}
                              style={{ width: '500px', marginTop: '10px' }}
                              onPressEnter={saveEdit}
                            />
                          </div>
                        </List.Item>
                      ) : (
                        <CSSTransition
                          key={task.id}
                          timeout={300}
                          classNames="task-add"
                          nodeRef={taskRefs.current[task.id]}
                        >
                          <div ref={taskRefs.current[task.id]}>
                            <TaskItem 
                              task={task}
                              index={index}
                              moveTask={moveTask}
                              startEdit={startEdit}
                              deleteTask={deleteTask}
                              toggleComplete={toggleComplete}
                              allTags={tags}
                              onDoubleClick={handleTaskDoubleClick}
                              selected={selectedTasks.includes(task.id)}
                              onSelect={handleTaskSelect}
                            />
                          </div>
                        </CSSTransition>
                      )}
                    </div>
                  </CSSTransition>
                );
              })}
            </TransitionGroup>
          </TabPane>
          
          <TabPane tab="移动版" key="2">
            <MobileOptimization />
          </TabPane>
        </Tabs>
      </Card>
    </DndProvider>
  );
};

export default TaskManager;