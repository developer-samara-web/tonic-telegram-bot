//? HEARS.JS

//Requires
const { Permissions, PermissionsAccess } = require('@helpers/permissions')

//Hears
module.exports = Bot => {
    // GLOBAL
    Bot.hears('🔹 Начать работу', ctx => Permissions(ctx, 'start'))
    Bot.hears('🔸 Получить доступ', ctx => PermissionsAccess(ctx))
    Bot.hears('🔺 На главную', ctx => Permissions(ctx, 'start'))

    // ADMIN
    Bot.hears('⚙️ Панель управления', ctx => Permissions(ctx, 'admin'))
    Bot.hears('🔹 Отправить сообщение', ctx => {})
    Bot.hears('🔹 Запросить логи', ctx => {})

    // ADMIN USERS
    Bot.hears('🔹 Управление пользователями', ctx => Permissions(ctx, 'users'))
    Bot.hears('🔹 Добавить', ctx => {})
    Bot.hears('🔹 Удалить', ctx => {})
    Bot.hears('🔹 Список пользователей', ctx => {})
}