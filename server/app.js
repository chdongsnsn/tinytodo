const Koa = require('koa');
const path = require('path');
const router = require('./routers/index');
const json = require('koa-json');
const logger = require('koa-logger');
const bodyparser = require('koa-bodyparser');
const koaStatic = require('koa-static');
const historyFallback = require('koa2-history-api-fallback');
const db = require('./config/db');

const app = new Koa();

// 连接数据库
db.connectDB().then(() => {
  // 中间件处理
  app.use(bodyparser());
  app.use(json());
  app.use(logger());
  //  如果JWT验证失败，返回验证失败信息
  app.use(async (ctx, next) => {
    try {
      await next();
    } catch (err) {
      if (err.status === 401) {
        ctx.status = 401;
        ctx.body = {
          success: false,
          token: null,
          info: 'Protected resource, use Authorization header to get access'
        };
      } else {
        throw err;
      }
    }
  });
  // 挂载路由
  app.use(router.routes(), router.allowedMethods());
  // 绑定 historyfallback;
  app.use(historyFallback());
  // 静态文件处理
  app.use(koaStatic(path.resolve('dist'), { hidden: true }));
  app.on('error', (err) => {
    console.log('server error', err);
  });

  app.listen(1030, () => {
    console.log('Server is started at port 1030');
  });
});


module.exports = app;

