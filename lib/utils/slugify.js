const slugifyLib = require('slugify');

/**
 * 将文本转换为 URL 友好的格式
 * @param {string} text - 要转换的文本
 * @param {object} options - 配置选项
 * @returns {string} slug 字符串
 */
function slugify(text, options = {}) {
  const defaultOptions = {
    lower: true,
    strict: true,
    locale: 'zh',
    ...options
  };

  return slugifyLib(text || 'untitled', defaultOptions);
}

/**
 * 生成文章 URL 路径
 */
function postPath(year, month, slug) {
  const y = String(year).padStart(4, '0');
  const m = String(month).padStart(2, '0');
  return `${y}/${m}/${slug}.html`;
}

/**
 * 生成分页路径
 */
function pagePath(pageNum) {
  return pageNum === 1 ? '/' : `/page/${pageNum}/`;
}

/**
 * 生成分类路径
 */
function categoryPath(name) {
  return `/categories/${slugify(name)}/`;
}

/**
 * 生成标签路径
 */
function tagPath(name) {
  return `/tags/${slugify(name)}/`;
}

module.exports = {
  slugify,
  postPath,
  pagePath,
  categoryPath,
  tagPath
};
