'use strict';

module.exports = (options, app) => {
  return async (ctx, next) => {
    // 1. 获取 header 头的 token
    const { token } = ctx.header;
    if (!token) ctx.throw(400, '无访问权限');
    // 2. 根据 token 解密，换取用户信息
    let user = {};
    try {
      user = ctx.checkToken(token);
    } catch (err) {
      const fail = err.name === 'TokenExpiredError' ? '登录已失效，请重新登录' : '非法用户';
      ctx.throw(400, fail);
    }
    // 3. 判断当前用户是否登录
    const t = await ctx.service.cache.get(`user_${user.id}`);
    if (!t) ctx.throw(400, '用户未登录');
    if (t !== token) ctx.throw(400, '非法用户');
    // 4. 获取当前用户，验证当前用户是否被禁用
    user = await app.model.User.findByPk(user.id);
    if (!user) ctx.throw(400, '用户不存在');
    if (user.status === 0) ctx.throw(400, '用户已被禁用');
    // 5. 把 user 信息挂载到全局 ctx 上
    ctx.authUser = user;
    // 6. 继续执行
    await next();
  };
};
