const Controller = require('egg').Controller;

function toInt (str) {
    if (typeof str === 'number') return str;
    if (!str) return str;
    return parseInt(str, 10) || 0;
}

class UserController extends Controller {
    async index () {
        const ctx = this.ctx;
        const opts = { skip: toInt(ctx.query.offset), limit: toInt(ctx.query.limit) };
        console.log(await this.ctx.model.User.find(null, null, opts).exec())
        ctx.body = await this.ctx.model.User.find(null, null, opts).exec();
    }

    async new () {
        console.log('new')
        await this.ctx.render('user.tpl');
    }

    async show () {
        const ctx = this.ctx;
        ctx.body = await ctx.model.User.findOne({ _id: toInt(ctx.params.id) }).exec();;
    }

    async create () {
        const ctx = this.ctx;
        const { name, age } = ctx.request.body;
        const user = new this.ctx.model.User();
        user.name = name;
        user.age = age;
        user.save();

        ctx.status = 201;
        ctx.body = user;
    }

    async update () {
        const ctx = this.ctx;
        const id = toInt(ctx.params.id);
        const user = await ctx.model.User.findOne({ _id: id }).exec();
        if (!user) {
            ctx.status = 404;
            return;
        }

        const { name, age } = ctx.request.body;
        await user.update({ name, age });
        ctx.body = user;
    }

    async destroy () {
        const ctx = this.ctx;
        const id = toInt(ctx.params.id);
        const user = await ctx.model.User.findOne({ _id: id }).exec();
        if (!user) {
            ctx.status = 404;
            return;
        }

        await user.destroy();
        ctx.status = 200;
    }
}

module.exports = UserController;