const cluster = require('cluster');
const http = require('http');

const Driver_cache = require('./Driver_cache.js');

const numCPUs = 2 || require('os').cpus().length;

const hash = {};
if (cluster.isMaster) {

  // let array = create_big_array();
  // setInterval(() => {
  //   console.log('[master] '+process.pid, get_usage_mb());
  //   console.log(array.length);
  // }, 2000);


  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  let cache = {};
  cluster.on('online', function(worker) {
    console.log('Worker ' + worker.process.pid + ' is online');
    worker.on('message', function (msg) {
      let { __event_name__, body } = msg;
      if (__event_name__ === 'set') {
        console.log('[worker '+worker.process.pid+']', msg);
        cache[body.key] = body.val;
      } else if (__event_name__ === 'get') {
        worker.send({
          __event_name__: 'responce_get',
          body: {
            [body.key]: cache[body.key] || null
          }
        });
      }
    });
  });

  cluster.on('exit', function(worker, code, signal) {
    console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
    console.log('Starting a new worker');
    cluster.fork();
  });

} else {

  const listeners = {};

  // let array = create_big_array();
  // setInterval(() => {
  //   console.log('[worker] '+process.pid, get_usage_mb());
  //   console.log(array.length);
  // }, 2000);

  let driver_cache = new Driver_cache(listeners);
  console.log(driver_cache);
  process.on('message', async function (msg) {
    let { __event_name__, body } = msg;
    if (__event_name__ === 'responce_get') {
      let key = Object.keys(body)[0];
      let promise = listeners[key];
      if (promise) {
        promise.set_data(body);
      }
      // else {
      //   console.log();
      //   promise.set_reject('Not found key '+key);
      // }
    }

    console.log('!1', body);
  });

  http.createServer(async function(req, reply) {
    if (req.url === '/set') {
      driver_cache.set({
        body: {
          key: 'Hello',
          val: new Date()
        }
      });
    } else if (req.url === '/get') {
      let res = await driver_cache.get('Hello');
      console.log('res=', res);
    }

    reply.writeHead(200);
    reply.end('process ' + process.pid + ' says hello!'+JSON.stringify(hash, null, 2));
  }).listen(4100);
}




function get_usage_mb() {
  var mU = process.memoryUsage();
  var rssMb = Math.floor(mU.rss / 1000000);
  var heapTotalMb = Math.floor(mU.heapTotal / 1000000);
  var heapUsedMb = Math.floor(mU.heapUsed / 1000000);
  // RSS, сколько занимает в памяти
  return 'rss=' + rssMb + 'Mb  heapTotal=' + heapTotalMb + 'Mb  heapUsed=' + heapUsedMb + 'Mb';
}


// for test size memory
function create_big_array() {
  let array = [];
  for (let i = 0; i < 100000; i++) {
    array[i] = 'x'.repeat(10*1024*1024);
  }
  return array;
}