const { slugify, postPath, categoryPath, tagPath } = require('../utils/slugify');
const { getYear, getMonth } = require('../utils/date');

class Router {
  constructor(config) {
    this.config = config;
    this.routes = [];
  }

  /**
   * 生成文章路由
   */
  generatePostRoute(article) {
    return {
      path: article.url,
      type: 'post',
      data: article
    };
  }

  /**
   * 生成分页路由
   */
  generatePageRoutes(totalPosts, perPage) {
    const totalPages = Math.ceil(totalPosts / perPage);
    const routes = [];

    for (let page = 1; page <= totalPages; page++) {
      routes.push({
        path: page === 1 ? '/' : `/page/${page}/`,
        type: 'page',
        data: { page }
      });
    }

    return routes;
  }

  /**
   * 生成分类路由
   */
  generateCategoryRoutes(categories, perPage) {
    const routes = [];

    // 分类列表页
    routes.push({
      path: '/categories/',
      type: 'categories',
      data: { categories }
    });

    // 每个分类的详情页
    for (const [name, articles] of Object.entries(categories)) {
      const totalPages = Math.ceil(articles.length / perPage);
      const slug = slugify(name);

      for (let page = 1; page <= totalPages; page++) {
        routes.push({
          path: page === 1 ? `/categories/${slug}/` : `/categories/${slug}/page/${page}/`,
          type: 'category',
          data: {
            category: name,
            slug,
            page
          }
        });
      }
    }

    return routes;
  }

  /**
   * 生成标签路由
   */
  generateTagRoutes(tags, perPage) {
    const routes = [];

    // 标签云页
    routes.push({
      path: '/tags/',
      type: 'tags',
      data: { tags }
    });

    // 每个标签的详情页
    for (const [name, articles] of Object.entries(tags)) {
      const totalPages = Math.ceil(articles.length / perPage);
      const slug = slugify(name);

      for (let page = 1; page <= totalPages; page++) {
        routes.push({
          path: page === 1 ? `/tags/${slug}/` : `/tags/${slug}/page/${page}/`,
          type: 'tag',
          data: {
            tag: name,
            slug,
            page
          }
        });
      }
    }

    return routes;
  }

  /**
   * 生成归档路由
   */
  generateArchiveRoute() {
    return {
      path: '/archive/',
      type: 'archive',
      data: {}
    };
  }

  /**
   * 生成所有路由
   */
  generateAll(articles, categories, tags) {
    this.routes = [];

    // 首页和分页
    const perPage = this.config.per_page || 10;
    this.routes.push(...this.generatePageRoutes(articles.length, perPage));

    // 文章详情页
    articles.forEach(article => {
      this.routes.push(this.generatePostRoute(article));
    });

    // 归档页
    this.routes.push(this.generateArchiveRoute());

    // 分类页
    this.routes.push(...this.generateCategoryRoutes(categories, perPage));

    // 标签页
    this.routes.push(...this.generateTagRoutes(tags, perPage));

    return this.routes;
  }

  /**
   * 获取所有路由
   */
  getRoutes() {
    return this.routes;
  }

  /**
   * 根据路径查找路由
   */
  findRoute(path) {
    return this.routes.find(route => route.path === path);
  }
}

module.exports = Router;
