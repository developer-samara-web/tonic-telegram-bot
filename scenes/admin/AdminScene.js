//? ADMINSCENE.JS

//Require
const { LOG } = require('@helpers/helpers')
const { HasAdminAccess } = require('@helpers/users')
const { Scenes: { BaseScene }, Markup } = require('telegraf')

//TonicScene
const AdminScene = new BaseScene('admin');
AdminScene.enter(async (ctx) => {
    const { username, id } = ctx.message.from
    const admin = await HasAdminAccess(ctx, id)
    
    try {
        await ctx.replyWithHTML('<b>🔹 ADMIN PANEL 🔹</b> Выберите действие:', Markup.keyboard([
            [ admin ? '🔹 Отправить сообщение' : '🔺 Повысить права'],
            [ admin ? '🔹 Управление пользователями' : '🔺 Повысить права'],
            [ admin ? '🔹 Запросить логи' : '🔺 Повысить права'],
            ['🔺 На главную'],
        ]).resize().oneTime());
        
        LOG(username, 'Scenes/Admin/AdminScene')
    } catch (error) {
        LOG(username, 'Scenes/Admin/AdminScene', error)
    }
});

module.exports = AdminScene