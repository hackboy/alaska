/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-01-19
 * @author Liang <liang@maichong.it>
 */

import fs from 'fs';
import _ from 'lodash';

/**
 * 判断指定路径是否是文件
 * @param {string} path
 * @returns {boolean}
 */
export function isFile(path) {
  try {
    return fs.statSync(path).isFile();
  } catch (e) {
    return false;
  }
}

/**
 * 判断指定路径是否是文件夹
 * @param {string} path
 * @returns {boolean}
 */
export function isDirectory(path) {
  try {
    return fs.statSync(path).isDirectory();
  } catch (e) {
    return false;
  }
}

/**
 * 智能导入
 * @param {string} path 文件或文件夹路径
 * @param {boolean} [importDefault]
 * @returns {Object}
 */
export function include(path, importDefault = true) {
  let result = null;
  if (isFile(path)) {
    result = require(path);
    if (importDefault && result.default) {
      result = result.default;
    }
  }
  if (isDirectory(path)) {
    result = {};
    fs.readdirSync(path).forEach(file => {
      if (file.endsWith('.js')) {
        let name = file.slice(0, -3);
        let obj = require(path + '/' + file);
        result[name] = importDefault && obj.default ? obj.default : obj;
      }
    });
  }
  return result;
}

/**
 * 判断某路径是否是隐藏的
 * @param {string} path
 * @returns {boolean}
 */
export function isHidden(path) {
  return /[\\\/]\.\w/.test(path);
}

const _resolved = Promise.resolve();

/**
 * resolved
 * @returns {Promise}
 */
export function resolved() {
  return _resolved;
}

/**
 * noop
 * @returns {Promise}
 */
export function noop() {
}

/**
 * 递归将obj上所有的方法绑定至scope
 * @param {Object} obj
 * @param {Object} scope
 * @returns {Object}
 */
export function bindMethods(obj, scope) {
  let bound = {};
  for (let key in obj) {
    if (typeof obj[key] === 'function') {
      bound[key] = obj[key].bind(scope);
    } else if (_.isObject(obj[key])) {
      bound[key] = bindMethods(obj[key], scope);
    }
  }
  return bound;
}

/**
 * 生成安全的正则字符串
 * @param {string} str
 * @returns {string}
 */
export function escapeRegExp(str) {
  if (str && str.toString) str = str.toString();
  if (typeof str !== 'string' || !str.length) return '';
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

/**
 * 判断字符串是否是合法的ObjectID格式
 * @param {string} input
 * @returns {boolean}
 */
export function isObjectId(input) {
  return /^[a-f0-9]{24}$/.test(input);
}

/**
 * 将驼峰样式字符串转为小写字符串样式
 * @param {string} name
 * @returns {string}
 */
export function nameToKey(name) {
  return name.replace(/([a-z])([A-Z])/g, (a, b, c) => (b + '-' + c.toLowerCase())).toLowerCase();
}

/**
 * 解析Accept Language
 * @param {string} header
 * @returns {Array}
 */
export function pareseAcceptLanguage(header) {
  if (!header) {
    return [];
  }
  return header.split(',').map(item => {
    let lang = item.split(';q=');
    if (lang.length < 2) {
      lang[1] = 1;
    } else {
      lang[1] = parseFloat(lang[1]) || 0;
    }
    return lang;
  }).filter(lang => lang[1] > 0).sort((a, b) => a[1] < b[1]).map(lang => lang[0]);
}
