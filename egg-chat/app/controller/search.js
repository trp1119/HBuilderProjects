'use strict';

const Controller = require('egg').Controller;

class SearchController extends Controller {
  // 搜索用户
  async user() {
    // 参数验证
    const { app, ctx } = this;
    ctx.validate({
      keyword: {
        type: 'string',
        required: true,
        desc: '关键词',
      },
    });
    const { keyword } = ctx.request.body;
    const user = await app.model.User.findOne({
      where: {
        username: keyword,
      },
      attributes: {
        exclude: [ 'password' ],
      },
    });

    if (!user) {
      ctx.apiFail('无相关用户');
    } else {
      ctx.apiSuccess(user);
    }
  }
}

module.exports = SearchController;
