const User = require('../models/user');
const jwt = require('jsonwebtoken');
const util = require('util');

const SECRET = 'todolist-jwt';
const jwtSign = util.promisify(jwt.sign);
const jwtVerify = util.promisify(jwt.verify);

module.exports = {
  /**
   * 用户登录
   * @param account {String} 登录账号（用户名，邮箱或者手机）
   * @param password {String} 登录密码
   * @returns {Promise.<Object>} 返回信息
   *            {
   *              success {Boolean} 登录是否成功
   *              msg {String} 返回信息
   *            }
   */
  async login(account, password) {
    let user;
    const result = {
      success: false,
      msg: '登录失败，用户不存在',
    };
    if (account.includes('@')) {
      try {
        user = await User.findOneUser(account, 'email');
      } catch (err) {
        throw err;
      }
    } else {
      const onlyNumReg = /^[0-9]*$/;
      if (onlyNumReg.test(account)) {
        try {
          user = await User.findOneUser(account, 'tel');
        } catch (err) {
          throw err;
        }
      } else {
        try {
          user = await User.findOneUser(account, 'username');
        } catch (err) {
          throw err;
        }
      }
    }
    if (!user) {
      return result;
    }
    try {
      const isMatch = await user.comparePassword(password);
      if (isMatch) {
        const token = await this.createToken(user.username); // 获取 token
        if (!token) {
          return {
            success: false,
            msg: 'token获取失败',
          };
        }
        return {
          success: true,
          msg: '登录成功',
          userInfo: {
            username: user.username,
            token,
          },
        };
      }
      return {
        success: false,
        msg: '登录失败，密码不正确',
      };
    } catch (err) {
      console.log(`Login Error: ${err}`);
      return {
        success: false,
        msg: '登录失败，网络异常',
      };
    }
  },

  /**
   * 用户注册
   * @param ctx Koa 的 context
   * @returns {Promise.<Object>} 返回信息
   *            {
   *              success {Boolean} 注册是否成功
   *              msg {String} 返回信息
   *            }
   */
  async signup(ctx) {
    const { username, password, email = '', tel = '' } = ctx.request.body;
    // 判断注册信息是否已经被占用
    const userAccounts = {
      username,
      email,
      tel,
    };
    const checkPromisesArr = [];
    /*eslint-disable */
    for (let k in userAccounts) {
      if (userAccounts[k] && userAccounts[k] !== '') {
        let p = await this.checkSigned(k, userAccounts[k]);
        checkPromisesArr.push(p)
      }
    }
    /*eslint-enable */
    let result = checkPromisesArr.find(item => item.isUsed === true);
    if (result) return result; // 如果有字段已被占用，返回注册失败信息
    const user = new User({
      username,
      password,
      email,
      tel,
    });
    try {
      await user.save();
      const token = await this.createToken(username);
      result = {
        success: true,
        msg: '注册成功！',
      };
      if (token) {
        Object.assign(result, {
          userInfo: {
            username,
            token,
          },
        });
      }
    } catch (err) {
      result = {
        success: false,
        msg: '注册失败！',
      };
      throw err;
    }
    return result;
  },

  /**
   * 检查当前用户信息字段的值是否已被注册
   * @param key {String} 用户信息字段，包括 username，email，tel
   * @param value {String} 对应字段的值
   * @returns {Promise.<Object>} 返回信息
   *            {
   *              isUsed {Boolean} 该信息是否已被注册
   *              msg {String} 返回信息
   *            }
   */
  async checkSigned(key, value) {
    let user;
    try {
      user = await User.findOneUser(value, key);
    } catch (err) {
      throw err;
    }
    if (!user) {
      return {
        isUsed: false,
        msg: '可以注册',
      };
    }
    switch (key) {
      case 'username':
        return {
          isUsed: true,
          msg: '该用户名已被注册',
        };
      case 'email':
        return {
          isUsed: true,
          msg: '该邮箱已被注册',
        };
      case 'tel':
        return {
          isUsed: true,
          msg: '该手机号已被注册',
        };
      default:
        return {
          isUsed: true,
          msg: '该账号已被注册',
        };
    }
  },
  // 根据 token 获取用户信息
  async getUserInfo(ctx) {
    const auth = ctx.req.headers.authorization;
    const token = auth.split(' ')[1];
    const user = await jwtVerify(token, SECRET);
    const { username } = user;
    return { username };
  },
  // 生成 Token
  async createToken(username) {
    const userToken = {
      username,
    };
    try {
      const token = await jwtSign(userToken, SECRET, { expiresIn: '2d' });
      return token;
    } catch (err) {
      console.log(err);
      return {
        message: '参数错误，获取token失败',
      };
    }
  },
};
