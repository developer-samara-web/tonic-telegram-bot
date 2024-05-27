//Require
const { LOG } = require('@helpers/helpers')
const { HasAdminAccess } = require('@helpers/users')
const { Scenes: { BaseScene }, Markup } = require('telegraf')

//TonicScene
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

module.exports = UsersScene