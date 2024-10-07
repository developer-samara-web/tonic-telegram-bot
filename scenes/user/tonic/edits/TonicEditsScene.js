//? SCENES | TONICEDITS

//* Requires
const { LOG } = require('@helpers/base')
const { Scenes: { BaseScene }, Markup } = require('telegraf')


//* START
const TonicEditsScene = new BaseScene('tonic-edits');
TonicEditsScene.enter(async (ctx) => {
    const { username, id } = ctx.message.from
    try {
        await ctx.replyWithHTML('<b>❇️  TONIC EDITS PANEL |</b> Выберите действие:', Markup.keyboard([
            ['🔹 Статус компании'],
            ['🔹 Добавть ключи', '🔹 Удалить ключи'],
            ['🔹 Добавть постбеки', '🔹 Добавить пиксель'],
            ['⬅️ В меню тоника'],
        ]).resize().oneTime());

        LOG(username, 'Scenes/User/Tonic/Edits/TonicEditsScene')
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/Edits/TonicEditsScene', error, ctx)
    }
});
//* END


module.exports = TonicEditsScene