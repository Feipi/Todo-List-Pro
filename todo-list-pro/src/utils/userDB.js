// utils/userDB.js
import { initDB, addData, getAllData } from './indexedDB';

const DB_NAME = 'TodoListProDB';
const DB_VERSION = 2;
const USER_STORE = 'users';

// 注册用户
export const registerUser = async (userData) => {
  try {
    // 确保数据库已初始化
    await initDB();
    // 添加用户数据
    const result = await addData(USER_STORE, userData);
    return result;
  } catch (error) {
    console.error('注册用户失败:', error);
    throw error;
  }
};

// 根据用户名查找用户
export const findUserByUsername = async (username) => {
  try {
    // 确保数据库已初始化
    const db = await initDB();
    
    const transaction = db.transaction([USER_STORE], 'readonly');
    const store = transaction.objectStore(USER_STORE);
    const index = store.index('username');
    const request = index.get(username);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('查找用户失败:', error);
    throw error;
  }
};

// 根据邮箱查找用户
export const findUserByEmail = async (email) => {
  try {
    // 确保数据库已初始化
    const db = await initDB();
    
    const transaction = db.transaction([USER_STORE], 'readonly');
    const store = transaction.objectStore(USER_STORE);
    const index = store.index('email');
    const request = index.get(email);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('查找用户失败:', error);
    throw error;
  }
};

// 验证用户密码
export const validateUserPassword = (user, password) => {
  // 在实际应用中，这里应该使用加密的密码验证
  // 为简化，我们直接比较密码
  return user.password === password;
};

// 保存当前用户到LocalStorage
export const saveCurrentUser = (user) => {
  try {
    const userToSave = { ...user };
    // 不保存密码到LocalStorage
    delete userToSave.password;
    localStorage.setItem('todoListPro_currentUser', JSON.stringify(userToSave));
  } catch (error) {
    console.error('保存当前用户失败:', error);
  }
};

// 从LocalStorage获取当前用户
export const loadCurrentUser = () => {
  try {
    const user = localStorage.getItem('todoListPro_currentUser');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('加载当前用户失败:', error);
    return null;
  }
};

// 从LocalStorage删除当前用户
export const removeCurrentUser = () => {
  try {
    localStorage.removeItem('todoListPro_currentUser');
  } catch (error) {
    console.error('删除当前用户失败:', error);
  }
};