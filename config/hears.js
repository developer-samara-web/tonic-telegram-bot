//? HEARS.JS

// Requires
const { UsersListMiddleware } = require('@middlewares/UsersMiddlewares')
const { AdminLogsMiddleware } = require('@middlewares/AdminMiddlewares')
const { Permissions, PermissionsAdmin, PermissionsAccess } = require('@helpers/permissions')
const { MonitoringSwitcherMiddleware } = require('@middlewares/MonitoringMiddlewares')

// Hears
module.exports = Bot => {
    // GLOBAL
    Bot.hears('🔹 Начать работу', ctx => Permissions(ctx, 'start'))
    Bot.hears('🔸 Получить доступ', ctx => PermissionsAccess(ctx))
    Bot.hears('🔸 Повысить уровень', ctx => PermissionsAccess(ctx))
    Bot.hears('🔺 На главную', ctx => Permissions(ctx, 'start'))

    // USER SETTINGS
    Bot.hears('⚙️ Настройки', ctx => Permissions(ctx, 'settings'))
    Bot.hears('🔹 Добавить таблицу', ctx => Permissions(ctx, 'SheetAddWizard'))

    // ADMIN
    Bot.hears('⚙️ Панель управления', ctx => PermissionsAdmin(ctx, 'admin'))
    Bot.hears('🔹 Отправить сообщение', ctx => PermissionsAdmin(ctx, 'AdminMessageWizard'))
    Bot.hears('🔹 Запросить логи', ctx => PermissionsAdmin(ctx, null, AdminLogsMiddleware(ctx)))
    Bot.hears('🔹 Мониторинг', ctx => PermissionsAdmin(ctx, 'monitoring'))

    // MONITORING
    Bot.hears('🔹 Включить', ctx => PermissionsAdmin(ctx, null, MonitoringSwitcherMiddleware(ctx, true)))
    Bot.hears('🔻 Выключить', ctx => PermissionsAdmin(ctx, null, MonitoringSwitcherMiddleware(ctx, false)))

    // ADMIN USERS
    Bot.hears('🔹 Пользователи', ctx => PermissionsAdmin(ctx, 'users'))
    Bot.hears('🔹 Список пользователей', ctx => PermissionsAdmin(ctx, null, UsersListMiddleware(ctx)))
    Bot.hears('🔹 Добавить', ctx => PermissionsAdmin(ctx, 'UsersAddWizard'))
    Bot.hears('🔹 Удалить', ctx => PermissionsAdmin(ctx, 'UsersRemoveWizard'))
}