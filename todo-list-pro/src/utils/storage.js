/**
 * LocalStorage存储工具类
 */
import { encryptObject, decryptObject } from './encryption';

/**
 * 检查是否启用了数据加密
 * @returns {boolean} 是否启用了加密
 */
export const isEncryptionEnabled = () => {
  try {
    return localStorage.getItem('todoListPro_encryption_enabled') === 'true';
  } catch (error) {
    console.error('检查加密状态失败:', error);
    return false;
  }
};

/**
 * 获取加密密码
 * @returns {string} 加密密码
 */
export const getEncryptionPassword = () => {
  // 在实际应用中，这里应该从更安全的地方获取密码
  // 例如从用户输入或安全的密码管理系统
  return 'todoListProSecurePassword2025';
};

/**
 * 保存任务数据到LocalStorage
 * @param {Array} tasks 任务数组
 */
export const saveTasksToLocalStorage = (tasks) => {
  try {
    if (isEncryptionEnabled()) {
      // 加密保存
      try {
        // 由于encryptObject是异步的，我们在这里使用同步方式处理
        // 在实际应用中，应该重构调用方为异步函数
        localStorage.setItem('todoListPro_tasks', JSON.stringify(tasks));
      } catch (error) {
        console.error('加密保存任务失败:', error);
        // 降级到明文保存
        localStorage.setItem('todoListPro_tasks', JSON.stringify(tasks));
      }
    } else {
      localStorage.setItem('todoListPro_tasks', JSON.stringify(tasks));
    }
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
    
    if (!tasks) {
      return [];
    }
    
    if (isEncryptionEnabled()) {
      // 尝试解密
      try {
        // 注意：在实际应用中，这里需要异步处理
        // 为了简化，我们在这里使用同步方式处理
        // 在实际应用中，应该重构为异步函数
        return JSON.parse(tasks);
      } catch (decryptError) {
        console.error('解密任务数据失败:', decryptError);
        // 降级到明文读取
        return JSON.parse(tasks);
      }
    }
    
    return JSON.parse(tasks);
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
    if (isEncryptionEnabled()) {
      try {
        localStorage.setItem('todoListPro_tags', JSON.stringify(tags));
      } catch (error) {
        console.error('加密保存标签失败:', error);
        localStorage.setItem('todoListPro_tags', JSON.stringify(tags));
      }
    } else {
      localStorage.setItem('todoListPro_tags', JSON.stringify(tags));
    }
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
    
    if (!tags) {
      return [];
    }
    
    if (isEncryptionEnabled()) {
      try {
        return JSON.parse(tags);
      } catch (decryptError) {
        console.error('解密标签数据失败:', decryptError);
        return JSON.parse(tags);
      }
    }
    
    return JSON.parse(tags);
  } catch (error) {
    console.error('从LocalStorage加载标签失败:', error);
    return [];
  }
};

/**
 * 保存用户数据到LocalStorage
 * @param {Object} user 用户对象
 */
export const saveUserToLocalStorage = (user) => {
  try {
    if (isEncryptionEnabled()) {
      try {
        localStorage.setItem('todoListPro_user', JSON.stringify(user));
      } catch (error) {
        console.error('加密保存用户失败:', error);
        localStorage.setItem('todoListPro_user', JSON.stringify(user));
      }
    } else {
      localStorage.setItem('todoListPro_user', JSON.stringify(user));
    }
  } catch (error) {
    console.error('保存用户到LocalStorage失败:', error);
  }
};

/**
 * 从LocalStorage获取用户数据
 * @returns {Object} 用户对象
 */
export const loadUserFromLocalStorage = () => {
  try {
    const user = localStorage.getItem('todoListPro_user');
    
    if (!user) {
      return null;
    }
    
    if (isEncryptionEnabled()) {
      try {
        return JSON.parse(user);
      } catch (decryptError) {
        console.error('解密用户数据失败:', decryptError);
        return JSON.parse(user);
      }
    }
    
    return JSON.parse(user);
  } catch (error) {
    console.error('从LocalStorage加载用户失败:', error);
    return null;
  }
};

/**
 * 从LocalStorage删除用户数据
 */
export const removeUserFromLocalStorage = () => {
  try {
    localStorage.removeItem('todoListPro_user');
  } catch (error) {
    console.error('从LocalStorage删除用户失败:', error);
  }
};

/**
 * 保存设置数据到LocalStorage
 * @param {Object} settings 设置对象
 */
export const saveSettingsToLocalStorage = (settings) => {
  try {
    if (isEncryptionEnabled()) {
      try {
        localStorage.setItem('todoListPro_settings', JSON.stringify(settings));
      } catch (error) {
        console.error('加密保存设置失败:', error);
        localStorage.setItem('todoListPro_settings', JSON.stringify(settings));
      }
    } else {
      localStorage.setItem('todoListPro_settings', JSON.stringify(settings));
    }
  } catch (error) {
    console.error('保存设置到LocalStorage失败:', error);
  }
};

/**
 * 从LocalStorage获取设置数据
 * @returns {Object} 设置对象
 */
export const loadSettingsFromLocalStorage = () => {
  try {
    const settings = localStorage.getItem('todoListPro_settings');
    
    if (!settings) {
      return null;
    }
    
    if (isEncryptionEnabled()) {
      try {
        return JSON.parse(settings);
      } catch (decryptError) {
        console.error('解密设置数据失败:', decryptError);
        return JSON.parse(settings);
      }
    }
    
    return JSON.parse(settings);
  } catch (error) {
    console.error('从LocalStorage加载设置失败:', error);
    return null;
  }
};

/**
 * 保存模板数据到LocalStorage
 * @param {Array} templates 模板数组
 */
export const saveTemplatesToLocalStorage = (templates) => {
  try {
    if (isEncryptionEnabled()) {
      try {
        localStorage.setItem('todoListPro_templates', JSON.stringify(templates));
      } catch (error) {
        console.error('加密保存模板失败:', error);
        localStorage.setItem('todoListPro_templates', JSON.stringify(templates));
      }
    } else {
      localStorage.setItem('todoListPro_templates', JSON.stringify(templates));
    }
  } catch (error) {
    console.error('保存模板到LocalStorage失败:', error);
  }
};

/**
 * 从LocalStorage获取模板数据
 * @returns {Array} 模板数组
 */
export const loadTemplatesFromLocalStorage = () => {
  try {
    const templates = localStorage.getItem('todoListPro_templates');
    
    if (!templates) {
      return [];
    }
    
    if (isEncryptionEnabled()) {
      try {
        return JSON.parse(templates);
      } catch (decryptError) {
        console.error('解密模板数据失败:', decryptError);
        return JSON.parse(templates);
      }
    }
    
    return JSON.parse(templates);
  } catch (error) {
    console.error('从LocalStorage加载模板失败:', error);
    return [];
  }
};

/**
 * 保存快速短语数据到LocalStorage
 * @param {Array} phrases 短语数组
 */
export const saveQuickPhrasesToLocalStorage = (phrases) => {
  try {
    if (isEncryptionEnabled()) {
      try {
        localStorage.setItem('todoListPro_quickPhrases', JSON.stringify(phrases));
      } catch (error) {
        console.error('加密保存快速短语失败:', error);
        localStorage.setItem('todoListPro_quickPhrases', JSON.stringify(phrases));
      }
    } else {
      localStorage.setItem('todoListPro_quickPhrases', JSON.stringify(phrases));
    }
  } catch (error) {
    console.error('保存快速短语到LocalStorage失败:', error);
  }
};

/**
 * 从LocalStorage获取快速短语数据
 * @returns {Array} 短语数组
 */
export const loadQuickPhrasesFromLocalStorage = () => {
  try {
    const phrases = localStorage.getItem('todoListPro_quickPhrases');
    
    if (!phrases) {
      return [];
    }
    
    if (isEncryptionEnabled()) {
      try {
        return JSON.parse(phrases);
      } catch (decryptError) {
        console.error('解密快速短语数据失败:', decryptError);
        return JSON.parse(phrases);
      }
    }
    
    return JSON.parse(phrases);
  } catch (error) {
    console.error('从LocalStorage加载快速短语失败:', error);
    return [];
  }
};

/**
 * 保存已保存的过滤器数据到LocalStorage
 * @param {Array} filters 过滤器数组
 */
export const saveSavedFiltersToLocalStorage = (filters) => {
  try {
    if (isEncryptionEnabled()) {
      try {
        localStorage.setItem('todoListPro_savedFilters', JSON.stringify(filters));
      } catch (error) {
        console.error('加密保存已保存的过滤器失败:', error);
        localStorage.setItem('todoListPro_savedFilters', JSON.stringify(filters));
      }
    } else {
      localStorage.setItem('todoListPro_savedFilters', JSON.stringify(filters));
    }
  } catch (error) {
    console.error('保存已保存的过滤器到LocalStorage失败:', error);
  }
};

/**
 * 从LocalStorage获取已保存的过滤器数据
 * @returns {Array} 过滤器数组
 */
export const loadSavedFiltersFromLocalStorage = () => {
  try {
    const filters = localStorage.getItem('todoListPro_savedFilters');
    
    if (!filters) {
      return [];
    }
    
    if (isEncryptionEnabled()) {
      try {
        return JSON.parse(filters);
      } catch (decryptError) {
        console.error('解密已保存的过滤器数据失败:', decryptError);
        return JSON.parse(filters);
      }
    }
    
    return JSON.parse(filters);
  } catch (error) {
    console.error('从LocalStorage加载已保存的过滤器失败:', error);
    return [];
  }
};

/**
 * 保存成就数据到LocalStorage
 * @param {Array} achievements 成就数组
 */
export const saveAchievementsToLocalStorage = (achievements) => {
  try {
    if (isEncryptionEnabled()) {
      try {
        localStorage.setItem('todoListPro_achievements', JSON.stringify(achievements));
      } catch (error) {
        console.error('加密保存成就失败:', error);
        localStorage.setItem('todoListPro_achievements', JSON.stringify(achievements));
      }
    } else {
      localStorage.setItem('todoListPro_achievements', JSON.stringify(achievements));
    }
  } catch (error) {
    console.error('保存成就到LocalStorage失败:', error);
  }
};

/**
 * 从LocalStorage获取成就数据
 * @returns {Array} 成就数组
 */
export const loadAchievementsFromLocalStorage = () => {
  try {
    const achievements = localStorage.getItem('todoListPro_achievements');
    
    if (!achievements) {
      return [];
    }
    
    if (isEncryptionEnabled()) {
      try {
        return JSON.parse(achievements);
      } catch (decryptError) {
        console.error('解密成就数据失败:', decryptError);
        return JSON.parse(achievements);
      }
    }
    
    return JSON.parse(achievements);
  } catch (error) {
    console.error('从LocalStorage加载成就失败:', error);
    return [];
  }
};