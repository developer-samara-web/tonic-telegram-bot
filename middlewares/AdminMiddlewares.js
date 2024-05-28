//? ADMINMIDDLEWARES.JS

// Requires
const { Bot } = require('@config/telegram')
const { LOG, Arvhive } = require('@helpers/helpers')
const { AdminMessage } = require('@messages/AdminMessages')
const { LoadUsers } = require('@helpers/users')

// AdminMessageMiddleware
const AdminMessageMiddleware = async (ctx, message) => {
    const { username } = ctx.message.from

    try {
        const usersList = await LoadUsers(ctx)
        const msg = await AdminMessage(ctx, message)

        usersList.forEach(async (user) => {
            if (user.id != process.env.TELEGRAM_ADMIN_ID){
                await Bot.telegram.sendMessage(user.id, msg, {
                    parse_mode: 'HTML'
                });
            }
        });

        LOG(username, 'Middlewares/Admin/AdminMessageMiddleware')
        return true
    } catch (error) {
        LOG(username, 'Middlewares/Admin/AdminMessageMiddleware', error)
    }
}

// AdminLogsMiddleware
const AdminLogsMiddleware = async (ctx) => {
    const { username } = ctx.message.from
    const dir = path.join(__dirname, '../logs');
    const archive = path.join(__dirname, '../logs/logs.zip');
    const path = require('path');

    try {
        await Arvhive(ctx, dir, archive);
        await ctx.replyWithDocument({ source: archivePath, filename: 'logs.zip' });

        LOG(username, 'Middlewares/Admin/AdminLogsMiddleware')
    } catch (error) {
        LOG(username, 'Middlewares/Admin/AdminLogsMiddleware', error)
    }
}

module.exports = { AdminMessageMiddleware, AdminLogsMiddleware }