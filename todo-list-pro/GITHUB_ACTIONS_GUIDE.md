# 使用 GitHub Actions 打包 Todo List Pro

本指南将帮助你使用 GitHub Actions 自动打包 Todo List Pro 应用。

## 前置要求

1. 将项目推送到 GitHub 仓库
2. 确保项目根目录有 `.github/workflows/build-and-release.yml` 文件（已创建）

## GitHub Actions 工作流说明

我们创建的工作流文件 `.github/workflows/build-and-release.yml` 包含以下功能：

### 触发条件

- 当推送到 `main` 或 `master` 分支时自动构建
- 当创建新的 Release 时自动构建并发布

### 构建任务

1. **Windows 构建** - 在 Windows 环境中构建 Windows 应用
2. **MacOS 构建** - 在 MacOS 环境中构建 MacOS 应用
3. **Linux 构建** - 在 Linux 环境中构建 Linux 应用

### 发布任务

当创建新的 Release 时，自动将构建的安装包附加到 Release 中。

## 使用步骤

### 1. 推送代码到 GitHub

```bash
# 如果还没有初始化 git 仓库
git init
git add .
git commit -m "Initial commit"

# 添加 GitHub 远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/your-username/todo-list-pro.git

# 推送代码
git branch -M main
git push -u origin main
```

### 2. 观看构建过程

1. 访问 GitHub 仓库页面
2. 点击 "Actions" 标签
3. 查看构建进度和结果

### 3. 下载构建产物

构建完成后，你可以通过以下方式获取安装包：

1. 在 Actions 页面找到对应的构建任务
2. 点击 "Artifacts" 下载构建产物

### 4. 创建 Release 并自动发布

1. 在 GitHub 仓库页面点击 "Releases"
2. 点击 "Draft a new release"
3. 填写版本信息并发布
4. GitHub Actions 会自动构建并将安装包附加到 Release

## 自定义配置

你可以根据需要修改 `.github/workflows/build-and-release.yml` 文件：

### 修改 Node.js 版本

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '18'  # 修改为你需要的版本
```

### 修改触发分支

```yaml
on:
  push:
    branches: [ main, develop ]  # 添加或修改分支名称
```

### 添加更多平台

可以在工作流中添加更多平台的构建任务。

## 故障排除

### 构建失败

如果构建失败，请检查以下几点：

1. 依赖安装是否成功
2. 构建脚本是否正确
3. 是否有足够的权限

### 权限问题

确保 GitHub Actions 有足够权限：

1. 在仓库设置中启用 GitHub Actions
2. 检查仓库的 Actions 权限设置

## 本地开发与测试

在推送代码之前，你可以在本地测试构建过程：

```bash
# 安装依赖
npm install

# 构建 Web 应用
npm run build

# 打包各平台应用
npm run pack-win    # Windows
npm run pack-mac    # MacOS
npm run pack-linux  # Linux
```

## 相关文档

- [GitHub Actions 官方文档](https://docs.github.com/en/actions)
- [Electron Builder 文档](https://www.electron.build/)
- [Node.js GitHub Actions](https://github.com/actions/setup-node)

通过使用 GitHub Actions，你可以实现自动化的跨平台打包，无需手动配置复杂的构建环境。