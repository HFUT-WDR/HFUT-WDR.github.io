#!/usr/bin/env node

/**
 * WDR - 静态博客生成器
 * WDR Static Blog Generator
 *
 * 一个快速、简单的博客生成工具，专为机器人团队设计
 */

const { program } = require('commander');
const path = require('path');
const fs = require('fs-extra');

// 读取 package.json
let packageJson = {};
try {
  const packagePath = path.join(__dirname, '../package.json');
  packageJson = fs.readJsonSync(packagePath);
} catch (err) {
  packageJson = {
    name: 'wdr-blog-engine',
    version: '1.0.0',
    description: 'A fast static blog generator'
  };
}

// 导入命令模块
const init = require('../lib/cli/init');
const build = require('../lib/cli/build');
const clean = require('../lib/cli/clean');
const server = require('../lib/cli/server');

// 设置 CLI
program
  .name('wdr')
  .description(packageJson.description || 'A fast static blog generator for robot team')
  .version(packageJson.version || '1.0.0', '-v, --version', '显示版本号');

// 初始化命令
program
  .command('init [dir]')
  .description('初始化一个新的博客项目')
  .action(async (dir) => {
    try {
      await init(dir);
    } catch (error) {
      console.error('Init failed:', error.message);
      process.exit(1);
    }
  });

// 构建命令
program
  .command('build')
  .alias('b')
  .description('构建博客，生成静态文件')
  .action(async () => {
    try {
      await build();
    } catch (error) {
      console.error('Build failed:', error.message);
      process.exit(1);
    }
  });

// 清理命令
program
  .command('clean')
  .description('清理生成的文件（public 目录）')
  .action(async () => {
    try {
      await clean();
    } catch (error) {
      console.error('Clean failed:', error.message);
      process.exit(1);
    }
  });

// 服务器命令
program
  .command('server')
  .alias('s')
  .description('启动本地预览服务器')
  .option('-p, --port <port>', '指定端口号', '4000')
  .action(async (options) => {
    try {
      await server(options);
    } catch (error) {
      console.error('Server failed:', error.message);
      process.exit(1);
    }
  });

// 快速命令（构建 + 服务器）
program
  .command('start')
  .description('构建并启动服务器（开发模式）')
  .option('-p, --port <port>', '指定端口号', '4000')
  .action(async (options) => {
    try {
      console.log('WDR Development Server\n');
      await build();
      console.log('\nStarting server...\n');
      await server(options);
    } catch (error) {
      console.error('Start failed:', error.message);
      process.exit(1);
    }
  });

// 显示帮助信息
program.on('--help', () => {
  console.log('\n示例:');
  console.log('  $ wdr init my-blog');
  console.log('  $ wdr build');
  console.log('  $ wdr server');
  console.log('  $ wdr server --port 3000\n');

  console.log('更多文档: https://github.com/yourteam/wdr');
});

// 解析命令行参数
program.parse(process.argv);

// 如果没有提供命令，显示帮助信息
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
