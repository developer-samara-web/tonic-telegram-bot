//? HEARS.JS

//Requires
const { Permissions, PermissionsAccess } = require('@helpers/permissions')

//Hears
module.exports = Bot => {
    Bot.hears('🔹 Начать работу', ctx => Permissions(ctx, 'start'))
    Bot.hears('🔸 Получить доступ', ctx => PermissionsAccess(ctx))
}