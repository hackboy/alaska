/**
 * @copyright Maichong Software Ltd. 2016 http://maichong.it
 * @date 2016-02-28
 * @author Liang <liang@maichong.it>
 */

import assert from 'assert';
import * as util from '../util';

export default async function init() {
  this.debug('init');
  this.init = util.resolved;

  try {
    let services = this.config('services') || [];

    for (let serviceId in services) {
      let config = services[serviceId];
      if (!config) continue;
      let sub = this.alaska.service(serviceId, true);
      if (!sub) {
        if (!config.dir) {
          throw new Error(`Can not find sub service '${serviceId}'`);
        } else {
          sub = require(config.dir).default;
        }
      }
      sub.applyConfig(config);
      this._services[serviceId] = sub;
      let configDir = this.dir + '/config/' + serviceId;
      sub.addConfigDir(configDir);
      await sub.init();
    }
  } catch (error) {
    console.error(`${this.id} init field:`, error.message);
    throw error;
  }
};
