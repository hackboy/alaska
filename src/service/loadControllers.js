/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-02-28
 * @author Liang <liang@maichong.it>
 */

import * as util from '../util';
import _ from 'lodash';
import compose from 'koa-compose';

export default async function loadControllers() {
  this.loadControllers = util.resolved;

  for (let serviceId in this._services) {
    let sub = this._services[serviceId];
    await sub.loadControllers();
  }
  if (this.config('prefix') === false || this.config('controllers') === false) return;
  this.debug('loadControllers');

  const service = this;

  const controllers = this._controllers = util.include(this.dir + '/controllers', false) || {};

  this._configDirs.forEach(dir => {
    dir += '/controllers';
    if (util.isDirectory(dir)) {
      let patches = util.include(dir, false) || {};
      _.forEach(patches, (patch, c) => {
        if (!controllers[c]) {
          controllers[c] = {};
        }
        _.forEach(patch, (fn, name) => {
          if (name[0] === '_' || typeof fn !== 'function') return;
          if (!controllers[c][name]) {
            controllers[c][name] = fn;
          } else if (typeof controllers[c][name] === 'function') {
            controllers[c][name] = [fn, controllers[c][name]];
          } else if (Array.isArray(controllers[c][name])) {
            controllers[c][name].unshift(fn);
          }
        });
      });
    }
  });

  //将某些控制器的多个中间件转换成一个
  _.forEach(controllers, ctrl => {
    _.forEach(ctrl, (fn, key) => {
      if (Array.isArray(fn) && key[0] !== '_') {
        ctrl[key] = compose(fn);
      }
    });
  });

  const defaultController = this.config('defaultController');
  const defaultAction = this.config('defaultAction');

  const suffix = this.config('suffix');
  this.router.register('/:controller?/:action?', this.config('methods'), function (ctx, next) {
    let controller = ctx.params.controller || defaultController;
    let action = ctx.params.action || defaultAction;
    if (suffix && action && action.endsWith(suffix)) {
      action = action.substr(0, action.length - suffix.length);
    }
    service.debug('route %s:%s', controller, action);
    if (service._controllers[controller] && service._controllers[controller][action] && action[0] !== '_') {
      //TODO 错误页面
      return service._controllers[controller][action](ctx, next);
    }
    return next();
  });//end of register
};
