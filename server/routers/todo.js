const router = require('koa-router')();
const todoController = require('../controllers/todo-controller');

// 添加todo
router.post('/', async (ctx) => {
  try {
    const todo = await todoController.addTodo(ctx);
    if (!todo.success) {
      ctx.body = {
        success: false,
        msg: todo.msg,
      };
    }
    ctx.body = {
      success: true,
      msg: '添加成功',
      todo,
    };
  } catch (err) {
    throw err;
  }
});
// 查询todos
router.get('/', async (ctx) => {
  try {
    const todos = await todoController.getTodos(ctx);
    if (!todos.success) {
      ctx.body = {
        success: false,
        msg: todos.msg,
      };
    }
    ctx.body = {
      success: true,
      msg: '查询成功',
      todos,
    };
  } catch (err) {
    throw err;
  }
});
// 修改todo状态
router.patch('/', async (ctx) => {
  const { id, status } = ctx.request.body;
  try {
    const result = await todoController.updateTodo(id, status);
    ctx.body = result;
  } catch (err) {
    console.log(err);
    ctx.body = {
      success: false,
      msg: '服务器开小差了',
    };
  }
});
// 删除todo
router.delete('/:id', async (ctx) => {
  if (ctx.params.id) {
    const id = ctx.params.id;
    try {
      const result = await todoController.removeTodo(id);
      ctx.body = result;
    } catch (err) {
      throw err;
    }
  } else {
    ctx.body = {
      success: false,
      msg: '参数不正确',
    };
  }
});
module.exports = router;
