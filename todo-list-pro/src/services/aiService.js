// services/aiService.js
// AI服务类

class AIService {
  constructor(apiKey = '', serverUrl = '') {
    this.apiKey = apiKey;
    this.serverUrl = serverUrl;
  }

  // 设置API密钥和服务器URL
  setCredentials(apiKey, serverUrl) {
    this.apiKey = apiKey;
    this.serverUrl = serverUrl;
  }

  // 检查AI服务是否可用
  isAvailable() {
    return this.apiKey && this.serverUrl;
  }

  // 智能任务分类
  async categorizeTask(taskTitle, taskDescription) {
    if (!this.isAvailable()) {
      throw new Error('AI服务未配置');
    }

    try {
      // 模拟AI分类请求
      return new Promise((resolve) => {
        setTimeout(() => {
          // 简单的关键词匹配模拟AI分类
          const content = (taskTitle + ' ' + taskDescription).toLowerCase();
          let category = '其他';
          
          if (content.includes('学习') || content.includes('学习') || content.includes('读书') || content.includes('课程')) {
            category = '学习';
          } else if (content.includes('工作') || content.includes('项目') || content.includes('会议') || content.includes('报告')) {
            category = '工作';
          } else if (content.includes('购物') || content.includes('买') || content.includes('购买')) {
            category = '购物';
          } else if (content.includes('健康') || content.includes('运动') || content.includes('锻炼') || content.includes('医生')) {
            category = '健康';
          } else if (content.includes('旅行') || content.includes('旅游') || content.includes('度假')) {
            category = '旅行';
          } else if (content.includes('家庭') || content.includes('家人') || content.includes('朋友') || content.includes('聚会')) {
            category = '社交';
          }
          
          resolve({
            success: true,
            category: category,
            confidence: 0.85
          });
        }, 500);
      });
    } catch (error) {
      throw new Error(`AI分类失败: ${error.message}`);
    }
  }

  // 智能任务优先级建议
  async suggestPriority(taskTitle, taskDescription, dueDate) {
    if (!this.isAvailable()) {
      throw new Error('AI服务未配置');
    }

    try {
      // 模拟AI优先级建议请求
      return new Promise((resolve) => {
        setTimeout(() => {
          // 简单的规则模拟AI优先级建议
          const content = (taskTitle + ' ' + taskDescription).toLowerCase();
          let priority = 'medium';
          
          // 根据关键词判断优先级
          if (content.includes('紧急') || content.includes('重要') || content.includes('必须')) {
            priority = 'high';
          } else if (content.includes('可选') || content.includes('以后') || content.includes('随意')) {
            priority = 'low';
          }
          
          // 根据截止日期判断优先级
          if (dueDate) {
            const due = new Date(dueDate);
            const now = new Date();
            const daysUntilDue = (due - now) / (1000 * 60 * 60 * 24);
            
            if (daysUntilDue <= 1) {
              priority = 'high';
            } else if (daysUntilDue > 7) {
              priority = 'low';
            }
          }
          
          resolve({
            success: true,
            priority: priority,
            reason: '基于任务内容和截止日期的智能分析'
          });
        }, 500);
      });
    } catch (error) {
      throw new Error(`AI优先级建议失败: ${error.message}`);
    }
  }

  // 智能任务描述优化
  async optimizeTaskDescription(taskTitle, taskDescription) {
    if (!this.isAvailable()) {
      throw new Error('AI服务未配置');
    }

    try {
      // 模拟AI任务描述优化请求
      return new Promise((resolve) => {
        setTimeout(() => {
          // 简单的规则模拟AI任务描述优化
          let optimizedDescription = taskDescription;
          
          // 如果描述为空，基于标题生成描述
          if (!taskDescription || taskDescription.trim() === '') {
            if (taskTitle.includes('学习')) {
              optimizedDescription = '学习相关知识，提升技能水平';
            } else if (taskTitle.includes('会议')) {
              optimizedDescription = '参加重要会议，讨论项目进展';
            } else if (taskTitle.includes('购物')) {
              optimizedDescription = '购买所需物品，满足生活需求';
            } else {
              optimizedDescription = '完成相关任务，达成目标';
            }
          }
          
          resolve({
            success: true,
            description: optimizedDescription,
            suggestions: [
              '明确任务目标',
              '设定完成标准',
              '分解为子任务'
            ]
          });
        }, 500);
      });
    } catch (error) {
      throw new Error(`AI任务描述优化失败: ${error.message}`);
    }
  }

  // 智能任务提醒时间建议
  async suggestReminderTime(dueDate) {
    if (!this.isAvailable()) {
      throw new Error('AI服务未配置');
    }

    try {
      // 模拟AI提醒时间建议请求
      return new Promise((resolve) => {
        setTimeout(() => {
          if (!dueDate) {
            resolve({
              success: true,
              remindTime: '09:00',
              reason: '默认提醒时间'
            });
            return;
          }
          
          // 基于截止日期建议提醒时间
          const due = new Date(dueDate);
          const now = new Date();
          const daysUntilDue = (due - now) / (1000 * 60 * 60 * 24);
          
          let remindTime = '09:00';
          let reason = '';
          
          if (daysUntilDue > 1) {
            // 提前一天提醒
            const remindDate = new Date(due);
            remindDate.setDate(remindDate.getDate() - 1);
            remindTime = '09:00';
            reason = '提前一天提醒';
          } else if (daysUntilDue > 0) {
            // 当天早上提醒
            remindTime = '08:00';
            reason = '当天早上提醒';
          } else {
            // 已过期任务，建议尽快处理
            remindTime = '09:00';
            reason = '任务已过期，建议尽快处理';
          }
          
          resolve({
            success: true,
            remindTime: remindTime,
            reason: reason
          });
        }, 500);
      });
    } catch (error) {
      throw new Error(`AI提醒时间建议失败: ${error.message}`);
    }
  }

  // 智能任务标签建议
  async suggestTags(taskTitle, taskDescription) {
    if (!this.isAvailable()) {
      throw new Error('AI服务未配置');
    }

    try {
      // 模拟AI标签建议请求
      return new Promise((resolve) => {
        setTimeout(() => {
          const content = (taskTitle + ' ' + taskDescription).toLowerCase();
          const tags = [];
          
          // 基于关键词建议标签
          if (content.includes('学习') || content.includes('学习') || content.includes('读书') || content.includes('课程')) {
            tags.push('学习');
          }
          if (content.includes('工作') || content.includes('项目') || content.includes('会议') || content.includes('报告')) {
            tags.push('工作');
          }
          if (content.includes('健康') || content.includes('运动') || content.includes('锻炼') || content.includes('医生')) {
            tags.push('健康');
          }
          if (content.includes('家庭') || content.includes('家人') || content.includes('朋友') || content.includes('聚会')) {
            tags.push('社交');
          }
          if (content.includes('购物') || content.includes('买') || content.includes('购买')) {
            tags.push('购物');
          }
          if (content.includes('旅行') || content.includes('旅游') || content.includes('度假')) {
            tags.push('旅行');
          }
          
          // 如果没有匹配的标签，添加默认标签
          if (tags.length === 0) {
            tags.push('日常');
          }
          
          resolve({
            success: true,
            tags: tags,
            confidence: 0.8
          });
        }, 500);
      });
    } catch (error) {
      throw new Error(`AI标签建议失败: ${error.message}`);
    }
  }
}

export default AIService;