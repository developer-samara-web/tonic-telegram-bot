//? CONFIG | HEARS

//* Requires
const { UsersListMiddleware } = require('@middlewares/UsersMiddlewares')
const { AdminLogsMiddleware } = require('@middlewares/AdminMiddlewares')
const { CompanyNotification } = require('@notifications/CompanyNotification')
const { Permissions, PermissionsAdmin, PermissionsAccess, PermissionsAdminAccess } = require('@helpers/permissions')
const { MonitoringSwitcherMiddleware } = require('@middlewares/MonitoringMiddlewares')


module.exports = Bot => {
    //* GLOBAL
    Bot.hears(['🔹 Начать работу', '🔹 Продолжить', '🔺 На главную'], ctx => Permissions(ctx, 'start'))
    Bot.hears('🔸 Получить доступ', ctx => PermissionsAccess(ctx))
    Bot.hears('🔹 Повысить уровень', ctx => PermissionsAdminAccess(ctx))

    //* MEDIA
    Bot.hears('🔹 Уникализатор', ctx => Permissions(ctx, 'media'))
    Bot.hears('🔹 Фото', ctx => Permissions(ctx, 'MediaUnifierPhotoWizard'))
    Bot.hears('🔹 Видео', ctx => Permissions(ctx, 'MediaUnifierVideoWizard'))

    //* TONIC
    Bot.hears(['🔹 Tonic', '🔻 Назад'], ctx => Permissions(ctx, 'tonic'))
    Bot.hears('🔹 Создать', ctx => Permissions(ctx, 'TonicLinkWizard'))
    Bot.hears('🔹 Редактировать', ctx => Permissions(ctx, 'tonic-edits'))
    Bot.hears('🔹 Запросить ссылки', ctx => Permissions(ctx, null, CompanyNotification))
    Bot.hears('🔹 Проверить статус', ctx => Permissions(ctx, 'TonicStatusWizard'))
    Bot.hears('🔹 Статистика', ctx => Permissions(ctx, 'tonic-stats'))

    //* TONIC EDITS
    Bot.hears('🔹 Добавить пиксель', ctx => Permissions(ctx, 'TonicPixelWizard'))
    Bot.hears('🔹 Добавть ключи', ctx => Permissions(ctx, 'TonicSetKeywordsWizard'))
    Bot.hears("🔹 Добавть Postback'и", ctx => Permissions(ctx, 'TonicСallbackWizard'))

    //* TONIC STATS
    Bot.hears('🔹 Общая статистика', ctx => Permissions(ctx, 'TonicStatisticsWizard'))
    Bot.hears('🔹 Статистика компании', ctx => Permissions(ctx, 'TonicCompanyWizard'))
    Bot.hears('🔹 Статистика ключей', ctx => Permissions(ctx, 'TonicKeywordsWizard'))

    //* MONITORING
    Bot.hears('🔹 Включить', ctx => PermissionsAdmin(ctx, null, MonitoringSwitcherMiddleware, true))
    Bot.hears('🔻 Выключить', ctx => PermissionsAdmin(ctx, null, MonitoringSwitcherMiddleware, false))

    //* USER SETTINGS
    Bot.hears('⚙️ Настройки', ctx => Permissions(ctx, 'settings'))
    Bot.hears('🔹 Добавить таблицу', ctx => Permissions(ctx, 'SheetAddWizard'))
    Bot.hears('🔹 Добавить оффер', ctx => Permissions(ctx, 'OfferAddWizard'))
    Bot.hears('🔹 Добавить домен', ctx => Permissions(ctx, 'DomainAddWizard'))

    //* ADMIN
    Bot.hears('⚙️ Панель управления', ctx => PermissionsAdmin(ctx, 'admin'))
    Bot.hears('🔹 Отправить сообщение', ctx => PermissionsAdmin(ctx, 'AdminMessageWizard'))
    Bot.hears('🔹 Запросить логи', ctx => PermissionsAdmin(ctx, null, AdminLogsMiddleware(ctx)))
    Bot.hears('🔹 Мониторинг', ctx => PermissionsAdmin(ctx, 'monitoring'))

    //* ADMIN USERS
    Bot.hears('🔹 Пользователи', ctx => PermissionsAdmin(ctx, 'users'))
    Bot.hears('🔹 Список пользователей', ctx => PermissionsAdmin(ctx, null, UsersListMiddleware(ctx)))
    Bot.hears('🔹 Добавить', ctx => PermissionsAdmin(ctx, 'UsersAddWizard'))
    Bot.hears('🔹 Удалить', ctx => PermissionsAdmin(ctx, 'UsersRemoveWizard'))
}