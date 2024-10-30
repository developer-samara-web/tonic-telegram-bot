//? MIDDLEWARES | ADMIN

//* Requires
const { Bot } = require('@services/telegram')
const { LOG, Archive } = require('@helpers/base')
const { AdminMessage } = require('@messages/AdminMessages')
const { GetFirebaseUsers, GetMonitoringList, DeleteMonitoringItem } = require('@services/firebase')
const path = require('path')


//* START
const AdminMessageMiddleware = async (ctx, message) => {
    // Получаем имя пользователя из контекста
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'

    try {
        // Получаем список пользователей из Firebase
        const usersList = await GetFirebaseUsers(ctx)
        // Генерируем сообщение для администратора
        const msg = await AdminMessage(ctx, message)

        // Перебираем список пользователей
        usersList.forEach(async (user) => {
            // Проверяем, что ID пользователя не равен ID администратора
            if (user.id != process.env.TELEGRAM_ADMIN_ID){
                // Отправляем сообщение пользователю
                await Bot.telegram.sendMessage(user.id, msg, {
                    parse_mode: 'HTML'
                })
            }
        })

        // Логируем выполнение функции
        LOG(username, 'Middlewares/Admin/AdminMessageMiddleware')
        return true
    } catch (error) {
        // Логируем ошибку
        LOG(username, 'Middlewares/Admin/AdminMessageMiddleware', error, ctx)
    }
}
//* END


//* START
const AdminLogsMiddleware = async (ctx) => {
    // Получаем имя пользователя из контекста
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'
    const dir = path.join(__dirname, '../logs')
    const archivePath = path.join(__dirname, '../logs/logs.zip')

    try {
        // Архивируем логи
        await Archive(ctx, dir, archivePath)
        // Отправляем архивированный файл пользователю
        await ctx.replyWithDocument({ source: archivePath, filename: 'logs.zip' })

        // Логируем выполнение функции
        LOG(username, 'Middlewares/Admin/AdminLogsMiddleware')
    } catch (error) {
        // Логируем ошибку
        LOG(username, 'Middlewares/Admin/AdminLogsMiddleware', error, ctx)
    } finally {
        // Переходим в сцену администратора
        return ctx.scene.enter('admin')
    }
}
//* END

//* START
const AdminClearMonitoringMiddleware = async (ctx) => {
    // Получаем имя пользователя из контекста
    const { username } = ctx.message?.from || ctx.callbackQuery?.from || 'BOT'

    try {

        const items = await GetMonitoringList(ctx)
        
        for (const item of items) {
            await DeleteMonitoringItem(ctx, item.name)
        }

        await ctx.replyWithHTML(`✅  Очередь обновлена успешно.`);

        // Логируем выполнение функции
        LOG(username, 'Middlewares/Admin/AdminLogsMiddleware')
    } catch (error) {
        // Логируем ошибку
        LOG(username, 'Middlewares/Admin/AdminLogsMiddleware', error, ctx)
    } finally {
        // Переходим в сцену администратора
        return ctx.scene.enter('monitoring')
    }
}
//* END


module.exports = { 
    AdminMessageMiddleware, 
    AdminLogsMiddleware,
    AdminClearMonitoringMiddleware
}