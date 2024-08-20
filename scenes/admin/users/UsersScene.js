//? SCENES | USERS

//* Requires
const { LOG } = require('@helpers/base')
const { HasAdminAccess } = require('@services/firebase')
const { Scenes: { BaseScene }, Markup } = require('telegraf')


//* START
const UsersScene = new BaseScene('users');
UsersScene.enter(async (ctx) => {
    const { username, id } = ctx.message.from
    const admin = await HasAdminAccess(ctx, id)

    try {
        await ctx.replyWithHTML('<b>❇️  USERS PANEL |</b> Выберите действие:', Markup.keyboard([
            [ admin ? '🔹 Добавить' : '🔺 Повысить права', admin ? '🔹 Удалить' : '🔺 Повысить права'],
            [ admin ? '🔹 Список пользователей' : '🔺 Повысить права'],
            ['⬅️ В меню управления'],
        ]).resize().oneTime());

        LOG(username, 'Scenes/Admin/Users/UsersScene')
    } catch (error) {
        LOG(username, 'Scenes/Admin/Users/UsersScene', error, ctx)
    }
});
//* END


module.exports = UsersScene