---
title: "欢迎使用 WDR 博客引擎"
date: 2025-12-31T12:50:35.552Z
author: "机器人团队"
categories:
  - 教程
tags:
  - WDR
  - 博客
---

# 欢迎使用 WDR

这是你的第一篇博客文章。WDR 是一个快速的静态博客生成器，专为机器人团队打造。

## 功能特点

- **快速生成**: 基于 Node.js，构建速度快
- **Markdown 支持**: 使用 Markdown 编写文章，支持代码高亮
- **分类标签**: 完善的分类和标签系统
- **简约设计**: 清爽的科技风格主题
- **响应式**: 支持移动端和桌面端

## 快速开始

### 创建新文章

在 `source/_posts/` 目录下创建 Markdown 文件：

```markdown
---
title: "文章标题"
date: 2024-01-15 14:30:00
categories:
  - 分类名
tags:
  - 标签1
  - 标签2
---

# 文章内容...
```

### 构建网站

```bash
wdr build
```

### 本地预览

```bash
wdr server
```

然后访问 http://localhost:4000

### 部署

将 `public` 目录部署到 GitHub Pages 或其他静态托管服务。

## 代码示例

WDR 支持代码高亮：

```javascript
function helloWorld() {
  console.log('Hello, WDR!');
  return 'Welcome to WDR Blog Engine';
}
```

## 开始写作

现在开始创建你的博客内容吧！
