const path = require('path');
const TemplateEngine = require('../template/engine');
const processor = require('./processor');
const { writeFile, ensureDir } = require('../utils/file');
const { pagePath } = require('../utils/slugify');

class Generator {
  constructor(config, themePath) {
    this.config = config;
    this.themePath = themePath;
    this.engine = new TemplateEngine(themePath);
    this.publicDir = config.public_dir || 'public';
  }

  /**
   * 生成所有页面
   */
  async generate(articles) {
    console.log('Generating pages...');

    // 按日期排序文章
    const sortedArticles = processor.sortByDate(articles);

    // 生成首页
    await this.generateIndex(sortedArticles);

    // 生成文章详情页
    await this.generatePosts(articles, sortedArticles);

    // 生成归档页
    await this.generateArchive(sortedArticles);

    // 生成分类页
    await this.generateCategories(sortedArticles);

    // 生成标签页
    await this.generateTags(sortedArticles);

    console.log('Pages generated successfully!');
  }

  /**
   * 生成首页
   */
  async generateIndex(articles) {
    console.log('Generating index...');

    const perPage = this.config.per_page || 10;
    const totalPages = Math.ceil(articles.length / perPage);

    for (let page = 1; page <= totalPages; page++) {
      const start = (page - 1) * perPage;
      const end = start + perPage;
      const pageArticles = articles.slice(start, end);

      const pagination = {
        current: page,
        total: totalPages,
        prev: page > 1 ? pagePath(page - 1) : null,
        next: page < totalPages ? pagePath(page + 1) : null
      };

      const html = await this.engine.render('index', {
        site: this.config,
        page: {
          title: this.config.title
        },
        posts: pageArticles,
        pagination
      });

      const outputPath = page === 1
        ? path.join(this.publicDir, 'index.html')
        : path.join(this.publicDir, 'page', String(page), 'index.html');

      await writeFile(outputPath, html);
      console.log(`  Generated: ${outputPath}`);
    }
  }

  /**
   * 生成文章详情页
   */
  async generatePosts(articles, sortedArticles) {
    console.log('Generating post pages...');

    for (const article of articles) {
      const adjacent = processor.getAdjacentArticles(sortedArticles, article);

      const html = await this.engine.render('post', {
        site: this.config,
        page: article,
        posts: sortedArticles,
        adjacent
      });

      const outputPath = path.join(this.publicDir, article.url);
      await writeFile(outputPath, html);
      console.log(`  Generated: ${outputPath}`);
    }
  }

  /**
   * 生成归档页
   */
  async generateArchive(articles) {
    console.log('Generating archive page...');

    const archive = processor.groupByDate(articles);

    const html = await this.engine.render('archive', {
      site: this.config,
      page: {
        title: '归档'
      },
      posts: articles,
      archive
    });

    const outputPath = path.join(this.publicDir, 'archive', 'index.html');
    await writeFile(outputPath, html);
    console.log(`  Generated: ${outputPath}`);
  }

  /**
   * 生成分类页
   */
  async generateCategories(articles) {
    console.log('Generating category pages...');

    const categories = processor.groupByCategory(articles);
    const perPage = this.config.per_page || 10;

    // 生成分类列表页
    const listHtml = await this.engine.render('category', {
      site: this.config,
      page: {
        title: '分类'
      },
      posts: articles,
      categories
    });

    await writeFile(path.join(this.publicDir, 'categories', 'index.html'), listHtml);
    console.log(`  Generated: categories/index.html`);

    // 生成每个分类的详情页
    for (const [name, categoryArticles] of Object.entries(categories)) {
      const totalPages = Math.ceil(categoryArticles.length / perPage);

      for (let page = 1; page <= totalPages; page++) {
        const start = (page - 1) * perPage;
        const end = start + perPage;
        const pageArticles = categoryArticles.slice(start, end);

        const pagination = {
          current: page,
          total: totalPages,
          prev: page > 1 ? `./page/${page - 1}/` : null,
          next: page < totalPages ? `./page/${page + 1}/` : null
        };

        const html = await this.engine.render('category', {
          site: this.config,
          page: {
            title: name
          },
          category: name,
          posts: pageArticles,
          categories,
          pagination
        });

        const slug = require('../utils/slugify').slugify(name);
        const outputPath = page === 1
          ? path.join(this.publicDir, 'categories', slug, 'index.html')
          : path.join(this.publicDir, 'categories', slug, 'page', String(page), 'index.html');

        await writeFile(outputPath, html);
        console.log(`  Generated: ${outputPath}`);
      }
    }
  }

  /**
   * 生成标签页
   */
  async generateTags(articles) {
    console.log('Generating tag pages...');

    const tags = processor.groupByTag(articles);
    const perPage = this.config.per_page || 10;

    // 生成标签云页
    const cloudHtml = await this.engine.render('tag', {
      site: this.config,
      page: {
        title: '标签'
      },
      posts: articles,
      tags
    });

    await writeFile(path.join(this.publicDir, 'tags', 'index.html'), cloudHtml);
    console.log(`  Generated: tags/index.html`);

    // 生成每个标签的详情页
    for (const [name, tagArticles] of Object.entries(tags)) {
      const totalPages = Math.ceil(tagArticles.length / perPage);

      for (let page = 1; page <= totalPages; page++) {
        const start = (page - 1) * perPage;
        const end = start + perPage;
        const pageArticles = tagArticles.slice(start, end);

        const pagination = {
          current: page,
          total: totalPages,
          prev: page > 1 ? `./page/${page - 1}/` : null,
          next: page < totalPages ? `./page/${page + 1}/` : null
        };

        const html = await this.engine.render('tag', {
          site: this.config,
          page: {
            title: name
          },
          tag: name,
          posts: pageArticles,
          tags,
          pagination
        });

        const slug = require('../utils/slugify').slugify(name);
        const outputPath = page === 1
          ? path.join(this.publicDir, 'tags', slug, 'index.html')
          : path.join(this.publicDir, 'tags', slug, 'page', String(page), 'index.html');

        await writeFile(outputPath, html);
        console.log(`  Generated: ${outputPath}`);
      }
    }
  }
}

module.exports = Generator;
