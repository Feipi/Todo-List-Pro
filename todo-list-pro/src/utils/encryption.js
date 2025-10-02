/**
 * 加密工具类
 * 提供数据加密和解密功能
 */

// 检查是否支持Web Crypto API
const isWebCryptoSupported = () => {
  return window.crypto && window.crypto.subtle;
};

/**
 * 生成加密密钥
 * @param {string} password 用户密码
 * @param {Uint8Array} salt 盐值
 * @returns {Promise<CryptoKey>} 加密密钥
 */
export const generateKey = async (password, salt) => {
  if (!isWebCryptoSupported()) {
    throw new Error('Web Crypto API not supported');
  }
  
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  
  // 导入密码作为密钥材料
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    data,
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  
  // 派生密钥
  return await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
};

/**
 * 生成随机盐值
 * @returns {Uint8Array} 随机盐值
 */
export const generateSalt = () => {
  if (!isWebCryptoSupported()) {
    // 降级方案：使用简单的随机数生成
    return new Uint8Array([
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256)
    ]);
  }
  
  return window.crypto.getRandomValues(new Uint8Array(16));
};

/**
 * 加密数据
 * @param {string} plaintext 明文数据
 * @param {CryptoKey} key 加密密钥
 * @param {Uint8Array} iv 初始化向量
 * @returns {Promise<ArrayBuffer>} 加密后的数据
 */
export const encrypt = async (plaintext, key, iv) => {
  if (!isWebCryptoSupported()) {
    throw new Error('Web Crypto API not supported');
  }
  
  const encoder = new TextEncoder();
  const data = encoder.encode(plaintext);
  
  return await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    key,
    data
  );
};

/**
 * 解密数据
 * @param {ArrayBuffer} ciphertext 加密的数据
 * @param {CryptoKey} key 解密密钥
 * @param {Uint8Array} iv 初始化向量
 * @returns {Promise<string>} 解密后的明文
 */
export const decrypt = async (ciphertext, key, iv) => {
  if (!isWebCryptoSupported()) {
    throw new Error('Web Crypto API not supported');
  }
  
  const decrypted = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv
    },
    key,
    ciphertext
  );
  
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
};

/**
 * 将ArrayBuffer转换为Base64字符串
 * @param {ArrayBuffer} buffer ArrayBuffer数据
 * @returns {string} Base64字符串
 */
export const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

/**
 * 将Base64字符串转换为ArrayBuffer
 * @param {string} base64 Base64字符串
 * @returns {ArrayBuffer} ArrayBuffer数据
 */
export const base64ToArrayBuffer = (base64) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

/**
 * 加密对象数据
 * @param {Object} data 要加密的对象
 * @param {string} password 加密密码
 * @returns {Promise<string>} 加密后的数据（Base64格式）
 */
export const encryptObject = async (data, password) => {
  try {
    // 生成盐值和初始化向量
    const salt = generateSalt();
    const iv = generateSalt().slice(0, 12); // AES-GCM推荐使用12字节IV
    
    // 生成密钥
    const key = await generateKey(password, salt);
    
    // 序列化对象
    const plaintext = JSON.stringify(data);
    
    // 加密数据
    const ciphertext = await encrypt(plaintext, key, iv);
    
    // 组合盐值、IV和密文
    const result = {
      salt: arrayBufferToBase64(salt),
      iv: arrayBufferToBase64(iv),
      data: arrayBufferToBase64(ciphertext)
    };
    
    return JSON.stringify(result);
  } catch (error) {
    console.error('加密失败:', error);
    throw error;
  }
};

/**
 * 解密对象数据
 * @param {string} encryptedData 加密的数据（Base64格式）
 * @param {string} password 解密密码
 * @returns {Promise<Object>} 解密后的对象
 */
export const decryptObject = async (encryptedData, password) => {
  try {
    // 解析加密数据
    const { salt, iv, data } = JSON.parse(encryptedData);
    
    // 转换为ArrayBuffer
    const saltBuffer = base64ToArrayBuffer(salt);
    const ivBuffer = base64ToArrayBuffer(iv);
    const dataBuffer = base64ToArrayBuffer(data);
    
    // 生成密钥
    const key = await generateKey(password, saltBuffer);
    
    // 解密数据
    const plaintext = await decrypt(dataBuffer, key, ivBuffer);
    
    // 反序列化对象
    return JSON.parse(plaintext);
  } catch (error) {
    console.error('解密失败:', error);
    throw error;
  }
};

export default {
  encryptObject,
  decryptObject,
  generateSalt,
  isWebCryptoSupported
};