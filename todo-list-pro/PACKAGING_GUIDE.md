# Todo List Pro 打包指南

## 前置要求

1. Node.js >= 16.0.0 (推荐使用 LTS 版本)
2. npm 或 yarn 包管理器

## 各平台打包步骤

### 1. Windows 平台打包

```bash
# 1. 安装依赖
npm install

# 2. 构建应用
npm run build

# 3. 打包 Windows 应用
npm run electron-pack
```

打包完成后，安装包将位于 `dist` 目录下。

### 2. MacOS 平台打包

```bash
# 1. 安装依赖
npm install

# 2. 构建应用
npm run build

# 3. 打包 MacOS 应用
npm run pack-mac
```

### 3. Linux 平台打包

```bash
# 1. 安装依赖
npm install

# 2. 构建应用
npm run build

# 3. 打包 Linux 应用
npm run pack-linux
```

### 4. Web 版本部署

```bash
# 1. 构建 Web 版本
npm run build

# 2. 部署 build 目录到以下任一平台：
# - GitHub Pages
# - Netlify
# - Vercel
# - Nginx/Apache 等静态服务器
```

## 移动端部署方案

### iOS/Android 部署

项目目前是基于 Electron 的桌面应用，要部署到移动端需要进行重构或使用跨平台框架。

#### 方案一：使用 Capacitor 转换为移动端应用

1. 安装 Capacitor：
```bash
npm install @capacitor/core @capacitor/cli
npx cap init
```

2. 添加平台：
```bash
npm install @capacitor/ios @capacitor/android
npx cap add ios
npx cap add android
```

3. 构建并同步：
```bash
npm run build
npx cap sync
```

4. 使用原生 IDE 打开并构建：
```bash
npx cap open ios    # Xcode 中打开 iOS 项目
npx cap open android # Android Studio 中打开 Android 项目
```

#### 方案二：重构为 React Native 应用

将核心业务逻辑提取，使用 React Native 重新构建移动端 UI。

## 常见问题解决

### 1. 依赖安装问题

如果遇到依赖安装问题，可以尝试以下方法：

```bash
# 清除 npm 缓存
npm cache clean --force

# 删除 node_modules 和 package-lock.json
rm -rf node_modules package-lock.json

# 重新安装依赖
npm install --legacy-peer-deps
```

### 2. Electron 版本兼容性问题

如果遇到 Electron 版本兼容性问题，可以尝试修改 package.json 中的 Electron 版本：

```json
"devDependencies": {
  "electron": "^22.0.0"
}
```

### 3. 构建失败问题

如果构建失败，确保 public 目录下有正确的 index.html 文件，并且项目结构完整。

## 各平台打包配置说明

### Windows 配置

package.json 中的 build 配置：
```json
"win": {
  "target": "nsis",
  "icon": "public/favicon.ico"
},
"nsis": {
  "oneClick": false,
  "allowToChangeInstallationDirectory": true
}
```

### MacOS 配置

```json
"mac": {
  "category": "public.app-category.productivity",
  "target": "dmg"
}
```

### Linux 配置

```json
"linux": {
  "target": ["AppImage", "deb"],
  "category": "Utility"
}
```

## 注意事项

1. 打包前确保应用可以正常运行：`npm start`
2. 确保所有依赖正确安装
3. 打包过程可能需要较长时间，请耐心等待
4. 如果遇到网络问题，可以使用国内镜像源