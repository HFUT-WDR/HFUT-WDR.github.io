const { marked } = require('marked');
const matter = require('gray-matter');
const hljs = require('highlight.js');
const path = require('path');
const { slugify, postPath } = require('../utils/slugify');
const { formatDate, getYear, getMonth } = require('../utils/date');

// 配置 marked 选项
marked.use({
  breaks: true,
  gfm: true,
  renderer: {
    code(code, language) {
      const validLang = language && hljs.getLanguage(language);
      const highlighted = validLang
        ? hljs.highlight(code, { language }).value
        : hljs.highlightAuto(code).value;

      return `<pre><code class="hljs language-${language || 'plaintext'}">${highlighted}</code></pre>`;
    }
  }
});

/**
 * 文章类
 */
class Article {
  constructor(data, content, filePath) {
    this.title = data.title || 'Untitled';
    this.date = data.date ? new Date(data.date) : new Date();
    this.author = data.author || 'Anonymous';
    this.categories = data.categories || [];
    this.tags = data.tags || [];
    this.cover = data.cover || null;
    this.description = data.description || null;
    this.rawContent = content;
    this.path = filePath;

    // 转换 Markdown 为 HTML
    this.content = marked.parse(content);

    // 生成摘要
    this.excerpt = this.extractExcerpt();

    // 生成 slug
    this.slug = slugify(this.title);

    // 生成 URL 路径
    this.url = postPath(getYear(this.date), getMonth(this.date), this.slug);

    // 格式化日期字符串
    this.dateString = formatDate(this.date, 'YYYY-MM-DD HH:mm:ss');
  }

  /**
   * 提取文章摘要
   */
  extractExcerpt(length = 150) {
    // 移除 HTML 标签
    const text = this.content.replace(/<[^>]*>/g, '').trim();

    if (text.length <= length) {
      return text;
    }

    // 找到最近的单词边界
    let truncated = text.substring(0, length);
    const lastSpace = truncated.lastIndexOf(' ');

    if (lastSpace > 0) {
      truncated = truncated.substring(0, lastSpace);
    }

    return truncated + '...';
  }

  /**
   * 获取文章字数
   */
  get wordCount() {
    return this.rawContent.split(/\s+/).length;
  }

  /**
   * 获取阅读时间（分钟）
   */
  get readingTime() {
    const wordsPerMinute = 200;
    return Math.ceil(this.wordCount / wordsPerMinute);
  }
}

/**
 * 处理器类
 */
class Processor {
  /**
   * 解析 Markdown 文件
   */
  parse(filePath, content) {
    try {
      // 解析 front matter
      const { data, content: markdown } = matter(content);

      // 创建文章对象
      const article = new Article(data, markdown, filePath);

      return article;
    } catch (error) {
      console.error(`Error parsing ${filePath}:`, error.message);
      throw error;
    }
  }

  /**
   * 批量解析多个文件
   */
  async parseMultiple(files) {
    const articles = [];

    for (const file of files) {
      try {
        const { readFile } = require('../utils/file');
        const content = await readFile(file);
        const article = this.parse(file, content);
        articles.push(article);
      } catch (error) {
        console.error(`Failed to parse ${file}:`, error.message);
      }
    }

    return articles;
  }

  /**
   * 按日期排序文章（最新的在前）
   */
  sortByDate(articles, order = 'desc') {
    return articles.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return order === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }

  /**
   * 按分类分组文章
   */
  groupByCategory(articles) {
    const groups = {};

    for (const article of articles) {
      for (const category of article.categories) {
        if (!groups[category]) {
          groups[category] = [];
        }
        groups[category].push(article);
      }
    }

    // 对每个分类内的文章按日期排序
    for (const category in groups) {
      groups[category] = this.sortByDate(groups[category]);
    }

    return groups;
  }

  /**
   * 按标签分组文章
   */
  groupByTag(articles) {
    const groups = {};

    for (const article of articles) {
      for (const tag of article.tags) {
        if (!groups[tag]) {
          groups[tag] = [];
        }
        groups[tag].push(article);
      }
    }

    // 对每个标签内的文章按日期排序
    for (const tag in groups) {
      groups[tag] = this.sortByDate(groups[tag]);
    }

    return groups;
  }

  /**
   * 按年月分组文章（用于归档）
   */
  groupByDate(articles) {
    const groups = {};

    for (const article of articles) {
      const year = getYear(article.date);
      const month = getMonth(article.date);
      const key = `${year}-${String(month).padStart(2, '0')}`;

      if (!groups[key]) {
        groups[key] = {
          year,
          month,
          articles: []
        };
      }

      groups[key].articles.push(article);
    }

    // 排序
    const sortedKeys = Object.keys(groups).sort().reverse();
    const sortedGroups = {};

    for (const key of sortedKeys) {
      sortedGroups[key] = {
        ...groups[key],
        articles: this.sortByDate(groups[key].articles)
      };
    }

    return sortedGroups;
  }

  /**
   * 获取相邻文章
   */
  getAdjacentArticles(articles, currentArticle) {
    const sorted = this.sortByDate([...articles]);
    const index = sorted.findIndex(a => a.path === currentArticle.path);

    return {
      prev: index > 0 ? sorted[index - 1] : null,
      next: index < sorted.length - 1 ? sorted[index + 1] : null
    };
  }
}

module.exports = new Processor();
