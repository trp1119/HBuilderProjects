'use strict';

module.exports = {
  // api 返回成功
  apiSuccess(data = '', status = 200, msg = 'ok') {
    this.body = { msg, data };
    this.status = status;
  },
  // api 返回失败
  apiFail(data = '', status = 400, msg = 'fail') {
    this.body = { msg, data };
    this.status = status;
  },
  // 生成 token
  getToken(val) {
    return this.app.jwt.sign(val, this.app.config.jwt.secret);
  },
  // 验证 token
  checkToken(token) {
    return this.app.jwt.verify(token, this.app.config.jwt.secret);
  },
};
