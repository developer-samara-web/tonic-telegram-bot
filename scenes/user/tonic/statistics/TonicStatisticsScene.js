//? SCENES | TONICSTATISTIC

//* Requires
const { LOG } = require('@helpers/base')
const { Scenes: { BaseScene }, Markup } = require('telegraf')


//* START - TonicStatisticsScene
const TonicStatisticsScene = new BaseScene('tonic-stats');
TonicStatisticsScene.enter(async (ctx) => {
    const { username } = ctx.message.from
    try {
        await ctx.replyWithHTML('<b>🔹 TONIC STATISTICS PANEL 🔹 </b> Выберите действие:', Markup.keyboard([
            ['🔹 Статистика компании'],
            ['🔹 Статистика ключей', '🔹 Общая статистика'],
            ['🔻 Назад'],
        ]).resize().oneTime());

        LOG(username, 'Scenes/User/Tonic/TonicStatisticsScene')
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/TonicStatisticsScene', error)
    }
});
//* END - TonicStatisticsScene


module.exports = TonicStatisticsScene