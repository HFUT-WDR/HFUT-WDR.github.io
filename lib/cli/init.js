const path = require('path');
const fs = require('fs-extra');
const { ensureDir, writeFile } = require('../utils/file');

/**
 * 初始化命令
 */
async function init(dir = '.') {
  console.log('Initializing WDR blog...');

  const basePath = path.resolve(dir);
  const sourceDir = path.join(basePath, 'source');
  const postsDir = path.join(sourceDir, '_posts');

  try {
    // 创建目录结构
    console.log('Creating directory structure...');
    await ensureDir(postsDir);
    console.log('  ✓ source/_posts/');

    // 创建默认配置文件
    console.log('Creating configuration file...');
    await createConfig(basePath);
    console.log('  ✓ _config.yml');

    // 创建示例文章
    console.log('Creating sample post...');
    await createSamplePost(postsDir);
    console.log('  ✓ source/_posts/hello-world.md');

    console.log('\n✓ WDR blog initialized successfully!');
    console.log('\nNext steps:');
    console.log('  1. Edit _config.yml to configure your blog');
    console.log('  2. Create posts in source/_posts/');
    console.log('  3. Run "wdr build" to generate your site');
    console.log('  4. Run "wdr server" to preview locally');

  } catch (error) {
    console.error('✗ Initialization failed:', error.message);
    process.exit(1);
  }
}

/**
 * 创建配置文件
 */
async function createConfig(basePath) {
  const configPath = path.join(basePath, '_config.yml');

  const configContent = `# WDR 博客配置文件

# 站点信息
title: "机器人技术博客"
subtitle: "探索智能机器人技术"
description: "专注于机器人技术、人工智能和自动化的技术博客"
author: "机器人团队"
language: zh-CN
timezone: Asia/Shanghai

# URL 配置
url: https://yourusername.github.io
root: /
permalink: :year/:month/:title.html

# 目录配置
source_dir: source
public_dir: public
tag_dir: tags
category_dir: categories

# 写作配置
new_post_name: :year-:month-:day-:title.md
default_layout: post
titlecase: false

# 分页配置
per_page: 10
pagination_dir: page

# 主题配置
theme: default

# Markdown 配置
markdown:
  render:
    highlight: true
  plugins:
    - highlight.js

# 扩展配置
json_content: false
post_asset_folder: false

# 服务器配置
server:
  port: 4000
  log: false
  compress: false

# 时间格式
date_format: YYYY-MM-DD HH:mm:ss
`;

  await writeFile(configPath, configContent);
}

/**
 * 创建示例文章
 */
async function createSamplePost(postsDir) {
  const postPath = path.join(postsDir, 'hello-world.md');

  const postContent = `---
title: "欢迎使用 WDR 博客引擎"
date: ${new Date().toISOString()}
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

在 \`source/_posts/\` 目录下创建 Markdown 文件：

\`\`\`markdown
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
\`\`\`

### 构建网站

\`\`\`bash
wdr build
\`\`\`

### 本地预览

\`\`\`bash
wdr server
\`\`\`

然后访问 http://localhost:4000

### 部署

将 \`public\` 目录部署到 GitHub Pages 或其他静态托管服务。

## 代码示例

WDR 支持代码高亮：

\`\`\`javascript
function helloWorld() {
  console.log('Hello, WDR!');
  return 'Welcome to WDR Blog Engine';
}
\`\`\`

## 开始写作

现在开始创建你的博客内容吧！
`;

  await writeFile(postPath, postContent);
}

module.exports = init;
