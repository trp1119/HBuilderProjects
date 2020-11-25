'use strict';

const Controller = require('egg').Controller;
const SortWord = require('sort-word');

class FriendController extends Controller {
  // 通讯录列表
  async list() {
    const { ctx, app } = this;
    const current_user_id = ctx.authUser.id;
    // 获取并统计我的朋友
    const friends = await app.model.Friend.findAndCountAll({
      where: {
        user_id: current_user_id,
      },
      include: [{
        model: app.model.User,
        as: 'friendInfo',
        attributes: [ 'id', 'username', 'nickname', 'avatar' ],
      }],
    });

    friends.rows = friends.rows.map(item => {
      let nickname = item.friendInfo.nickname ? item.friendInfo.nickname : item.friendInfo.username;
      if (item.nickname) nickname = item.nickname;
      return {
        id: item.id,
        user_id: item.friendInfo.id,
        username: item.friendInfo.username,
        nickname,
        avatar: item.friendInfo.avatar,
      };
    });

    // 排序
    friends.rows = new SortWord(friends.rows, 'nickname');

    ctx.apiSuccess(friends);
  }

  // 查看好友资料
  async read() {
    const { ctx, app } = this;
    const current_user_id = ctx.authUser.id;
    const id = parseInt(ctx.params.id);
    const friend = await app.model.Friend.findOne({
      where: {
        user_id: current_user_id,
        friend_id: id,
      },
      include: [{
        model: app.model.User,
        as: 'friendInfo',
        attributes: {
          exclude: [ 'password' ],
        },
      }],
    });
    if (!friend) ctx.throw(400, '用户不存在');
    ctx.apiSuccess(friend);
  }

  // 移入/移出黑名单
  async setblack() {
    const { ctx, app } = this;
    const current_user_id = ctx.authUser.id;
    const id = parseInt(ctx.params.id);
    const { isblack } = ctx.request.body;
    // 参数验证
    ctx.validate({
      isblack: {
        type: 'int',
        required: true,
        range: {
          in: [ 0, 1 ],
        },
        desc: '移入/移出黑名单',
      },
    });
    const friend = await app.model.Friend.findOne({
      where: {
        user_id: current_user_id,
        friend_id: id,
      },
    });
    if (!friend) ctx.throw(400, '该记录不存在');
    friend.isblack = isblack;
    await friend.save();
    ctx.apiSuccess('设置成功');
  }

  // 设置/取消星标好友
  async setstar() {
    const { ctx, app } = this;
    const current_user_id = ctx.authUser.id;
    const id = parseInt(ctx.params.id);
    const { star } = ctx.request.body;
    // 参数验证
    ctx.validate({
      star: {
        type: 'int',
        required: true,
        range: {
          in: [ 0, 1 ],
        },
        desc: '设置/取消星标好友',
      },
    });
    const friend = await app.model.Friend.findOne({
      where: {
        user_id: current_user_id,
        friend_id: id,
        isblack: 0, // 已拉黑不能设置星标好友
      },
    });
    if (!friend) ctx.throw(400, '该记录不存在');
    friend.star = star;
    await friend.save();
    ctx.apiSuccess('设置成功');
  }

  // 设置朋友圈权限
  async setMomentAuth() {
    const { ctx, app } = this;
    const current_user_id = ctx.authUser.id;
    const id = parseInt(ctx.params.id);
    const { lookme, lookhim } = ctx.request.body;
    // 参数验证
    ctx.validate({
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
    });
    const friend = await app.model.Friend.findOne({
      where: {
        user_id: current_user_id,
        friend_id: id,
        isblack: 0, // 已拉黑不能设置设置朋友圈权限
      },
    });
    if (!friend) ctx.throw(400, '该记录不存在');
    friend.lookme = lookme;
    friend.lookhim = lookhim;
    await friend.save();
    ctx.apiSuccess('设置成功');
  }

  // 设置备注和标签
  async setremarkTag() {
    const { ctx, app } = this;
    const current_user_id = ctx.authUser.id;
    const id = parseInt(ctx.params.id);
    // 参数验证
    ctx.validate({
      nickname: {
        type: 'string',
        required: false,
        desc: '备注昵称',
      },
      tags: {
        type: 'string',
        required: true,
        desc: '标签',
      },
    });
    // 查看好友是否存在
    const friend = app.model.Friend.findOne({
      where: {
        user_id: current_user_id,
        friend_id: id,
        isblack: 0,
      },
    });
    if (!friend) ctx.throw(400, '该记录不存在');
    ctx.apiSuccess('设置成功');
  }
}

module.exports = FriendController;
