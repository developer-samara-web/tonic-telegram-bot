//? SCENES | ADMIN

//* Requires
const { LOG } = require('@helpers/base')
const { HasAdminAccess } = require('@services/firebase')
const { Scenes: { BaseScene }, Markup } = require('telegraf')


//* START
const AdminScene = new BaseScene('admin');
AdminScene.enter(async (ctx) => {
    const { username, id } = ctx.message.from
    const admin = await HasAdminAccess(ctx, id)
    
    try {
        await ctx.replyWithHTML('<b>❇️  ADMIN PANEL |</b> Выберите действие:', Markup.keyboard([
            [ admin ? '🔹 Отправить сообщение' : '🔺 Повысить права'],
            [ admin ? '🔹 Пользователи' : '🔺 Повысить права', admin ? '🔹 Запросить логи' : '🔺 Повысить права'],
            [ admin ? '🔹 Мониторинг' : '🔺 Повысить права'],
            ['⬅️ На главную'],
        ]).resize().oneTime());
        
        LOG(username, 'Scenes/Admin/AdminScene')
    } catch (error) {
        LOG(username, 'Scenes/Admin/AdminScene', error, ctx)
    }
});
//* END


module.exports = AdminScene