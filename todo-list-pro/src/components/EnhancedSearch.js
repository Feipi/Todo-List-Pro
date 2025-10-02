import React, { useState } from 'react';
import { Input, Select, Tag, Button, List, Card } from 'antd';
import { SearchOutlined, SaveOutlined, FilterOutlined } from '@ant-design/icons';
import { loadSavedFiltersFromLocalStorage, saveSavedFiltersToLocalStorage } from '../utils/storage';

const { Option } = Select;

const EnhancedSearch = ({ tasks, tags, onSearch, onFilter }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [priority, setPriority] = useState('all');
  const [status, setStatus] = useState('all');
  const [savedFilters, setSavedFilters] = useState(loadSavedFiltersFromLocalStorage() || []);
  const [filterName, setFilterName] = useState('');

  // 执行搜索
  const handleSearch = () => {
    const searchCriteria = {
      text: searchText,
      tag: selectedTag,
      priority,
      status
    };
    onSearch(searchCriteria);
  };

  // 保存当前过滤器
  const saveCurrentFilter = () => {
    if (filterName.trim() !== '') {
      const filter = {
        id: Date.now(),
        name: filterName,
        criteria: {
          text: searchText,
          tag: selectedTag,
          priority,
          status
        }
      };
      const updatedFilters = [...savedFilters, filter];
      setSavedFilters(updatedFilters);
      saveSavedFiltersToLocalStorage(updatedFilters);
      setFilterName('');
    }
  };

  // 应用保存的过滤器
  const applySavedFilter = (filter) => {
    const { text, tag, priority, status } = filter.criteria;
    setSearchText(text || '');
    setSelectedTag(tag || 'all');
    setPriority(priority || 'all');
    setStatus(status || 'all');
    
    onFilter(filter.criteria);
  };

  // 删除保存的过滤器
  const deleteSavedFilter = (id) => {
    const updatedFilters = savedFilters.filter(f => f.id !== id);
    setSavedFilters(updatedFilters);
    saveSavedFiltersToLocalStorage(updatedFilters);
  };

  return (
    <Card title="增强搜索" size="small" style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
        <Input
          placeholder="搜索任务..."
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onPressEnter={handleSearch}
          style={{ flex: 1, minWidth: '200px' }}
        />
        <Select
          value={selectedTag}
          onChange={setSelectedTag}
          style={{ width: '120px' }}
        >
          <Option value="all">所有标签</Option>
          {tags.map(tag => (
            <Option key={tag.id} value={String(tag.id)}>
              <Tag color={tag.color}>{tag.name}</Tag>
            </Option>
          ))}
        </Select>
        <Select
          value={priority}
          onChange={setPriority}
          style={{ width: '100px' }}
        >
          <Option value="all">所有优先级</Option>
          <Option value="high">高优先级</Option>
          <Option value="medium">中优先级</Option>
          <Option value="low">低优先级</Option>
        </Select>
        <Select
          value={status}
          onChange={setStatus}
          style={{ width: '100px' }}
        >
          <Option value="all">所有状态</Option>
          <Option value="completed">已完成</Option>
          <Option value="pending">未完成</Option>
        </Select>
        <Button type="primary" onClick={handleSearch}>
          搜索
        </Button>
      </div>
      
      {/* 保存过滤器 */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <Input
          placeholder="过滤器名称"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          style={{ flex: 1 }}
        />
        <Button 
          icon={<SaveOutlined />} 
          onClick={saveCurrentFilter}
          disabled={filterName.trim() === ''}
        >
          保存过滤器
        </Button>
      </div>
      
      {/* 已保存的过滤器 */}
      {savedFilters.length > 0 && (
        <div>
          <div style={{ marginBottom: '5px' }}>
            <FilterOutlined /> 已保存的过滤器:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {savedFilters.map(filter => (
              <div key={filter.id} style={{ display: 'flex', alignItems: 'center' }}>
                <Button 
                  size="small" 
                  onClick={() => applySavedFilter(filter)}
                  style={{ marginRight: '5px' }}
                >
                  {filter.name}
                </Button>
                <Button 
                  size="small" 
                  danger 
                  onClick={() => deleteSavedFilter(filter.id)}
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default EnhancedSearch;