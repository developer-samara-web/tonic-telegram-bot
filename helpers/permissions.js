//? PERMISSIONS.JS

//Require
const { Bot } = require('@config/telegram')
const { LOG } = require('@helpers/helpers')
const { HasAccess, GrantAccess, HasAdminAccess, GrantAdminAccess } = require('@helpers/users');
const { Markup } = require('telegraf')

//Permissions
const Permissions = async (ctx, scene, func = null) => {
    const username = ctx.message?.from?.username || 'BOT';
    try {
        const userId = ctx.from.id;

        if (HasAccess(ctx, userId)) {
            func ? func() : ctx.scene.enter(scene)
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
const PermissionsAdmin = async (ctx, scene, func = null) => {
    const username = ctx.message?.from?.username || 'BOT';
    try {
        const userId = ctx.from.id;

        if (HasAdminAccess(ctx, userId)) {
            func ? func() : ctx.scene.enter(scene)
        } else {
            await ctx.replyWithHTML('⚠️ <b>У вас нет доступа!</b>\nДля получения доступа нажмите кнопку <b>"Повысить уровень"</b>. После подтвержедния вам придёт сообщение об обновлении прав доступа.',
            Markup.keyboard([
                ['🔸 Повысить уровень']
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

//Permissions Access
const PermissionsAccess = async (ctx) => {
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT';
    try {
        const userId = ctx.from?.id;

        const grant = { action: 'grant_access', id: userId, user: username };
        const deny = { action: 'deny_access', id: userId, user: username };

        const keyboard = Markup.inlineKeyboard([
            Markup.button.callback('🔹 Разрешить', JSON.stringify(grant)),
            Markup.button.callback('🔸 Запретить', JSON.stringify(deny))
        ]);

        if (!HasAccess(ctx, userId)) {
            await Bot.telegram.sendMessage(process.env.TELEGRAM_ADMIN_ID, `♻️ Пользователь <b>${username}</b> запросил доступ. Разрешить?`, {
                parse_mode: 'HTML',
                reply_markup: keyboard.reply_markup
            });
        }

        LOG(username, 'Helpers/Permissions/PermissionsAccess');
    } catch (error) {
        LOG(username, 'Helpers/Permissions/PermissionsAccess', error);
    }
};

//Permissions Action
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
};

//Permissions Admin Access
const PermissionsAdminAccess = async (ctx) => {
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT';
    try {
        const userId = ctx.from?.id;

        const grant = { action: 'grant_admin_access', id: userId, user: username };
        const deny = { action: 'deny_admin_access', id: userId, user: username };

        const keyboard = Markup.inlineKeyboard([
            Markup.button.callback('🔹 Разрешить', JSON.stringify(grant)),
            Markup.button.callback('🔸 Запретить', JSON.stringify(deny))
        ]);

        await Bot.telegram.sendMessage(process.env.TELEGRAM_ADMIN_ID, `♻️ Пользователь <b>${username}</b> запросил доступ администратора. Разрешить?`, {
            parse_mode: 'HTML',
            reply_markup: keyboard.reply_markup
        });

        LOG(username, 'Helpers/Permissions/PermissionsAdminAccess');
    } catch (error) {
        LOG(username, 'Helpers/Permissions/PermissionsAdminAccess', error);
    }
};

//Permissions Admin Action
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
};

module.exports = { Permissions, PermissionsAdmin, PermissionsAction, PermissionsAccess, PermissionsAdminAccess, PermissionsAdminAction }