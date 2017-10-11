const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const SALT_WALK = 12; // 加盐复杂度

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  tel: {
    type: String,
    required: true,
    unique: true,
  },
});

// 创建实例方法
UserSchema.methods = {
  // 对比密码
  async comparePassword(password) {
    return bcrypt.compare(password, this.password);
  },
};

// 创建静态方法
UserSchema.statics = {
  /**
   * 查找单个用户
   * @param val {String} 字段值
   * @param key {String} 查找字段，包括 username，email，tel
   * @returns {Promise<DocumentQuery<null|T, T>|DocumentQuery<null|DocType, DocType>|*|Query>}
   */
  async findOneUser(val, key) {
    return this.findOne({ [key]: val });
  },
};

// pre中间件绑定
UserSchema.pre('save', function (next) {
  // 密码哈希加盐处理
  bcrypt.genSalt(SALT_WALK, (err, salt) => {
    if (err) console.log(`Bcrypt Error: ${err}`);
    bcrypt.hash(this.password, salt, (innerErr, hash) => {
      if (err) console.log(`Bcrypt Error: ${innerErr}`);
      this.password = hash;
      next();
    });
  });
});


module.exports = mongoose.model('User', UserSchema);
