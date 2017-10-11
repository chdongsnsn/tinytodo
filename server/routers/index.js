const Router = require('koa-router');
const userRouter = require('./user');
const todoListRouter = require('./todo');
const koaJwt = require('koa-jwt');

const SECRET = 'todolist-jwt';

const router = Router({
  prefix: '/api',
});
router.use('/', koaJwt({ secret: SECRET }).unless({ path: [/^\/api\/user\/login/, /^\/api\/user\/check/, /^\/api\/user\/signup/] }));
router.use('/user', userRouter.routes(), userRouter.allowedMethods());
router.use('/todo', todoListRouter.routes(), todoListRouter.allowedMethods());

module.exports = router;
