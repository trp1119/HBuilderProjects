'use strict';

const Controller = require('egg').Controller;
class ReportController extends Controller {
  // 举报投诉好友/群组
  async save() {
    const { ctx, app } = this;
    const current_user_id = parseInt(ctx.authUser.id);
    const { reported_id, reported_type, content, category } = ctx.request.body;
    // 参数验证
    ctx.validate({
      reported_id: {
        type: 'int',
        required: true,
        desc: '被举报人id/群组id',
      },
      reported_type: {
        type: 'string',
        required: true,
        range: {
          in: [ 'user', 'group' ],
        },
        desc: '举报类型',
      },
      content: {
        type: 'string',
        required: true,
        desc: '举报内容',
      },
      category: {
        type: 'string',
        required: true,
        desc: '举报分类',
      },
    });
    // 不能举报自己
    if (reported_type === 'user' && parseInt(reported_id) === current_user_id) ctx.throw(400, '不能举报自己');
    // 被举报人是否存在
    const user = await app.model.User.findOne({
      where: {
        id: reported_id,
        status: 1,
      },
    });
    if (!user) ctx.throw(400, '被举报人不存在');
    // 检查之前是否举报过（尚未处理）
    const report = await app.model.Report.findOne({
      where: {
        user_id: current_user_id,
        reported_id,
        reported_type,
        status: 'pending',
      },
    });
    if (report) ctx.throw(400, '请勿重复提交');
    // 创建举报内容
    const res = await app.model.Report.create({
      user_id: current_user_id,
      reported_id,
      reported_type,
      content,
      category,
    });
    ctx.apiSuccess(res);
  }
}

module.exports = ReportController;
