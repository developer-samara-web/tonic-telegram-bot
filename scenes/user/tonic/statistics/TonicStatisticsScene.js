//? SCENES | TONICSTATISTIC

//* Requires
const { LOG } = require('@helpers/base')
const { Scenes: { BaseScene }, Markup } = require('telegraf')


//* START
const TonicStatisticsScene = new BaseScene('tonic-stats');
TonicStatisticsScene.enter(async (ctx) => {
    const { username } = ctx.message.from
    try {
        await ctx.replyWithHTML('<b>❇️  TONIC STATISTICS PANEL |</b> Выберите действие:', Markup.keyboard([
            ['🔹 Статистика компании'],
            ['🔹 Статистика ключей', '🔹 Общая статистика'],
            ['⬅️ В меню тоника'],
        ]).resize().oneTime());

        LOG(username, 'Scenes/User/Tonic/TonicStatisticsScene')
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/TonicStatisticsScene', error, ctx)
    }
});
//* END


module.exports = TonicStatisticsScene