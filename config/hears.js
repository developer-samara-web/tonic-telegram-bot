//? HEARS.JS

// Requires
const { Permissions, PermissionsAccess } = require('@helpers/permissions')
const { UsersListMiddleware } = require('@middlewares/UsersMiddlewares')
const { AdminLogsMiddleware } = require('@middlewares/AdminMiddlewares')

// Hears
module.exports = Bot => {
    // GLOBAL
    Bot.hears('🔹 Начать работу', ctx => Permissions(ctx, 'start'))
    Bot.hears('🔸 Получить доступ', ctx => PermissionsAccess(ctx))
    Bot.hears('🔺 На главную', ctx => Permissions(ctx, 'start'))

    // ADMIN
    Bot.hears('⚙️ Панель управления', ctx => Permissions(ctx, 'admin'))
    Bot.hears('🔹 Отправить сообщение', ctx => Permissions(ctx, 'AdminMessageWizard'))
    Bot.hears('🔹 Запросить логи', ctx => AdminLogsMiddleware(ctx))

    // ADMIN USERS
    Bot.hears('🔹 Пользователи', ctx => Permissions(ctx, 'users'))
    Bot.hears('🔹 Список пользователей', ctx => UsersListMiddleware(ctx))
    Bot.hears('🔹 Добавить', ctx => Permissions(ctx, 'UsersAddWizard'))
    Bot.hears('🔹 Удалить', ctx => Permissions(ctx, 'UsersRemoveWizard'))
}