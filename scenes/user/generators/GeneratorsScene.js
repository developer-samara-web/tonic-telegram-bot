//? SCENES | GENERATORS

//* Requires
const { LOG } = require('@helpers/base')
const { Scenes: { BaseScene }, Markup } = require('telegraf')


//* START
const GeneratorsScene = new BaseScene('generators');
GeneratorsScene.enter(async (ctx) => {
    const { username } = ctx.message.from
    try {
        await ctx.replyWithHTML('<b>❇️  GENERATORS PANEL |</b> Выберите действие:', Markup.keyboard([
            ['🔹 Создать карту'],
            ['⬅️ На главную'],
        ]).resize().oneTime());

        LOG(username, 'Scenes/User/Generators/GeneratorsScene')
    } catch (error) {
        LOG(username, 'Scenes/User/Generators/GeneratorsScene', error, ctx)
    }
});
//* END


module.exports = GeneratorsScene