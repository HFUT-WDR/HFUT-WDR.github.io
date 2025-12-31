const path = require('path');
const express = require('express');
const chokidar = require('chokidar');
const fs = require('fs-extra');
const yaml = require('js-yaml');
const { exists } = require('../utils/file');

/**
 * 服务器命令
 */
async function server(options = {}) {
  const port = options.port || 4000;
  const publicDir = path.resolve('public');

  console.log('WDR Server');
  console.log('===========\n');

  // 检查 public 目录是否存在
  if (!await exists(publicDir)) {
    console.log('⚠ No public directory found.');
    console.log('Please run "wdr build" first to generate your site.');
    process.exit(1);
  }

  // 创建 Express 应用
  const app = express();

  // 静态文件服务
  app.use(express.static(publicDir));

  // 所有路由重定向到 index.html（SPA 风格）
  app.get('*', (req, res) => {
    // 尝试查找对应的文件
    const requestPath = path.join(publicDir, req.path);

    // 检查是否是目录，如果是，尝试访问 index.html
    if (req.path.endsWith('/')) {
      const indexPath = path.join(requestPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        return res.sendFile(indexPath);
      }
    }

    // 检查文件是否存在
    if (fs.existsSync(requestPath) && fs.statSync(requestPath).isFile()) {
      return res.sendFile(requestPath);
    }

    // 404 页面
    res.status(404).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>404 - Page Not Found</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
            background: #f8f9fa;
          }
          .error {
            text-align: center;
          }
          h1 {
            font-size: 6rem;
            margin: 0;
            color: #0066cc;
          }
          h2 {
            margin: 1rem 0;
            color: #333;
          }
          p {
            color: #666;
            margin: 2rem 0;
          }
          a {
            color: #0066cc;
            text-decoration: none;
            padding: 0.5rem 1.5rem;
            border: 2px solid #0066cc;
            border-radius: 6px;
            transition: all 0.3s;
          }
          a:hover {
            background: #0066cc;
            color: white;
          }
        </style>
      </head>
      <body>
        <div class="error">
          <h1>404</h1>
          <h2>Page Not Found</h2>
          <p>The page you're looking for doesn't exist.</p>
          <a href="/">Back to Home</a>
        </div>
      </body>
      </html>
    `);
  });

  // 启动服务器
  app.listen(port, () => {
    console.log(`✓ Server is running at http://localhost:${port}/`);
    console.log('Press Ctrl+C to stop the server\n');

    // 启动文件监控
    startWatcher(publicDir);
  });
}

/**
 * 启动文件监控
 */
function startWatcher(publicDir) {
  console.log('Watching for changes...\n');

  let rebuildTimeout = null;
  const sourceDir = path.resolve('source/_posts');
  const configPath = path.resolve('_config.yml');

  // 监控源文件和配置文件
  const watchPaths = [sourceDir, configPath];

  const watcher = chokidar.watch(watchPaths, {
    ignored: /(^|[\/\\])\../, // 忽略隐藏文件
    persistent: true,
    ignoreInitial: true
  });

  watcher.on('change', (filePath) => {
    console.log(`\n⚠ File changed: ${filePath}`);

    // 防抖，避免频繁重建
    if (rebuildTimeout) {
      clearTimeout(rebuildTimeout);
    }

    rebuildTimeout = setTimeout(() => {
      console.log('Rebuilding...\n');

      const { build } = require('./build');
      build().then(() => {
        console.log('\n✓ Site rebuilt!');
        console.log('Refresh your browser to see changes\n');
      }).catch(err => {
        console.error('✗ Rebuild failed:', err.message);
      });
    }, 500);
  });

  // 监控主题文件变化（可选）
  const themePath = path.join(__dirname, '../../themes/default/source');
  if (fs.existsSync(themePath)) {
    const themeWatcher = chokidar.watch(themePath, {
      persistent: true,
      ignoreInitial: true
    });

    themeWatcher.on('change', (filePath) => {
      console.log(`\n⚠ Theme file changed: ${filePath}`);
      console.log('Run "wdr build" to rebuild the site\n');
    });
  }

  // 优雅关闭
  process.on('SIGINT', () => {
    console.log('\n\nShutting down server...');
    watcher.close();
    process.exit(0);
  });
}

module.exports = server;
