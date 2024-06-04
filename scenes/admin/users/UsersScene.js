//? SCENES | USERS

//* Requires
const { LOG } = require('@helpers/base')
const { HasAdminAccess } = require('@helpers/users')
const { Scenes: { BaseScene }, Markup } = require('telegraf')


//* START - TonicScene
const UsersScene = new BaseScene('users');
UsersScene.enter(async (ctx) => {
    const { username, id } = ctx.message.from
    const admin = await HasAdminAccess(ctx, id)

    try {
        await ctx.replyWithHTML('<b>🔹 USERS PANEL 🔹</b> Выберите действие:', Markup.keyboard([
            [ admin ? '🔹 Добавить' : '🔺 Повысить права', admin ? '🔹 Удалить' : '🔺 Повысить права'],
            [ admin ? '🔹 Список пользователей' : '🔺 Повысить права'],
            ['🔺 На главную'],
        ]).resize().oneTime());

        LOG(username, 'Scenes/Admin/Users/UsersScene')
    } catch (error) {
        LOG(username, 'Scenes/Admin/Users/UsersScene', error)
    }
});
//* END- TonicScene


module.exports = UsersScene