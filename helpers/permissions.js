//? HELPERS | PERMISSIONS

//* Requires
const { LOG } = require('@helpers/base')
const { Bot } = require('@services/telegram')
const { HasAccess, HasAdminAccess } = require('@services/firebase');
const { Markup } = require('telegraf')


//* START
const Permissions = async (ctx, scene, init = null) => {
    // Получаем имя пользователя из контекста
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'

    try {
        // Получаем id пользователя из контекста
        const { id } = ctx.from

        // Проверяем наличие доступа у пользователя
        if (await HasAccess(ctx, id)) {
            // Если есть инициализирующая функция, вызываем её, иначе переключаемся на указанную сцену
            init ? init(ctx) : ctx.scene.enter(scene)
        } else {
            // Если доступа нет, отправляем сообщение с предложением получить доступ
            await ctx.replyWithHTML(
                '⚠️ <b>У вас нет доступа!</b>\nДля получения доступа нажмите кнопку <b>"Получить доступ"</b>. После подтвержедния вам придёт сообщение о доступности бота и вы сможете начать работу.',
                Markup.keyboard([
                    ['🔸 Получить доступ']
                ])
                    .oneTime()
                    .resize()
            )
        }

        // Логируем информацию о выполнении функции
        LOG(username, 'Helpers/Permissions/Permissions')
    } catch (error) {
        // Логируем ошибку, если она произошла
        LOG(username, 'Helpers/Permissions/Permissions', error, ctx)
    }
}
//* END


//* START
const PermissionsAdmin = async (ctx, scene, init = null, param) => {
    // Получаем имя пользователя из контекста
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'

    try {
        // Получаем id пользователя из контекста
        const { id } = ctx.from

        // Проверяем наличие административного доступа у пользователя
        if (await HasAdminAccess(ctx, id)) {
            // Если есть инициализирующая функция, вызываем её с параметром, иначе переключаемся на указанную сцену
            init ? init(ctx, param) : ctx.scene.enter(scene)
        } else {
            // Если доступа нет, отправляем сообщение с предложением повысить уровень доступа
            await ctx.replyWithHTML(
                '⚠️ <b>У вас нет доступа!</b>\nДля получения доступа нажмите кнопку <b>"Повысить уровень"</b>. После подтвержедния вам придёт сообщение об обновлении прав доступа.',
                Markup.keyboard([
                    ['🔸 Повысить уровень']
                ])
                    .oneTime()
                    .resize()
            )
        }

        // Логируем информацию о выполнении функции
        LOG(username, 'Helpers/Permissions/PermissionsAdmin')
    } catch (error) {
        // Логируем ошибку, если она произошла
        LOG(username, 'Helpers/Permissions/PermissionsAdmin', error, ctx)
    }
}
//* END


//* START
const PermissionsAccess = async (ctx) => {
    // Получаем имя пользователя из контекста
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'

    try {
        // Получаем id пользователя из контекста
        const userId = ctx.from?.id

        // Создаем объекты для разрешения и запрета доступа
        const grant = { action: 'grant_access', id: userId, user: username }
        const deny = { action: 'deny_access', id: userId, user: username }

        // Создаем клавиатуру с кнопками для разрешения и запрета доступа
        const keyboard = Markup.inlineKeyboard([
            Markup.button.callback('🔹 Разрешить', JSON.stringify(grant)),
            Markup.button.callback('🔸 Запретить', JSON.stringify(deny))
        ])

        // Проверяем наличие доступа у пользователя
        if (!await HasAccess(ctx, userId)) {
            // Отправляем сообщение администратору с запросом на доступ
            await Bot.telegram.sendMessage(process.env.TELEGRAM_ADMIN_ID, `♻️ Пользователь <b>${username}</b> запросил доступ. Разрешить?`, {
                parse_mode: 'HTML',
                reply_markup: keyboard.reply_markup
            })
        }

        // Логируем информацию о выполнении функции
        LOG(username, 'Helpers/Permissions/PermissionsAccess')
    } catch (error) {
        // Логируем ошибку, если она произошла
        LOG(username, 'Helpers/Permissions/PermissionsAccess', error, ctx)
    }
}
//* END


//* START
const PermissionsAdminAccess = async (ctx) => {
    // Получаем имя пользователя из контекста
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'
    
    try {
        // Получаем id пользователя из контекста
        const userId = ctx.from?.id

        // Создаем объекты для разрешения и запрета доступа администратора
        const grant = { action: 'grant_admin_access', id: userId, user: username }
        const deny = { action: 'deny_admin_access', id: userId, user: username }

        // Создаем клавиатуру с кнопками для разрешения и запрета доступа администратора
        const keyboard = Markup.inlineKeyboard([
            Markup.button.callback('🔹 Разрешить', JSON.stringify(grant)),
            Markup.button.callback('🔸 Запретить', JSON.stringify(deny))
        ])

        // Отправляем сообщение администратору с запросом на доступ администратора
        await Bot.telegram.sendMessage(process.env.TELEGRAM_ADMIN_ID, `♻️ Пользователь <b>${username}</b> запросил доступ администратора. Разрешить?`, {
            parse_mode: 'HTML',
            reply_markup: keyboard.reply_markup
        })

        // Логируем информацию о выполнении функции
        LOG(username, 'Helpers/Permissions/PermissionsAdminAccess')
    } catch (error) {
        // Логируем ошибку, если она произошла
        LOG(username, 'Helpers/Permissions/PermissionsAdminAccess', error, ctx)
    }
}
//* END


module.exports = { 
    Permissions, 
    PermissionsAdmin, 
    PermissionsAccess, 
    PermissionsAdminAccess
}
