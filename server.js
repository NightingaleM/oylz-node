'use strict'


/*
下面代码用于开启集群（多线程）
但是目前并没有正常工作，所以暂时先不启用
git仓库：https://github.com/adonisjs/adonis-websocket
参考：https://forum.adonisjs.com/t/websocket-with-cluster/1186/6
在pm2中可能存在问题：https://forum.adonisjs.com/t/ws-and-pm2-cluster/2282
const cluster = require('cluster')
if (cluster.isMaster) {
  for (let i = 0; i < 4; i++) {
    cluster.fork()
  }
  require('@adonisjs/websocket/clusterPubSub')()
  return
}

*/
/*
|--------------------------------------------------------------------------
| Http server
|--------------------------------------------------------------------------
|
| This file bootstrap Adonisjs to start the HTTP server. You are free to
| customize the process of booting the http server.
|
| """ Loading ace commands """
|     At times you may want to load ace commands when starting the HTTP server.
|     Same can be done by chaining `loadCommands()` method after
|
| """ Preloading files """
|     Also you can preload files by calling `preLoad('path/to/file')` method.
|     Make sure to pass relative path from the project root.
*/

const { Ignitor } = require('@adonisjs/ignitor')

new Ignitor(require('@adonisjs/fold'))
  .appRoot(__dirname)
  .wsServer()
  .fireHttpServer()
  .catch(console.error)
