//? HELPERS | PERMISSIONS

//* Requires
const { LOG } = require('@helpers/base')
const { Bot } = require('@config/telegram')
const { HasAccess, HasAdminAccess } = require('@helpers/users');
const { Markup } = require('telegraf')


//* START - Permissions | Проверка прав доступа
const Permissions = async (ctx, scene, init = null) => {
    const username = ctx.message?.from?.username || 'BOT';

    try {
        const { id } = ctx.from;

        if (HasAccess(ctx, id)) {
            init ? init(ctx) : ctx.scene.enter(scene)
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
//* END - Permissions


//* START - PermissionsAdmin | Проверка прав доступа администратора
const PermissionsAdmin = async (ctx, scene, init = null, param) => {
    const username = ctx.message?.from?.username || 'BOT';
    try {
        const { id } = ctx.from;

        if (HasAdminAccess(ctx, id)) {
            init ? init(ctx, param) : ctx.scene.enter(scene)
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
//* END - PermissionsAdmin


//* START - PermissionsAccess | Запрос на получение доступа
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
}
//* END - PermissionsAccess


//* START - PermissionsAdminAccess | Запрос на получение доступа администратора
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
}
//* END - PermissionsAdminAccess


module.exports = { 
    Permissions, 
    PermissionsAdmin, 
    PermissionsAccess, 
    PermissionsAdminAccess
}