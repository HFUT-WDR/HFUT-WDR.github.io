const path = require('path');
const { copy, exists, ensureDir } = require('../utils/file');

class AssetManager {
  constructor(config, themePath) {
    this.config = config;
    this.themePath = themePath;
    this.publicDir = config.public_dir || 'public';
  }

  /**
   * 复制主题静态资源
   */
  async copyThemeAssets() {
    console.log('Copying theme assets...');

    const themeSourceDir = path.join(this.themePath, 'source');
    const themeExists = await exists(themeSourceDir);

    if (themeExists) {
      await copy(themeSourceDir, this.publicDir);
      console.log('  Theme assets copied successfully!');
    } else {
      console.log('  No theme assets found, skipping...');
    }
  }

  /**
   * 复制用户静态资源
   */
  async copySourceAssets() {
    console.log('Copying user assets...');

    const sourceDir = path.join(this.config.source_dir || 'source');
    const assetDirs = ['images', 'css', 'js', 'files'];

    for (const dir of assetDirs) {
      const sourcePath = path.join(sourceDir, dir);
      const targetPath = path.join(this.publicDir, dir);

      if (await exists(sourcePath)) {
        await copy(sourcePath, targetPath);
        console.log(`  Copied: ${dir}/`);
      }
    }
  }

  /**
   * 复制所有资源
   */
  async copyAll() {
    await this.copyThemeAssets();
    await this.copySourceAssets();
  }

  /**
   * 清理资源
   */
  async clean() {
    console.log('Cleaning assets...');
    // 资源会在 clean 命令中统一清理
  }
}

module.exports = AssetManager;
