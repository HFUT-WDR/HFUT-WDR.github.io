const path = require('path');
const { exists, remove } = require('../utils/file');

/**
 * 清理命令
 */
async function clean() {
  console.log('WDR Clean');
  console.log('==========\n');

  const publicDir = path.resolve('public');

  try {
    if (await exists(publicDir)) {
      console.log(`Removing: ${publicDir}`);

      await remove(publicDir);

      console.log('\n✓ Clean completed!');
      console.log('The public directory has been removed.');
    } else {
      console.log('No public directory found. Nothing to clean.');
    }

  } catch (error) {
    console.error('\n✗ Clean failed:', error.message);
    process.exit(1);
  }
}

module.exports = clean;
