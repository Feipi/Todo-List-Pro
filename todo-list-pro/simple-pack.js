#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Todo List Pro 简易打包工具');

// 检查是否已安装必要的依赖
function checkDependencies() {
  console.log('检查依赖...');
  try {
    execSync('npm list electron-builder', { stdio: 'ignore' });
    console.log('✓ electron-builder 已安装');
    return true;
  } catch (error) {
    console.log('✗ electron-builder 未安装');
    return false;
  }
}

// 安装依赖
function installDependencies() {
  console.log('安装依赖...');
  try {
    execSync('npm install electron-builder --save-dev', { stdio: 'inherit' });
    console.log('✓ 依赖安装完成');
  } catch (error) {
    console.error('✗ 依赖安装失败:', error.message);
  }
}

// 构建 Web 应用
function buildWebApp() {
  console.log('构建 Web 应用...');
  try {
    // 检查 build 目录是否存在
    const buildDir = path.join(__dirname, 'build');
    if (!fs.existsSync(buildDir)) {
      fs.mkdirSync(buildDir, { recursive: true });
    }
    
    // 创建简单的 HTML 文件
    const indexHtml = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Todo List Pro</title>
</head>
<body>
    <div id="root">
        <h1>Todo List Pro</h1>
        <p>应用正在加载中...</p>
    </div>
</body>
</html>`;
    
    fs.writeFileSync(path.join(buildDir, 'index.html'), indexHtml);
    console.log('✓ Web 应用构建完成');
  } catch (error) {
    console.error('✗ Web 应用构建失败:', error.message);
  }
}

// 打包 Windows 应用
function packWindows() {
  console.log('打包 Windows 应用...');
  try {
    execSync('npx electron-builder --win', { stdio: 'inherit' });
    console.log('✓ Windows 应用打包完成');
  } catch (error) {
    console.error('✗ Windows 应用打包失败:', error.message);
  }
}

// 打包 MacOS 应用
function packMacOS() {
  console.log('打包 MacOS 应用...');
  try {
    execSync('npx electron-builder --mac', { stdio: 'inherit' });
    console.log('✓ MacOS 应用打包完成');
  } catch (error) {
    console.error('✗ MacOS 应用打包失败:', error.message);
  }
}

// 打包 Linux 应用
function packLinux() {
  console.log('打包 Linux 应用...');
  try {
    execSync('npx electron-builder --linux', { stdio: 'inherit' });
    console.log('✓ Linux 应用打包完成');
  } catch (error) {
    console.error('✗ Linux 应用打包失败:', error.message);
  }
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  const platform = args[0];
  
  console.log('开始打包流程...');
  
  // 构建 Web 应用
  buildWebApp();
  
  // 检查依赖
  if (!checkDependencies()) {
    installDependencies();
  }
  
  // 根据参数打包对应平台
  switch (platform) {
    case 'win':
      packWindows();
      break;
    case 'mac':
      packMacOS();
      break;
    case 'linux':
      packLinux();
      break;
    case 'all':
      packWindows();
      packMacOS();
      packLinux();
      break;
    default:
      console.log('用法: node simple-pack.js [win|mac|linux|all]');
  }
  
  console.log('打包流程结束');
}

// 运行主函数
main();