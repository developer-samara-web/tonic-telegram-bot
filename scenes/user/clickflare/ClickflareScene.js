//? SCENES | Clickflare

//* Requires
const { LOG } = require('@helpers/base')
const { Scenes: { BaseScene }, Markup } = require('telegraf')


//* START
const ClickflareScene = new BaseScene('clickflare');
ClickflareScene.enter(async (ctx) => {
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'
    try {

        await ctx.replyWithHTML('<b>❇️  CLICKFLARE PANEL |</b> Выберите действие:', Markup.keyboard([
            ['🔹 Генерация офферов'],
            ['⬅️ На главную'],
        ]).resize().oneTime());

        LOG(username, 'Scenes/User/Clickflare/ClickflareScene')
    } catch (error) {
        LOG(username, 'Scenes/User/Clickflare/ClickflareScene', error)
    }
});
//* END


module.exports = ClickflareScene