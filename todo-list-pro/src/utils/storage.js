/**
 * LocalStorage存储工具类
 */

/**
 * 保存任务数据到LocalStorage
 * @param {Array} tasks 任务数组
 */
export const saveTasksToLocalStorage = (tasks) => {
  try {
    localStorage.setItem('todoListPro_tasks', JSON.stringify(tasks));
  } catch (error) {
    console.error('保存任务到LocalStorage失败:', error);
  }
};

/**
 * 从LocalStorage获取任务数据
 * @returns {Array} 任务数组
 */
export const loadTasksFromLocalStorage = () => {
  try {
    const tasks = localStorage.getItem('todoListPro_tasks');
    return tasks ? JSON.parse(tasks) : [];
  } catch (error) {
    console.error('从LocalStorage加载任务失败:', error);
    return [];
  }
};

/**
 * 保存标签数据到LocalStorage
 * @param {Array} tags 标签数组
 */
export const saveTagsToLocalStorage = (tags) => {
  try {
    localStorage.setItem('todoListPro_tags', JSON.stringify(tags));
  } catch (error) {
    console.error('保存标签到LocalStorage失败:', error);
  }
};

/**
 * 从LocalStorage获取标签数据
 * @returns {Array} 标签数组
 */
export const loadTagsFromLocalStorage = () => {
  try {
    const tags = localStorage.getItem('todoListPro_tags');
    return tags ? JSON.parse(tags) : [];
  } catch (error) {
    console.error('从LocalStorage加载标签失败:', error);
    return [];
  }
};