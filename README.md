# WDR 静态博客引擎

> 一个快速、简单的静态博客生成器，专为机器人团队打造

WDR 是一个基于 Node.js 的静态博客生成工具，类似于 Hexo，但更加轻量和专注。它支持 Markdown 写作，具备完善的分类、标签系统，并提供简约科技风格的主题。

## 特性

- **快速构建**: 基于 Node.js，生成速度快
- **Markdown 支持**: 使用 Markdown 编写文章，原生支持代码高亮
- **分类标签**: 完善的分类和标签系统
- **简约设计**: 清爽的科技风格主题
- **响应式布局**: 支持移动端和桌面端
- **实时预览**: 内置开发服务器，支持热重载
- **易于部署**: 生成纯静态 HTML，可部署到任何静态托管服务

## 快速开始

### 安装

```bash
# 克隆仓库
git clone https://github.com/yourteam/wdr.git
cd wdr

# 安装依赖
npm install

# 全局安装（可选）
npm link
```

### 初始化博客

```bash
# 在当前目录初始化
wdr init

# 或在指定目录初始化
wdr init my-blog
cd my-blog
```

这会创建以下目录结构：

```
.
├── source/           # 源文件目录
│   └── _posts/      # Markdown 文章存放处
├── themes/          # 主题目录
├── _config.yml      # 站点配置文件
└── public/          # 生成的静态文件（构建后）
```

### 编写文章

在 `source/_posts/` 目录下创建 Markdown 文件：

```markdown
---
title: "我的第一篇博客"
date: 2024-01-15 14:30:00
author: "张三"
categories:
  - 教程
tags:
  - WDR
  - 博客
---

# 欢迎使用 WDR

这是我的第一篇博客文章...
```

### 构建网站

```bash
wdr build
```

生成的静态文件会输出到 `public/` 目录。

### 本地预览

```bash
wdr server
```

访问 http://localhost:4000 查看效果。

开发服务器支持文件监控和自动重建：

```bash
# 使用默认端口 4000
wdr server

# 指定端口
wdr server --port 3000
```

### 清理构建文件

```bash
wdr clean
```

删除 `public/` 目录。

## 命令参考

### `wdr init [dir]`

初始化一个新的博客项目。

**选项:**
- `dir` - 目标目录（可选，默认为当前目录）

**示例:**
```bash
wdr init my-blog
```

### `wdr build` 或 `wdr b`

构建博客，生成静态文件到 `public/` 目录。

**示例:**
```bash
wdr build
```

### `wdr clean`

清理生成的文件（删除 `public/` 目录）。

**示例:**
```bash
wdr clean
```

### `wdr server` 或 `wdr s`

启动本地预览服务器，支持热重载。

**选项:**
- `-p, --port <port>` - 指定端口号（默认: 4000）

**示例:**
```bash
wdr server
wdr server --port 3000
```

### `wdr start`

构建并启动服务器（开发模式）。

**选项:**
- `-p, --port <port>` - 指定端口号（默认: 4000）

## 配置

编辑 `_config.yml` 文件配置你的博客：

```yaml
# 站点信息
title: "机器人技术博客"
subtitle: "探索智能机器人技术"
description: "专注于机器人技术的技术博客"
author: "机器人团队"
language: zh-CN

# URL 配置
url: https://yourusername.github.io
root: /

# 目录配置
source_dir: source
public_dir: public

# 分页配置
per_page: 10

# 主题配置
theme: default

# 日期格式
date_format: YYYY-MM-DD HH:mm:ss
```

## Front Matter

每篇文章的 Front Matter 定义了文章的元数据：

```yaml
---
title: "文章标题"           # 必需
date: 2024-01-15 14:30:00  # 必需
author: "作者名"            # 可选
categories:                # 可选
  - 分类1
  - 分类2
tags:                      # 可选
  - 标签1
  - 标签2
cover: /images/cover.jpg   # 可选，封面图
description: "文章摘要"     # 可选
---
```

## 主题定制

WDR 使用 EJS 模板引擎，主题文件位于 `themes/default/` 目录：

```
themes/default/
├── layout/              # 模板文件
│   ├── layout.ejs       # 基础布局
│   ├── index.ejs        # 首页
│   ├── post.ejs         # 文章页
│   ├── archive.ejs      # 归档页
│   ├── category.ejs     # 分类页
│   └── tag.ejs          # 标签页
└── source/              # 主题资源
    ├── css/style.css    # 样式文件
    └── js/main.js       # JavaScript 文件
```

### 自定义主题

1. 复制 `themes/default/` 到新目录
2. 修改模板和样式
3. 在 `_config.yml` 中设置 `theme: 你的主题名`

## 部署

### GitHub Pages

```bash
# 构建网站
wdr build

# 将 public 目录推送到 gh-pages 分支
cd public
git init
git add .
git commit -m "Deploy to GitHub Pages"
git push -f https://github.com/yourusername/yourusername.github.io.git master:gh-pages
```

### Vercel / Netlify

直接将整个项目连接到 Vercel 或 Netlify，设置构建命令为：

```bash
npm install
npm run build
```

输出目录设置为 `public`。

## 项目结构

```
wdr/
├── bin/                  # CLI 可执行文件
│   └── wdr.js           # 主入口
├── lib/                  # 核心库
│   ├── cli/             # CLI 命令
│   │   ├── init.js
│   │   ├── build.js
│   │   ├── clean.js
│   │   └── server.js
│   ├── core/            # 核心功能
│   │   ├── processor.js # Markdown 处理器
│   │   ├── generator.js # HTML 生成器
│   │   ├── router.js    # 路由生成器
│   │   └── asset.js     # 资源处理器
│   ├── template/        # 模板引擎
│   │   └── engine.js    # EJS 封装
│   └── utils/           # 工具函数
│       ├── file.js
│       ├── date.js
│       └── slugify.js
├── themes/              # 主题目录
│   └── default/        # 默认主题
├── scaffolds/          # 脚手架模板
│   └── post.md
├── package.json
└── README.md
```

## 技术栈

- **Node.js**: 运行环境
- **Express**: 预览服务器
- **EJS**: 模板引擎
- **Marked**: Markdown 解析器
- **gray-matter**: Front Matter 解析
- **highlight.js**: 代码高亮
- **chokidar**: 文件监控
- **Commander**: CLI 框架

## 开发

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/yourteam/wdr.git
cd wdr

# 安装依赖
npm install

# 运行测试
npm test

# 代码检查
npm run lint
```

### 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 许可证

MIT License

## 作者

机器人团队

## 鸣谢

- [Hexo](https://hexo.io/) - 灵感来源
- [Marked](https://marked.js.org/) - Markdown 解析
- [EJS](https://ejs.co/) - 模板引擎

---

**WDR** - 为机器人团队打造的静态博客引擎

如有问题，请提交 [Issue](https://github.com/yourteam/wdr/issues)
