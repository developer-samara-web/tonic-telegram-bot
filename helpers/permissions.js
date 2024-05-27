//Require
const { Bot } = require('@config/telegram')
const { LOG } = require('@helpers/helpers')
const { HasAccess, GrantAccess } = require('@helpers/users');
const { Markup } = require('telegraf')

//Permissions
const Permissions = async (ctx, scene) => {
    const { username } = ctx.message.from
    try {
        const userId = ctx.from.id;

        if (HasAccess(ctx, userId)) {
            ctx.scene.enter(scene)
        } else {
            await ctx.replyWithHTML('⚠️ <b>У вас нет доступа!</b>\nДля получения доступа нажмите кнопку <b>"Получить доступ"</b>. После подтвержедния вам придёт сообщение о доступности бота и вы сможете начать работу.',
                Markup.keyboard([
                    ['🔸 Получить доступ']
                ])
                    .oneTime()
                    .resize()
            )
        }

        LOG(username, 'Helpers/Permissions/Permissions')
    } catch (error) {
        LOG(username, 'Helpers/Permissions/Permissions', error)
    }
}

//Permissions Admin
const PermissionsAdmin = async (ctx, scene) => {
    const { username } = ctx.message.from
    try {
        const userId = ctx.from.id;

        if (HasAdminAccess(ctx, userId)) {
            ctx.scene.enter(scene)
        } else {
            await ctx.replyWithHTML('⚠️ <b>У вас нет доступа!</b>\nДля получения доступа нажмите кнопку <b>"Получить доступ"</b>. После подтвержедния вам придёт сообщение о доступности бота и вы сможете начать работу.',
                Markup.keyboard([
                    ['🔸 Получить доступ']
                ])
                    .oneTime()
                    .resize()
            )
        }

        LOG(username, 'Helpers/Permissions/PermissionsAdmin')
    } catch (error) {
        LOG(username, 'Helpers/Permissions/PermissionsAdmin', error)
    }
}

//PermissionsAccess
const PermissionsAccess = async (ctx) => {
    const { username } = ctx.message.from
    try {
        const userId = ctx.from.id;

        const grant = { action: 'grant_access', id: userId, user: username }
        const deny = { action: 'deny_access', id: userId, user: username }

        const keyboard = Markup.inlineKeyboard([
            Markup.button.callback('🔹 Разрешить', JSON.stringify(grant)),
            Markup.button.callback('🔸 Запретить', JSON.stringify(deny))
        ]);

        if (!HasAccess(userId)) {
            await Bot.telegram.sendMessage(54355560, `♻️ Пользователь <b>${username}</b> запросил доступ. Разрешить?`, {
                parse_mode: 'HTML',
                reply_markup: keyboard.reply_markup
            })
        }

        LOG(username, 'Helpers/Permissions/PermissionsAccess')
    } catch (error) {
        LOG(username, 'Permissions/PermissionsAccess', error)
    }
}

//PermissionsAction
const PermissionsAction = async (ctx) => {
    const { username } = ctx.message.from
    try {
        const { action, id, user } = JSON.parse(ctx.callbackQuery.data);

        if (action === 'grant_access') {
            GrantAccess(id, user);
            await ctx.telegram.sendMessage(id, '✅ Ваш запрос на доступ был одобрен.', Markup.keyboard([
                ['🔹 Начать работу'],
            ]).resize().oneTime())

            LOG(username, 'Permissions/PermissionsAction', 'Доступ разрешён.')
        } else if (action === 'deny_access') {
            await ctx.telegram.sendMessage(id, '🚫 Вам отказано в доступе.')
            LOG(username, 'Permissions/PermissionsAction', 'Отказ в доступе.')
        }
    } catch (error) {
        LOG(username, 'Permissions/PermissionsAction', error)
    }
}

module.exports = { Permissions, PermissionsAdmin, PermissionsAction, PermissionsAccess }