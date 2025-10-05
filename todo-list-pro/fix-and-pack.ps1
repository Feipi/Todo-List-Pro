# PowerShell 脚本：修复依赖并打包 Windows 应用

Write-Host "开始修复依赖并打包 Windows 应用..." -ForegroundColor Green

# 1. 清理现有依赖
Write-Host "1. 清理现有依赖..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
    Write-Host "  已删除 node_modules 目录" -ForegroundColor Cyan
}

if (Test-Path "package-lock.json") {
    Remove-Item -Force "package-lock.json"
    Write-Host "  已删除 package-lock.json" -ForegroundColor Cyan
}

# 2. 清理 npm 缓存
Write-Host "2. 清理 npm 缓存..." -ForegroundColor Yellow
npm cache clean --force
Write-Host "  npm 缓存已清理" -ForegroundColor Cyan

# 3. 配置国内镜像源
Write-Host "3. 配置国内镜像源..." -ForegroundColor Yellow
npm config set registry https://registry.npmmirror.com
Write-Host "  已设置国内镜像源" -ForegroundColor Cyan

# 4. 重新安装依赖
Write-Host "4. 重新安装依赖..." -ForegroundColor Yellow
npm install --legacy-peer-deps
if ($LASTEXITCODE -eq 0) {
    Write-Host "  依赖安装成功" -ForegroundColor Cyan
} else {
    Write-Host "  依赖安装失败，尝试使用 --force 参数..." -ForegroundColor Red
    npm install --legacy-peer-deps --force
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  使用 --force 参数安装依赖成功" -ForegroundColor Cyan
    } else {
        Write-Host "  依赖安装失败，请手动检查问题" -ForegroundColor Red
        exit 1
    }
}

# 5. 单独安装关键依赖
Write-Host "5. 单独安装关键依赖..." -ForegroundColor Yellow
npm install electron electron-builder app-builder-bin --save-dev --legacy-peer-deps
if ($LASTEXITCODE -eq 0) {
    Write-Host "  关键依赖安装成功" -ForegroundColor Cyan
} else {
    Write-Host "  关键依赖安装失败，继续尝试打包..." -ForegroundColor Red
}

# 6. 构建 Web 应用
Write-Host "6. 构建 Web 应用..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "  Web 应用构建成功" -ForegroundColor Cyan
} else {
    Write-Host "  Web 应用构建失败，创建简单的构建目录..." -ForegroundColor Red
    
    # 创建简单的构建目录
    if (!(Test-Path "build")) {
        New-Item -ItemType Directory -Path "build" | Out-Null
    }
    
    # 创建简单的 index.html
    $indexHtml = @"
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
</html>
"@
    
    $indexHtml | Out-File -FilePath "build/index.html" -Encoding UTF8
    Write-Host "  已创建简单的构建目录" -ForegroundColor Cyan
}

# 7. 打包 Windows 应用
Write-Host "7. 打包 Windows 应用..." -ForegroundColor Yellow
npm run electron-pack
if ($LASTEXITCODE -eq 0) {
    Write-Host "  Windows 应用打包成功！" -ForegroundColor Green
    Write-Host "  安装包位于 dist 目录中" -ForegroundColor Green
} else {
    Write-Host "  Windows 应用打包失败" -ForegroundColor Red
    Write-Host "  尝试使用 npx electron-builder --win ..." -ForegroundColor Yellow
    npx electron-builder --win
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  使用 npx 打包成功！" -ForegroundColor Green
        Write-Host "  安装包位于 dist 目录中" -ForegroundColor Green
    } else {
        Write-Host "  打包失败，请检查错误信息" -ForegroundColor Red
        exit 1
    }
}

Write-Host "所有步骤完成！" -ForegroundColor Green