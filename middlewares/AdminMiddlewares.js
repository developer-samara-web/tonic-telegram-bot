//? MIDDLEWARES | ADMIN

//* Requires
const { Bot } = require('@config/telegram')
const { LOG, Archive } = require('@helpers/base')
const { AdminMessage } = require('@messages/AdminMessages')
const { LoadUsers } = require('@helpers/users')


//* START - AdminMessageMiddleware / Сообщение всем пользователям бота
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
//* END - AdminMessageMiddleware


//* START - AdminLogsMiddleware / Запрос файла логов
const AdminLogsMiddleware = async (ctx) => {
    const { username } = ctx.message.from
    const path = require('path');
    const dir = path.join(__dirname, '../logs');
    const archivePath = path.join(__dirname, '../logs/logs.zip');

    try {
        await Archive(ctx, dir, archivePath);
        await ctx.replyWithDocument({ source: archivePath, filename: 'logs.zip' });

        LOG(username, 'Middlewares/Admin/AdminLogsMiddleware')
    } catch (error) {
        LOG(username, 'Middlewares/Admin/AdminLogsMiddleware', error)
    } finally {
        return ctx.scene.enter('admin')
    }
}
//* END - AdminLogsMiddleware


module.exports = { 
    AdminMessageMiddleware, 
    AdminLogsMiddleware 
}