//? SCENES | MONITORING

//* Requires
const { LOG } = require('@helpers/base')
const { HasAdminAccess } = require('@helpers/users')
const { Scenes: { BaseScene }, Markup } = require('telegraf')


//* START - MonitoringScene
const MonitoringScene = new BaseScene('monitoring');
MonitoringScene.enter(async (ctx) => {
    const { username, id } = ctx.message.from
    const { status } = require('@data/monitoring')
    const admin = await HasAdminAccess(ctx, id)
    
    try {
        await ctx.replyWithHTML(`<b>🔹 MONITORING PANEL 🔹</b> :  ${status ? '✅ Активно' : '🚫 Выключено'}`, Markup.keyboard([
            [ admin ? '🔹 Включить' : '🔺 Повысить права', admin ? '🔻 Выключить' : '🔺 Повысить права'],
            ['🔺 На главную'],
        ]).resize().oneTime());
        
        LOG(username, 'Scenes/Admin/Monitoring/MonitoringScene')
    } catch (error) {
        LOG(username, 'Scenes/Admin/Monitoring/MonitoringScene', error)
    }
})
//* END - MonitoringScene


module.exports = MonitoringScene