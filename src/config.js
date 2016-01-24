/**
 * config.js
 * @copyright Maichong Software Ltd. 2015 http://maichong.it
 * @date 2015-11-18
 * @author Liang <liang@maichong.it>
 */

/**
 * 默认配置
 * @module config
 */
module.exports = {
  //
  // APP settings
  //

  /**
   * [APP] APP名称
   * @type {string}
   */
  name: 'anyway',

  /**
   * [APP] APP中间件列表
   * @type {Array}
   */
  appMiddlewares: [],

  /**
   * [APP] 监听端口
   * @type {number}
   */
  port: 5000,

  /**
   * [APP] 运行环境
   * @type {string}
   */
  env: 'development',
  //
  // KOA settings
  //

  /**
   * [KOA] 代理模式
   * @type {Boolean}
   */
  proxy: false,

  /**
   * [KOA] 子域名
   * @type {number}
   */
  subdomainOffset: 2,
  //
  // Service settings
  //

  /**
   * [Service] 别名列表
   * @type {Array}
   */
  alias: [],

  /**
   * [Service] 域名,如果不指定,子Service将使用主Service的域名
   * 例如 docs.google.com *.58.com
   * 如果设置为泛域名,则koa.Context 对象将有subdomian变量
   * @type {string}
   */
  domain: '',
  /**
   * [Service] 跳转地址,如果主域名不匹配将跳转至此地址
   * @type {string}
   */
  redirect: '',
  /**
   * [Service] Service的URL访问地址PATH中前缀
   * @type {string}
   */
  prefix: '',
  /** [Service] 默认控制器名称
   * @type {string}
   */
  defaultController: 'index',
  /**
   * [Service] 控制器中默认Action名称
   * @type {string}
   */
  defaultAction: 'index',
  /**
   * [Service] 控制器路由接受的HTTP方法列表
   * @type {Array}
   */
  methods: ['GET', 'POST'],
  /**
   * [Service] 该Service依赖的子Service列表
   * @type {Array}
   */
  services: [],
  /**
   * [Service] 该Service的路由中间件
   * @type {Array}
   */
  middlewares: [],
  /**
   * [Service] 数据库链接设置
   * 如果为false则表明该Service不使用数据库链接
   * 如果不配置,则使用主Service的链接
   * @type {Boolean|string}
   */
  db: '',
  /**
   * 是否开启控制器路由
   * @type {Boolean}
   */
  controllers: true,
  /**
   * 是否开启rest api
   * @type {Boolean}
   */
  api: true,

};