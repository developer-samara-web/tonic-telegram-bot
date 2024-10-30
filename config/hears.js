//? CONFIG | HEARS

//* Requires
const { UsersListMiddleware } = require('@middlewares/UsersMiddlewares')
const { AdminLogsMiddleware } = require('@middlewares/AdminMiddlewares')
const { Permissions, PermissionsAdmin, PermissionsAccess, PermissionsAdminAccess } = require('@helpers/permissions')
const { MonitoringListAllMiddleware, SetMonitoringItemMiddleware } = require('@middlewares/MonitoringMiddlewares')
const { CreateOffersCSV } = require('@middlewares/ClickflareMiddlewares')


module.exports = Bot => {
    //* GLOBAL
    Bot.hears(['🔹 Начать работу', '🔹 Продолжить', '⬅️ На главную'], ctx => Permissions(ctx, 'start'))
    Bot.hears('🔸 Получить доступ', ctx => PermissionsAccess(ctx))
    Bot.hears('🔹 Повысить уровень', ctx => PermissionsAdminAccess(ctx))

    //* GENERATORS
    Bot.hears('📝 Генераторы', ctx => Permissions(ctx, 'generators'))
    Bot.hears('🔹 Создать карту', ctx => Permissions(ctx, 'CardsWizard'))

    //* MEDIA
    Bot.hears('🖼 Уникализаторы', ctx => Permissions(ctx, 'media'))
    Bot.hears('🔹 Фото', ctx => Permissions(ctx, 'MediaUnifierPhotoWizard'))
    Bot.hears('🔹 Видео', ctx => Permissions(ctx, 'MediaUnifierVideoWizard'))

    //* TONIC
    Bot.hears(['🔹 Tonic', '⬅️ В меню тоника'], ctx => Permissions(ctx, 'tonic'))
    Bot.hears('⬆️ Отправить в очередь', ctx => Permissions(ctx, null, SetMonitoringItemMiddleware))
    Bot.hears('🔹 Создать компанию', ctx => Permissions(ctx, 'TonicLinkWizard'))
    Bot.hears('🔹 Управление', ctx => Permissions(ctx, 'tonic-edits'))
    Bot.hears('🔹 Статус компании', ctx => Permissions(ctx, 'TonicStatusWizard'))
    Bot.hears('🔹 Статистика', ctx => Permissions(ctx, 'tonic-stats'))

    //* CLICKFLARE
    Bot.hears('🔹 ClickFlare', ctx => Permissions(ctx, 'clickflare'))
    Bot.hears('🔹 Генерация офферов', ctx => Permissions(ctx, 'ClickflareGenerateWizard'))

    //* TONIC EDITS
    Bot.hears('🔹 Добавить пиксель', ctx => Permissions(ctx, 'TonicPixelWizard'))
    Bot.hears('🔹 Добавть ключи', ctx => Permissions(ctx, 'TonicSetKeywordsWizard'))
    Bot.hears('🔹 Удалить ключи', ctx => Permissions(ctx, 'TonicDelKeywordsWizard'))
    Bot.hears('🔹 Добавть постбеки', ctx => Permissions(ctx, 'TonicСallbackWizard'))

    //* TONIC STATS
    Bot.hears('🔹 Общая статистика', ctx => Permissions(ctx, 'TonicStatisticsWizard'))
    Bot.hears('🔹 Статистика компании', ctx => Permissions(ctx, 'TonicCompanyWizard'))
    Bot.hears('🔹 Статистика ключей', ctx => Permissions(ctx, 'TonicKeywordsWizard'))

    //* MONITORING
    Bot.hears('🔹 Компании в работе', ctx => PermissionsAdmin(ctx, null, MonitoringListAllMiddleware, true))

    //* USER SETTINGS
    Bot.hears('⚙️ Настройки', ctx => Permissions(ctx, 'settings'))
    Bot.hears('🔹 Добавить таблицу', ctx => Permissions(ctx, 'SheetAddWizard'))
    Bot.hears('🔹 Добавить оффер', ctx => Permissions(ctx, 'OfferAddWizard'))
    Bot.hears('🔹 Добавить домен', ctx => Permissions(ctx, 'DomainAddWizard'))

    //* ADMIN
    Bot.hears(['⚙️ Панель управления', '⬅️ В меню управления'], ctx => PermissionsAdmin(ctx, 'admin'))
    Bot.hears('🔹 Отправить сообщение', ctx => PermissionsAdmin(ctx, 'AdminMessageWizard'))
    Bot.hears('🔹 Запросить логи', ctx => PermissionsAdmin(ctx, null, AdminLogsMiddleware))
    Bot.hears('🔹 Мониторинг', ctx => PermissionsAdmin(ctx, 'monitoring'))

    //* ADMIN USERS
    Bot.hears('🔹 Пользователи', ctx => PermissionsAdmin(ctx, 'users'))
    Bot.hears('🔹 Список пользователей', ctx => PermissionsAdmin(ctx, null, UsersListMiddleware))
    Bot.hears('🔹 Добавить', ctx => PermissionsAdmin(ctx, 'UsersAddWizard'))
    Bot.hears('🔹 Удалить', ctx => PermissionsAdmin(ctx, 'UsersRemoveWizard'))
}