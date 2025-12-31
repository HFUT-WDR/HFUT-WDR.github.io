const fs = require('fs-extra');
const path = require('path');

/**
 * 确保目录存在，不存在则创建
 */
async function ensureDir(dirPath) {
  await fs.ensureDir(dirPath);
}

/**
 * 递归读取目录下所有文件
 */
async function readDirRecursive(dirPath, ext = '.md') {
  const files = [];
  const items = await fs.readdir(dirPath);

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const stat = await fs.stat(fullPath);

    if (stat.isDirectory()) {
      const subFiles = await readDirRecursive(fullPath, ext);
      files.push(...subFiles);
    } else if (path.extname(item) === ext) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * 读取文件内容
 */
async function readFile(filePath) {
  return await fs.readFile(filePath, 'utf-8');
}

/**
 * 写入文件
 */
async function writeFile(filePath, content) {
  await fs.ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, 'utf-8');
}

/**
 * 复制文件或目录
 */
async function copy(src, dest) {
  await fs.copy(src, dest);
}

/**
 * 删除文件或目录
 */
async function remove(targetPath) {
  await fs.remove(targetPath);
}

/**
 * 检查文件是否存在
 */
async function exists(filePath) {
  return await fs.pathExists(filePath);
}

/**
 * 清空目录
 */
async function emptyDir(dirPath) {
  await fs.emptyDir(dirPath);
}

module.exports = {
  ensureDir,
  readDirRecursive,
  readFile,
  writeFile,
  copy,
  remove,
  exists,
  emptyDir
};
