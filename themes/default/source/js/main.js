/**
 * WDR 主题 JavaScript
 * 提供交互功能和用户体验增强
 */

(function() {
  'use strict';

  // ===== 平滑滚动 =====
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#top') {
          e.preventDefault();
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        } else {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      });
    });
  }

  // ===== 返回顶部按钮 =====
  function initBackToTop() {
    const button = document.createElement('button');
    button.innerHTML = '↑';
    button.className = 'back-to-top';
    button.setAttribute('aria-label', '返回顶部');

    document.body.appendChild(button);

    // 显示/隐藏按钮
    let lastScrollY = window.scrollY;
    const showThreshold = 300;

    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > showThreshold) {
        button.classList.add('show');
      } else {
        button.classList.remove('show');
      }

      lastScrollY = currentScrollY;
    });

    // 点击返回顶部
    button.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ===== 代码高亮增强 =====
  function initCodeHighlight() {
    if (typeof hljs !== 'undefined') {
      hljs.highlightAll();

      // 添加语言标签
      document.querySelectorAll('pre code[class*="language-"]').forEach(block => {
        const lang = block.className.replace('language-', '').replace('hljs', '');
        if (lang) {
          const pre = block.parentElement;
          const label = document.createElement('div');
          label.className = 'code-language-label';
          label.textContent = lang;
          pre.style.position = 'relative';
          pre.insertBefore(label, block);
        }
      });
    }
  }

  // ===== 图片懒加载 =====
  function initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;

            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
            }

            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      // 观察所有带有 data-src 的图片
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    } else {
      // 降级处理：直接加载所有图片
      document.querySelectorAll('img[data-src]').forEach(img => {
        img.src = img.dataset.src;
        img.classList.add('loaded');
      });
    }
  }

  // ===== 图片灯箱效果 =====
  function initLightbox() {
    const images = document.querySelectorAll('.post-content img');

    images.forEach(img => {
      img.style.cursor = 'pointer';

      img.addEventListener('click', function() {
        const overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';
        overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.3s;
        `;

        const clonedImg = img.cloneNode();
        clonedImg.style.cssText = `
          max-width: 90%;
          max-height: 90%;
          object-fit: contain;
          cursor: default;
        `;

        overlay.appendChild(clonedImg);
        document.body.appendChild(overlay);

        // 渐入效果
        setTimeout(() => {
          overlay.style.opacity = '1';
        }, 10);

        // 点击关闭
        overlay.addEventListener('click', function() {
          overlay.style.opacity = '0';
          setTimeout(() => {
            document.body.removeChild(overlay);
          }, 300);
        });
      });
    });
  }

  // ===== 阅读进度条 =====
  function initReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress-bar';
    progressBar.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      background: linear-gradient(135deg, #0066cc, #00d4ff);
      z-index: 1000;
      transition: width 0.1s;
      width: 0%;
    `;

    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (window.scrollY / windowHeight) * 100;
      progressBar.style.width = scrolled + '%';
    });
  }

  // ===== 表格响应式处理 =====
  function initTableWrapper() {
    document.querySelectorAll('.post-content table').forEach(table => {
      const wrapper = document.createElement('div');
      wrapper.className = 'table-wrapper';
      wrapper.style.cssText = `
        overflow-x: auto;
        margin: 1.5rem 0;
        border-radius: 6px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      `;

      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });
  }

  // ===== 外部链接新窗口打开 =====
  function initExternalLinks() {
    document.querySelectorAll('a[href^="http"]').forEach(link => {
      if (!link.href.includes(window.location.hostname)) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.setAttribute('aria-label', '在新窗口打开');
      }
    });
  }

  // ===== 搜索功能（可选）=====
  function initSearch() {
    const searchInput = document.querySelector('#search-input');

    if (searchInput) {
      let searchTimeout;

      searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        const query = this.value.trim().toLowerCase();

        searchTimeout = setTimeout(() => {
          const posts = document.querySelectorAll('.post-card, .post-item');

          posts.forEach(post => {
            const title = post.querySelector('.post-title');
            const excerpt = post.querySelector('.post-excerpt');
            const text = (title.textContent + ' ' + excerpt.textContent).toLowerCase();

            if (text.includes(query)) {
              post.style.display = '';
            } else {
              post.style.display = 'none';
            }
          });
        }, 300);
      });
    }
  }

  // ===== 阅读时间估算 =====
  function initReadingTime() {
    const postContent = document.querySelector('.post-content');

    if (postContent && !postContent.querySelector('.reading-time')) {
      const text = postContent.textContent || postContent.innerText;
      const wordsPerMinute = 200;
      const words = text.trim().split(/\s+/).length;
      const minutes = Math.ceil(words / wordsPerMinute);

      const readingTime = document.createElement('div');
      readingTime.className = 'reading-time';
      readingTime.style.cssText = `
        color: #666;
        font-size: 0.9rem;
        margin-bottom: 1.5rem;
      `;
      readingTime.textContent = `预计阅读时间: ${minutes} 分钟`;

      postContent.insertBefore(readingTime, postContent.firstChild);
    }
  }

  // ===== 深色模式切换（可选）=====
  function initDarkMode() {
    const toggle = document.querySelector('.dark-mode-toggle');

    if (toggle) {
      // 检查本地存储或系统偏好
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const savedMode = localStorage.getItem('dark-mode');
      const isDark = savedMode ? savedMode === 'dark' : prefersDark;

      if (isDark) {
        document.documentElement.classList.add('dark-mode');
      }

      toggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark-mode');
        const mode = document.documentElement.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('dark-mode', mode);
      });
    }
  }

  // ===== 初始化所有功能 =====
  function init() {
    // 页面加载完成后执行
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initAllFeatures();
      });
    } else {
      initAllFeatures();
    }
  }

  function initAllFeatures() {
    initSmoothScroll();
    initBackToTop();
    initCodeHighlight();
    initLazyLoading();
    initLightbox();
    initReadingProgress();
    initTableWrapper();
    initExternalLinks();
    initSearch();
    initReadingTime();
    initDarkMode();

    console.log('WDR Theme initialized');
  }

  // 启动
  init();

})();
