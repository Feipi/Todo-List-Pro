// hooks/useTaskPerformance.js
import { useState, useMemo, useCallback } from 'react';
import useTodoStore from '../store/todoStore';

// 性能优化Hook，用于处理大型任务列表
const useTaskPerformance = () => {
  const tasks = useTodoStore(state => state.tasks);
  const tags = useTodoStore(state => state.tags);

  // 计算任务统计信息（使用useMemo缓存结果）
  const taskStatistics = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    
    // 按优先级分组
    const byPriority = {
      high: tasks.filter(task => task.priority === 'high').length,
      medium: tasks.filter(task => task.priority === 'medium').length,
      low: tasks.filter(task => task.priority === 'low').length
    };
    
    // 按标签分组
    const byTag = tags.map(tag => ({
      tag: tag,
      count: tasks.filter(task => task.tagIds && task.tagIds.includes(tag.id)).length
    }));
    
    return {
      total,
      completed,
      pending,
      byPriority,
      byTag
    };
  }, [tasks, tags]);

  // 虚拟滚动支持 - 分页处理大型列表
  const useVirtualPagination = (items, itemsPerPage = 20) => {
    const [currentPage, setCurrentPage] = useState(1);
    
    const paginatedItems = useMemo(() => {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return items.slice(startIndex, endIndex);
    }, [items, currentPage, itemsPerPage]);
    
    const totalPages = Math.ceil(items.length / itemsPerPage);
    
    const goToPage = useCallback((page) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    }, [totalPages]);
    
    return {
      items: paginatedItems,
      currentPage,
      totalPages,
      goToPage,
      hasNext: currentPage < totalPages,
      hasPrev: currentPage > 1
    };
  };

  // 任务搜索和过滤优化
  const useTaskFilter = (initialFilters = {}) => {
    const [filters, setFilters] = useState({
      text: '',
      tag: 'all',
      priority: 'all',
      status: 'all',
      ...initialFilters
    });
    
    // 使用useMemo优化过滤操作
    const filteredTasks = useMemo(() => {
      return tasks.filter(task => {
        // 文本搜索
        const matchesText = filters.text === '' || 
                           task.title.toLowerCase().includes(filters.text.toLowerCase()) || 
                           task.description.toLowerCase().includes(filters.text.toLowerCase());
        
        // 标签过滤
        const matchesTag = filters.tag === 'all' || 
                          (task.tagIds && task.tagIds.includes(Number(filters.tag)));
        
        // 优先级过滤
        const matchesPriority = filters.priority === 'all' || 
                               task.priority === filters.priority;
        
        // 状态过滤
        const matchesStatus = filters.status === 'all' || 
                             (filters.status === 'completed' && task.completed) || 
                             (filters.status === 'pending' && !task.completed);
        
        return matchesText && matchesTag && matchesPriority && matchesStatus;
      });
    }, [tasks, filters]);
    
    const updateFilters = useCallback((newFilters) => {
      setFilters(prev => ({ ...prev, ...newFilters }));
    }, []);
    
    return {
      filteredTasks,
      filters,
      updateFilters
    };
  };

  // 任务批处理优化
  const useBatchOperations = () => {
    const [selectedTaskIds, setSelectedTaskIds] = useState([]);
    const updateTasks = useTodoStore(state => state.batchUpdateTasks);
    const deleteTasks = useTodoStore(state => state.deleteTask);
    
    // 选择/取消选择任务
    const toggleTaskSelection = useCallback((taskId) => {
      setSelectedTaskIds(prev => 
        prev.includes(taskId) 
          ? prev.filter(id => id !== taskId) 
          : [...prev, taskId]
      );
    }, []);
    
    // 全选/取消全选
    const toggleSelectAll = useCallback((selectAll, taskIds) => {
      setSelectedTaskIds(selectAll ? [...taskIds] : []);
    }, []);
    
    // 批量更新任务
    const batchUpdate = useCallback((updates) => {
      if (selectedTaskIds.length > 0) {
        updateTasks(selectedTaskIds, updates);
      }
    }, [selectedTaskIds, updateTasks]);
    
    // 批量删除任务
    const batchDelete = useCallback(() => {
      if (selectedTaskIds.length > 0) {
        // 注意：这里需要循环删除，因为store中的deleteTask只接受单个ID
        selectedTaskIds.forEach(id => deleteTasks(id));
        setSelectedTaskIds([]);
      }
    }, [selectedTaskIds, deleteTasks]);
    
    return {
      selectedTaskIds,
      toggleTaskSelection,
      toggleSelectAll,
      batchUpdate,
      batchDelete
    };
  };

  return {
    taskStatistics,
    useVirtualPagination,
    useTaskFilter,
    useBatchOperations
  };
};

export default useTaskPerformance;