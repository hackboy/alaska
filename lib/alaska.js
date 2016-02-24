'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-01-18
 * @author Liang <liang@maichong.it>
 */

const Koa = require('koa');
const collie = require('collie');
const util = require('./util');

const debug = require('debug')('alaska');
let defaultAlaska;

/**
 * Alaska主类,一个项目运行时可以实例化多个Alaska对象,每个Alaska对象会监听一个端口
 * 默认情况下通过 `require('alaska')` 获取默认Alaska实例
 * ```javascript
 * const alaska = require('alaska');
 *
 * alaska.start('blog').then(function(){
 *     console.log('blog started');
 * });
 *
 * let other = new alaska.Alaska();
 * other.start('shop').then(function(){
 *     console.log('shop started);
 * });
 * ```
 * @extends events.EventEmitter
 */
class Alaska {

  /**
   * 初始化一个新的Alaska实例对象
   * @constructor
   * @fires Alaska#create
   */


  /**
   * 允许资源所有者访问接口
   */


  /**
   * 允许所有用户访问接口
   */


  /**
   * HTTP状态码422 REST接口create/update数据验证失败
   */


  /**
   * HTTP状态码404 REST接口show/list请求的资源不存在
   */


  /**
   * HTTP状态码401 REST接口未授权
   */


  /**
   * HTTP状态码204 REST接口remove成功
   */


  /**
   * HTTP状态码200 REST接口show/list方法成功
   */
  constructor() {
    this.OK = 200;
    this.CREATED = 201;
    this.NO_CONTENT = 204;
    this.BAD_REQUEST = 400;
    this.UNAUTHORIZED = 401;
    this.FORBIDDEN = 403;
    this.NOT_FOUND = 404;
    this.METHOD_NOT_ALLOWED = 405;
    this.UNPROCESSABLE_ENTITY = 422;
    this.CLOSED = 0;
    this.PUBLIC = 1;
    this.AUTHENTICATED = 2;
    this.OWNER = 3;
    this._loaded = false;
    this._routed = false;
    this._started = false;
    this._app = null;
    this._services = {};
    this.noop = util.noop;
    this.Alaska = Alaska;

    debug('constructor');
    collie(this, 'launch');
    collie(this, 'registerService');
    this.Service = require('./service');
    this.defaultAlaska = defaultAlaska ? defaultAlaska : this;
  }

  /**
   * 返回当前koa APP对象
   * @returns {koa.Application}
   */


  /**
   * 允许已经认证的用户访问接口
   */


  /**
   * 接口关闭
   * @type {number}
   */


  /**
   * HTTP状态码405 REST接口HTTP方法不允许
   */


  /**
   * HTTP状态码403 REST已授权,但是没有权限
   */


  /**
   * HTTP状态码400 REST接口create/update请求未识别,错误的请求
   */


  /**
   * HTTP状态码201 REST接口create/update成功
   */
  app() {
    if (!this._app) {
      this._app = new Koa();
      this._app.name = this.config('name');
      this._app.env = this.config('env');
      this._app.proxy = this.config('proxy');
      this._app.subdomainOffset = this.config('subdomainOffset');
    }
    return this._app;
  }

  /**
   * 获取本Alaska实例中注册的Service
   * @param  {string} id Service ID 或 别名
   * @return {Service|null}
   */
  service(id) {
    let service = this._services[id];

    if (!service) {
      try {
        let ServiceClass = require(id).default;
        service = new ServiceClass({}, this);
      } catch (error) {
        console.error('Load service "%s" failed', id);
        console.error(error.stack);
        process.exit();
      }
    }
    return service;
  }

  /**
   * 注册新的Service
   * @fires Alaska#registerService
   * @param {Service} service Service对象
   */
  registerService(service) {
    if (!this._mainService) {
      this._mainService = service;
    }
    this._services[service.id] = service;
  }

  /**
   * 获取当前Alaska实例的主Service
   * @returns {Service}
   */
  mainService() {
    return this._mainService;
  }

  /**
   * 获取当前Alaska实例的主Service配置
   * @param {string} path 配置名
   * @param {*} [defaultValue] 默认值
   * @returns {*}
   */
  config(path, defaultValue) {
    return this._mainService.config(path, defaultValue);
  }

  /**
   * 定义或者找回此Alaska实例下的Model
   * @param {string} name 模型名称
   * @param {Object} [options] 模型定义
   * @returns {Model|null}
   */
  model(name, options) {}

  /**
   * 获取当前主配置的数据库链接
   * @returns {mongoose.Connection | null}
   */
  db() {
    return this._mainService.db();
  }

  /**
   * 启动Alaska实例
   * @fires Alaska#start
   * @param {string|Object} options 默认Service配置信息,此参数将传递给Service的初始化函数
   * @returns {Promise}
   */
  launch(options) {
    var _this = this;

    return _asyncToGenerator(function* () {
      _this.launch = util.noop;
      debug('launch');

      if (!_this._mainService) {
        _this._mainService = new _this.Service(options, _this);
      }

      yield _this._mainService.init();
      yield _this._mainService.load();
      yield _this._mainService.route();
      yield _this._mainService.launch();

      _this.app().listen(_this.config('port'));
    })();
  }

  /**
   * 输出Alaska实例JSON调试信息
   * @returns {Object}
   */
  toJSON() {
    return {
      services: Object.keys(this._services)
    };
  }
}

defaultAlaska = new Alaska();
defaultAlaska.default = defaultAlaska;

module.exports = defaultAlaska;