//? ACTIONS | PERMISSIONS

//* Requires
const { LOG } = require('@helpers/base')
const { Markup } = require('telegraf')
const { GrantAccess, GrantAdminAccess } = require('@helpers/users')


//* START - PermissionsAction | Подтверждение на выдачу прав доступа
const PermissionsAction = async (ctx) => {
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT';
    try {
        const { action, id, user } = JSON.parse(ctx.callbackQuery.data);
        const { message_id } = ctx.callbackQuery.message

        if (action === 'grant_access') {
            GrantAccess(ctx, id, user);
            await ctx.deleteMessage(message_id);
            await ctx.telegram.sendMessage(id, '✅ Ваш запрос на доступ был одобрен.', Markup.keyboard([
                ['🔹 Начать работу'],
            ]).resize().oneTime());

            LOG(username, 'Permissions/PermissionsAction');
        } else if (action === 'deny_access') {
            await ctx.deleteMessage(message_id);
            await ctx.telegram.sendMessage(id, '🚫 Вам отказано в доступе.');
            LOG(username, 'Permissions/PermissionsAction', 'Отказ в доступе.');
        }
    } catch (error) {
        LOG(username, 'Helpers/Permissions/PermissionsAction', error);
    }
}
//* END - PermissionsAction


//* START - PermissionsAdminAction | Подтверждение на выдачу прав доступа администратора
const PermissionsAdminAction = async (ctx) => {
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT';
    try {
        const { action, id, user } = JSON.parse(ctx.callbackQuery.data);
        const { message_id } = ctx.callbackQuery.message

        if (action === 'grant_admin_access') {
            GrantAdminAccess(ctx, id, user);
            await ctx.deleteMessage(message_id);
            await ctx.telegram.sendMessage(id, '✅ Ваш запрос на доступ админа был одобрен.', Markup.keyboard([
                ['🔹 Продолжить'],
            ]).resize().oneTime());

            LOG(username, 'Permissions/PermissionsAdminAction');
        } else if (action === 'deny_admin_access') {
            await ctx.deleteMessage(message_id);
            await ctx.telegram.sendMessage(id, '🚫 Вам отказано в доступе админа.');
            LOG(username, 'Permissions/PermissionsAdminAction', 'Отказ в доступе.');
        }
    } catch (error) {
        LOG(username, 'Helpers/Permissions/PermissionsAdminAction', error);
    }
}
//* END - PermissionsAdminAction


module.exports = { PermissionsAction, PermissionsAdminAction }