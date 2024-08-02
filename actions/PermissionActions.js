//? ACTIONS | PERMISSIONS

//* Requires
const { LOG } = require('@helpers/base')
const { Markup } = require('telegraf')
const { GrantAccess, GrantAdminAccess } = require('@helpers/firebase')


//* START
const PermissionsAction = async (ctx) => {
    // Извлекаем username из контекста сообщения или callbackQuery, если не найден, устанавливаем значение 'BOT'
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'
    
    try {
        // Извлекаем action, id и user из данных callbackQuery
        const { action, id, user } = JSON.parse(ctx.callbackQuery.data)
        // Извлекаем message_id из callbackQuery
        const { message_id } = ctx.callbackQuery.message

        if (action === 'grant_access') {
            // Если действие - предоставление доступа
            GrantAccess(ctx, id, user)
            // Удаляем сообщение
            await ctx.deleteMessage(message_id)
            // Отправляем пользователю сообщение об одобрении доступа с клавиатурой
            await ctx.telegram.sendMessage(id, '✅ Ваш запрос на доступ был одобрен.', Markup.keyboard([
                ['🔹 Начать работу'],
            ]).resize().oneTime())

            // Логируем действие
            LOG(username, 'Actions/PermissionsAction')
        } else if (action === 'deny_access') {
            // Если действие - отказ в доступе
            // Удаляем сообщение
            await ctx.deleteMessage(message_id)
            // Отправляем пользователю сообщение об отказе в доступе
            await ctx.telegram.sendMessage(id, '🚫 Вам отказано в доступе.')
            
            // Логируем действие с отказом в доступе
            LOG(username, 'Actions/PermissionsAction', 'Отказ в доступе.')
        }
    } catch (error) {
        // Логируем ошибку, если она возникла
        LOG(username, 'Actions/PermissionsAction', error, ctx)
    }
}
//* END


//* START
const PermissionsAdminAction = async (ctx) => {
    // Извлекаем username из контекста сообщения или callbackQuery, если не найден, устанавливаем значение 'BOT'
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'

    try {
        // Извлекаем action, id и user из данных callbackQuery
        const { action, id, user } = JSON.parse(ctx.callbackQuery.data)
        // Извлекаем message_id из callbackQuery
        const { message_id } = ctx.callbackQuery.message

        if (action === 'grant_admin_access') {
            // Если действие - предоставление доступа админа
            GrantAdminAccess(ctx, id, user)
            // Удаляем сообщение
            await ctx.deleteMessage(message_id)
            // Отправляем пользователю сообщение об одобрении доступа админа с клавиатурой
            await ctx.telegram.sendMessage(id, '✅ Ваш запрос на доступ админа был одобрен.', Markup.keyboard([
                ['🔹 Продолжить'],
            ]).resize().oneTime())

            // Логируем действие
            LOG(username, 'Action/PermissionsAdminAction')
        } else if (action === 'deny_admin_access') {
            // Если действие - отказ в доступе админа
            // Удаляем сообщение
            await ctx.deleteMessage(message_id)
            // Отправляем пользователю сообщение об отказе в доступе админа
            await ctx.telegram.sendMessage(id, '🚫 Вам отказано в доступе админа.')

            // Логируем действие с отказом в доступе админа
            LOG(username, 'Action/PermissionsAdminAction', 'Отказ в доступе.')
        }
    } catch (error) {
        // Логируем ошибку, если она возникла
        LOG(username, 'Action/PermissionsAdminAction', error, ctx)
    }
}
//* END


module.exports = { PermissionsAction, PermissionsAdminAction }