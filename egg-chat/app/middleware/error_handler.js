'use strict';

module.exports = (options, app) => {
  // 错误和异常统一处理
  const errorHandler = async (ctx, next) => {
    try {
      await next();
      if (ctx.status === 404 && !ctx.body) {
        return ctx.apiFail('404 错误', ctx.status);
      }
    } catch (err) {
      // 记录每一条错误日志
      app.emit('error', err, ctx);

      const status = err.status || 500;
      // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
      let error = status === 500 && app.config.env === 'prod' ? 'Internal Server Error' : err.message;
      // 从 err 对象中读取各个属性，设置到响应中
      // 参数验证异常
      if (status === 422 && err.code === 'invalid_param') {
        if (Array.isArray(err.errors)) error = err.errors[0].err[0] ? err.errors[0].err[0] : err.errors[0].err[1];
      }
      // 其他异常
      ctx.apiFail(error, status);
    }
  };

  return errorHandler;
};
