//? SCENES | MONITORING

//* Requires
const { LOG } = require('@helpers/base')
const { HasAdminAccess } = require('@services/firebase')
const { Scenes: { BaseScene }, Markup } = require('telegraf')


//* START
const MonitoringScene = new BaseScene('monitoring');
MonitoringScene.enter(async (ctx) => {
    const { username, id } = ctx.message.from
    const admin = await HasAdminAccess(ctx, id)
    
    try {
        await ctx.replyWithHTML(`<b>❇️  MONITORING PANEL |</b> Выберите действие:`, Markup.keyboard([
            admin ? ['🔹 Компании в работе', '🔹 Обновить'] : ['🔺 Повысить права'],
            ['⬅️ В меню управления'],
        ]).resize().oneTime());
        
        LOG(username, 'Scenes/Admin/Monitoring/MonitoringScene')
    } catch (error) {
        LOG(username, 'Scenes/Admin/Monitoring/MonitoringScene', error, ctx)
    }
})
//* END


module.exports = MonitoringScene