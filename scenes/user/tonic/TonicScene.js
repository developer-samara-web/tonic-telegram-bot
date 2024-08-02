//? SCENES | TONIC

//* Requires
const { LOG } = require('@helpers/base')
const { Scenes: { BaseScene }, Markup } = require('telegraf')


//* START - TonicScene
const TonicScene = new BaseScene('tonic');
TonicScene.enter(async (ctx) => {
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'
    try {

        await ctx.replyWithHTML('<b>❇️  TONIC PANEL |</b> Выберите действие:', Markup.keyboard([
            ['⬆️ Отправить в очередь'],
            ['🔹 Управление', '🔹 Статистика'],
            ['⬅️ На главную'],
        ]).resize().oneTime());

        LOG(username, 'Scenes/User/Tonic/TonicScene')
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/TonicScene', error)
    }
});
//* END - TonicScene


module.exports = TonicScene