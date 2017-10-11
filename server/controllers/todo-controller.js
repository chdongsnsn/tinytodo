const Todo = require('../models/todolist');
const userController = require('./user-controller');

module.exports = {
  // 添加todo
  async addTodo(ctx) {
    const { content } = ctx.request.body;
    let username;
    try {
      ({ username } = await userController.getUserInfo(ctx));
    } catch (err) {
      console.log(`Add Todo Error: ${err}`);
      return {
        success: false,
        msg: 'Authorization fail',
      };
    }
    const todo = new Todo({
      status: false,
      username,
      content,
    });
    let result;
    try {
      result = await todo.save();
    } catch (err) {
      console.log(`Save Todo Error: ${err}`);
      return {
        success: false,
        msg: '网络似乎有些问题...',
      };
    }
    return result;
  },
  // 查找todo
  async getTodos(ctx) {
    let username;
    try {
      ({ username } = await userController.getUserInfo(ctx));
    } catch (err) {
      console.log(`Add Todo Error: ${err}`);
      return {
        success: false,
        msg: 'Authorization fail',
      };
    }
    try {
      const todos = await Todo.getTodosByName(username);
      return todos;
    } catch (err) {
      console.log(`Find Todos Error: ${err}`);
      return {
        success: false,
        msg: '网络似乎有些问题...',
      };
    }
  },
  // 更新todo
  async updateTodo(id, status) {
    try {
      await Todo.updateStatus(id, !status);
      return {
        success: true,
        msg: '状态更新成功',
      };
    } catch (err) {
      console.log(`Update Todo Fail: ${err}`);
      return {
        success: false,
        msg: '状态更新失败',
      };
    }
  },
  // 删除todo
  async removeTodo(id) {
    try {
      await Todo.removeTodoById(id);
      return {
        success: true,
        msg: '删除成功',
      };
    } catch (err) {
      console.log(`Todo delete fail: ${err}`);
      return {
        success: false,
        msg: '删除失败，服务器开小差了',
      };
    }
  },
};
