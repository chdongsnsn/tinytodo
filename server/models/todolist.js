const mongoose = require('mongoose');

const TodosSchema = mongoose.Schema({
  username: {
    type: String,
    index: true,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  createtime: {
    type: Date,
    default: Date.now,
  },
});

TodosSchema.statics = {
  // 根据 username 获取todolist
  async getTodosByName(username) {
    return this.find({ username }, 'content status _id').sort({ createtime: 'asc' });
  },
  /**
   * 更新todo状态
   * @param _id {String} todo的id
   * @param status {Boolean} 需要变更的状态
   * @returns {Promise.<void>}
   */
  async updateStatus(_id, status) {
    return this.update({ _id }, { status });
  },
  // 根据_id删除条目
  async removeTodoById(_id) {
    return this.remove({ _id });
  },
};

module.exports = mongoose.model('Todo', TodosSchema);
