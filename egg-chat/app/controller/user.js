'use strict';

const Controller = require('egg').Controller;
const crypto = require('crypto');

class UserController extends Controller {
  // 注册
  async reg() {
    const { app, ctx } = this;
    // 参数验证
    ctx.validate({
      username: {
        type: 'string',
        require: true,
        range: {
          min: 6,
          max: 20,
        },
        desc: '用户名',
      },
      password: {
        type: 'string',
        require: true,
        desc: '密码',
      },
      repassword: {
        type: 'string',
        require: true,
        desc: '确认密码',
      },
    }, {
      equals: [
        [ 'password', 'repassword' ],
      ],
    });
    // 验证用户是否已经存在
    const { username, password } = ctx.request.body;
    const user = await app.model.User.findOne({
      where: {
        username,
      },
    });
    if (user) return ctx.throw(400, '用户名已存在');
    // 创建新用户
    const newUser = await app.model.User.create({
      username,
      password,
    });
    if (!newUser) return ctx.throw(400, '创建用户失败');
    ctx.apiSuccess(newUser);
  }
  // 登录
  async login() {
    const { app, ctx } = this;
    // 参数验证
    ctx.validate({
      username: {
        type: 'string',
        require: true,
        desc: '用户名',
      },
      password: {
        type: 'string',
        require: true,
        desc: '密码',
      },
    });
    // 验证该用户是否存在及是否启用
    const { username, password } = ctx.request.body;
    let user = await app.model.User.findOne({
      where: {
        username,
        status: 1,
      },
    });
    if (!user) ctx.throw(400, '用户不存在或已被禁用');
    // 验证密码
    this.checkPassword(password, user.password);
    // 生成token
    user = JSON.parse(JSON.stringify(user));
    const token = ctx.getToken(user);
    user.token = token;
    delete user.password;
    // 加入到缓存中
    if (!await this.service.cache.set(`user_${user.id}`, token)) {
      ctx.throw(400, '登录失败');
    }
    // 返回用户信息和token
    ctx.apiSuccess(user);
  }

  // 验证密码
  checkPassword(password, hash_password) {
    const { app, ctx } = this;
    // 先对需要验证的密码进行加密
    const hmac = crypto.createHash('sha256', app.config.crypto.secret);
    hmac.update(password);
    password = hmac.digest('hex');
    if (password !== hash_password) {
      ctx.throw(400, '密码错误');
    }
  }

  // 退出登录
  async logout() {
    const { ctx, service } = this;
    // 拿到当前用户id
    const current_user_id = ctx.authUser.id;
    // 移除 redis 当前用户信息
    if (!await service.cache.remove(`user_${current_user_id}`)) {
      ctx.throw(400, '退出登录失败');
    }
    ctx.apiSuccess('退出成功');
  }
}

module.exports = UserController;
