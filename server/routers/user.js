const router = require('koa-router')();
const userController = require('../controllers/user-controller');

// 用户登录
router.post('/login', async (ctx) => {
  const { account, password } = ctx.request.body;
  try {
    const res = await userController.login(account, password);
    ctx.body = res;
  } catch (err) {
    ctx.body = {
      success: false,
      msg: '登录失败',
    };
    throw err;
  }
});

// 用户注册
router.post('/signup', async (ctx) => {
  try {
    const res = await userController.signup(ctx);
    ctx.body = res;
  } catch (err) {
    console.log(err);
    ctx.body = {
      success: false,
      msg: '注册失败，服务器异常',
    };
  }
});

// 检查注册信息是否被占用
router.get('/check/:key/:val', async (ctx) => {
  const key = ctx.params.key;
  const val = ctx.params.val;
  try {
    const res = await userController.checkSigned(key, val);
    ctx.body = res;
  } catch (err) {
    ctx.res.statusCode(404);
    ctx.body = {
      msg: '网络异常',
    };
    throw err;
  }
});

// 根据 token 获取用户信息
router.get('/getUserInfo', async (ctx) => {
  try {
    const userInfo = await userController.getUserInfo(ctx);
    ctx.body = userInfo;
  } catch (err) {
    console.log(`Authorization Error: ${err}`);
    throw err;
  }
});

module.exports = router;
