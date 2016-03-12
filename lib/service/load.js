'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-02-28
 * @author Liang <liang@maichong.it>
 */

const util = require('../util');

module.exports = function () {
  var ref = _asyncToGenerator(function* () {
    this.debug('%s load', this.id);
    this.load = util.noop;

    for (let service of this._services) {
      yield service.loadModels();
    }

    if (this.config('db') !== false) {
      global.__service = this;
      this._models = util.include(this.dir + '/models');
      //遍历模型
      for (let name in this._models) {
        let Model = this._models[name];
        //加载扩展配置
        for (let dir of this._configDirs) {
          let file = dir + '/models/' + name + '.js';
          if (util.isFile(file)) {
            let ext = require(file);
            ['fields', 'groups', 'api'].forEach(key => {
              if (typeof ext[key] !== 'undefined') {
                _.assign(Model[key], ext[key]);
              }
            });
            //扩展模型事件
            ['Init', 'Validate', 'Save', 'Remove'].forEach(Action => {
              let pre = ext['pre' + Action];
              if (pre) {
                Model.pre(Action.toLowerCase(), pre);
              }
              let post = ext['post' + Action];
              if (post) {
                Model.post(Action.toLowerCase(), post);
              }
            });
            if (ext['default']) {
              ext['default'](Model);
            }
          }
        } //end of 加载扩展配置
        yield this.registerModel(Model);
      } //end of 遍历模型
    }
  });

  return function loadModels() {
    return ref.apply(this, arguments);
  };
}();