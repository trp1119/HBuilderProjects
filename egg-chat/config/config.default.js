/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1593446609331_9649';

  // add your middleware config here
  config.middleware = [ 'errorHandler', 'auth' ];
  // 哪些路由使用 auth 中间件验证
  config.auth = {
    ignore: [ '/reg', '/login' ],
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.security = {
    // 关闭 csrf
    csrf: {
      enable: false,
    },
    // 跨域白名单
    domainWhiteList: [],
  };

  // 允许跨域的方法
  config.cors = {
    origin: '*',
    allowMethods: 'GET, POST, PUT, DELETE, PATCH',
  };
  // 数据库
  config.sequelize = {
    dialect: 'mysql',
    host: '127.0.0.1',
    username: 'root',
    password: '123456',
    port: 3306,
    database: 'egg-chat',
    // 中国时区
    timezone: '+08:00',
    define: {
      // 取消数据表名复数
      freezeTableName: true,
      // 自动写入时间戳 created_at updated_at
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      // deletedAt: 'deleted_at',
      timestamps: true,
      // 字段生成软删除时间戳 deleted_at
      // paranoid: true,
      // 所有驼峰命名格式化
      underscored: true,
    },
  };
  // redis 存储
  config.redis = {
    client: {
      host: '127.0.0.1',
      port: 6379,
      password: '',
      db: 0,
    },
  };
  // 参数验证
  config.valparams = {
    locale: 'zh-cn',
    throwError: true,
  };
  // 数据加密
  config.crypto = {
    secret: 'ddhuse@4dedhu23odw9eu9w2j!#@3udneu1*_919',
  };
  // jwt 加密鉴权
  config.jwt = {
    secret: 'ss21@ee2w2edfr78rgfe2j!#@de321*_2',
  };

  return {
    ...config,
    ...userConfig,
  };
};
