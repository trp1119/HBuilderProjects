'use strict';

const Controller = require('egg').Controller;

class ApplyController extends Controller {
  // 申请添加好友
  async addFriend() {
    const { ctx, app } = this;
    // 当前用户
    const current_user_id = ctx.authUser.id;
    // 验证参数
    ctx.validate({
      friend_id: {
        type: 'int',
        required: true,
        desc: '好友id',
      },
      nickname: {
        type: 'string',
        required: false,
        desc: '昵称',
      },
      lookme: {
        type: 'int',
        required: true,
        range: {
          in: [ 0, 1 ],
        },
        desc: '看我',
      },
      lookhim: {
        type: 'int',
        required: true,
        range: {
          in: [ 0, 1 ],
        },
        desc: '看她',
      },
    });
    const { friend_id, nickname, lookme, lookhim } = ctx.request.body;
    // 不能添加自己
    if (current_user_id === friend_id) ctx.throw(400, '不能添加自己');
    // 对方是否存在
    const user = await app.model.User.findOne({
      where: {
        id: friend_id,
        status: 1,
      },
    });
    if (!user) ctx.throw(400, '该用户不存在');
    // 是否已申请
    const applied = await app.model.Apply.findOne({
      where: {
        user_id: current_user_id,
        friend_id,
        status: [ 'pending', 'agree' ],
      },
    });
    if (applied) ctx.throw(400, '已申请过');
    // 创建申请
    const apply = await app.model.Apply.create({
      user_id: current_user_id,
      friend_id,
      nickname,
      lookme,
      lookhim,
    });
    if (!apply) ctx.throw(400, '申请失败');
    ctx.apiSuccess(apply);
  }

  // 获取好友申请列表
  async list() {
    const { ctx, app } = this;
    const current_user_id = ctx.authUser.id;
    const page = ctx.query.page ? parseInt(ctx.query.page) : 1;
    const size = ctx.query.size ? parseInt(ctx.query.size) : 10;
    const offset = (page - 1) * size;
    const rows = await app.model.Apply.findAll({
      where: {
        friend_id: current_user_id,
      },
      include: [{
        model: app.model.User,
        attributes: [ 'id', 'username', 'nickname', 'avatar' ],
      }],
      offset,
      limit: size,
    });
    const count = await app.model.Apply.count({
      where: {
        friend_id: current_user_id,
        status: 'pending',
      },
    });
    ctx.apiSuccess({
      rows,
      count,
    });
  }

  // 处理好友申请
  async handle() {
    const { ctx, app } = this;
    const current_user_id = ctx.authUser.id;
    const id = parseInt(ctx.params.id);
    const { nickname, lookme, lookhim, status } = ctx.request.body;
    // 参数验证
    ctx.validate({
      nickname: {
        type: 'string',
        required: true,
        desc: '昵称',
      },
      lookme: {
        type: 'int',
        required: true,
        range: {
          in: [ 0, 1 ],
        },
        desc: '看我',
      },
      lookhim: {
        type: 'int',
        required: true,
        range: {
          in: [ 0, 1 ],
        },
        desc: '看他',
      },
      status: {
        type: 'string',
        required: true,
        range: {
          in: [ 'refuse', 'agree', 'ignore' ],
        },
        desc: '处理结果',
      },
    });
    // 查询申请是否存在
    const apply = await app.model.Apply.findOne({
      where: {
        id,
        friend_id: current_user_id,
        status: 'pending',
      },
    });
    if (!apply) ctx.throw(400, '该记录不存在');
    let transaction;
    try {
      // 开启事务
      transaction = await app.model.transaction();
      // 设置申请状态
      await apply.update({
        status,
      }, { transaction });
      // 同意申请，双向添加好友
      if (status === 'agree') {
        // 加入到对方好友列表
        const isInFriend = await app.model.Friend.findOne({
          where: {
            user_id: apply.user_id,
            friend_id: current_user_id,
          },
        });
        if (!isInFriend) {
          app.model.Friend.create({
            user_id: apply.user_id,
            friend_id: current_user_id,
            nickname: apply.nickname,
            lookme: apply.lookme,
            lookhim: apply.lookhim,
          });
        }
        // 将对方加入到我的好友列表
        const isInMe = await app.model.Friend.findOne({
          where: {
            user_id: current_user_id,
            friend_id: apply.user_id,
          },
        });
        if (!isInMe) {
          app.model.Friend.create({
            user_id: current_user_id,
            friend_id: apply.user_id,
            nickname,
            lookme,
            lookhim,
          });
        }
      }
      // 提交事务
      await transaction.commit();
      return ctx.apiSuccess('操作成功');
    } catch (err) {
      // 事务回滚
      await transaction.rollback();
      return ctx.apiSuccess('操作失败');
    }
  }
}

module.exports = ApplyController;
