//? SCENES | TONICEDITS

//* Requires
const { LOG } = require('@helpers/base')
const { HasAdminAccess } = require('@helpers/users')
const { Scenes: { BaseScene }, Markup } = require('telegraf')


//* START - TonicEditsScene
const TonicEditsScene = new BaseScene('tonic-edits');
TonicEditsScene.enter(async (ctx) => {
    const { username, id } = ctx.message.from
    try {
        const admin = await HasAdminAccess(ctx, id)

        await ctx.replyWithHTML('<b>🔹 TONIC EDITS PANEL 🔹</b> Выберите действие:', Markup.keyboard([
            ['🔹 Добавить пиксель', '🔹 Добавть ключи'],
            ['🔻 Назад'],
        ]).resize().oneTime());

        LOG(username, 'Scenes/User/Tonic/Edits/TonicEditsScene')
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/Edits/TonicEditsScene', error)
    }
});
//* END - TonicEditsScene


module.exports = TonicEditsScene