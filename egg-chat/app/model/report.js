'use strict';

module.exports = app => {
  const { INTEGER, STRING, ENUM, TEXT, DATE } = app.Sequelize;
  // 创建表
  const Report = app.model.define('report', {
    id: {
      type: INTEGER(20).UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: INTEGER(20).UNSIGNED,
      allowNull: false,
      // 定义外键
      references: {
        model: 'user', // 对应表名称（数据表名称）
        key: 'id', // 对应表的主键
        onUpdate: 'restrict', // 更新时操作
        onDelete: 'cascade', // 删除时操作
      },
      comment: '用户id',
    },
    reported_id: {
      type: INTEGER(20).UNSIGNED,
      allowNull: false,
      comment: '被举报人id',
    },
    reported_type: {
      type: ENUM,
      values: [ 'user', 'group' ],
      allowNull: false,
      defaultValue: 'user',
      comment: '举报类型',
    },
    content: {
      type: TEXT,
      allowNull: true,
      defaultValue: '',
      comment: '举报内容',
    },
    category: {
      type: STRING(10),
      allowNull: true,
      defaultValue: '',
      comment: '举报分类',
    },
    status: {
      type: ENUM,
      values: [ 'pending', 'refuse', 'agree' ],
      allowNull: false,
      defaultValue: 'pending',
      comment: '举报状态',
    },
    created_at: DATE,
    updated_at: DATE,
  });

  return Report;
};
