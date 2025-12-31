const ejs = require('ejs');
const path = require('path');
const { readFile } = require('../utils/file');
const { formatDate, getYear, getMonth } = require('../utils/date');
const { slugify } = require('../utils/slugify');

class TemplateEngine {
  constructor(themePath) {
    this.themePath = themePath;
    this.layoutDir = path.join(themePath, 'layout');
  }

  /**
   * 渲染模板
   */
  async render(templateName, data, options = {}) {
    const { layout = 'layout', locals = {} } = options;

    // 添加辅助函数
    const helpers = {
      date: formatDate,
      slug: slugify,
      year: getYear,
      month: getMonth,
      ...locals
    };

    const templateData = {
      ...data,
      ...helpers
    };

    try {
      // 如果使用布局
      if (layout) {
        const layoutPath = path.join(this.layoutDir, `${layout}.ejs`);
        const templatePath = path.join(this.layoutDir, `${templateName}.ejs`);

        const layoutContent = await readFile(layoutPath);
        const templateContent = await readFile(templatePath);

        // 先渲染页面模板
        const body = ejs.render(templateContent, templateData, {
          filename: templatePath,
          root: this.layoutDir
        });

        // 再渲染布局
        return ejs.render(layoutContent, {
          ...templateData,
          body
        }, {
          filename: layoutPath,
          root: this.layoutDir
        });
      } else {
        // 不使用布局，直接渲染
        const templatePath = path.join(this.layoutDir, `${templateName}.ejs`);
        const templateContent = await readFile(templatePath);

        return ejs.render(templateContent, templateData, {
          filename: templatePath,
          root: this.layoutDir
        });
      }
    } catch (error) {
      console.error(`Error rendering template ${templateName}:`, error.message);
      throw error;
    }
  }

  /**
   * 编译模板（用于批量渲染优化）
   */
  async compile(templateName) {
    const templatePath = path.join(this.layoutDir, `${templateName}.ejs`);
    const templateContent = await readFile(templatePath);

    return ejs.compile(templateContent, {
      filename: templatePath,
      root: this.layoutDir
    });
  }

  /**
   * 渲染字符串模板
   */
  renderString(templateStr, data) {
    const helpers = {
      date: formatDate,
      slug: slugify,
      year: getYear,
      month: getMonth
    };

    return ejs.render(templateStr, {
      ...data,
      ...helpers
    });
  }
}

module.exports = TemplateEngine;
