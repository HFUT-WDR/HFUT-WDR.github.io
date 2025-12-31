/**
 * 日期格式化工具
 */

/**
 * 格式化日期
 * @param {Date|string} date - 日期对象或字符串
 * @param {string} format - 格式字符串 (YYYY-MM-DD HH:mm:ss)
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(d.getTime())) {
    return '';
  }

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', year)
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 获取日期的年份
 */
function getYear(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.getFullYear();
}

/**
 * 获取日期的月份（1-12）
 */
function getMonth(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.getMonth() + 1;
}

/**
 * 获取日期的日
 */
function getDate(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.getDate();
}

/**
 * 计算两个日期之间的时间差（毫秒）
 */
function dateDiff(date1, date2) {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  return Math.abs(d1 - d2);
}

/**
 * ISO 日期格式
 */
function toISOString(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString();
}

module.exports = {
  formatDate,
  getYear,
  getMonth,
  getDate,
  dateDiff,
  toISOString
};
