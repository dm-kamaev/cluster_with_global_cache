'use strict';

module.exports = class Driver_cache {
  constructor(listeners) {
    this._listeners = listeners;
  }

  async set(data) {
    data.__event_name__ = 'set';
    return process_send(data);
  }

  async get(key) {
    process_get(key);
    return listen_res(this._listeners, key);
  }
};


function process_send(data) {
  return new Promise((resolve) => {
    process.send(data, function() {
      resolve();
    });
  });
}


async function process_get(key) {
  await process_send({
    __event_name__: 'get',
    body: {
      key: key,
    }
  });
}


async function listen_res(listeners, key) {
  var handler = function (key) {
    let resolve;
    let reject;

    var get = new Promise((_resolve, _reject) => {
      resolve = _resolve;
      reject = _reject;
    });

    var set_data = function (msg) {
      resolve(msg);
    };

    var set_reject = function (str) {
      reject('Not found key = '+key+ ' '+str);
    };

    return {
      get,
      set_data,
      set_reject
    };
  };

  var h = handler(key);
  listeners[key] = h;
  var res = await h.get;

  listeners[key] = null;
  return res[key];
}

