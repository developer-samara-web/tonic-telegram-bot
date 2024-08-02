//? SCENE | MEDIA

//* Requires
const { LOG } = require('@helpers/base')
const { Scenes: { BaseScene }, Markup } = require('telegraf')


//* START
const MediaScene = new BaseScene('media');
MediaScene.enter(async (ctx) => {
    const { username } = ctx.message.from

    try {
        await ctx.replyWithHTML('<b>❇️  UNIFIER PANEL |</b> Выберите действие:', Markup.keyboard([
            ['🔹 Фото', '🔹 Видео'],
            ['⬅️ На главную'],
        ]).resize().oneTime());

        LOG(username, 'Scenes/User/Media/MediaScene')
    } catch (error) {
        LOG(username, 'Scenes/User/Media/MediaScene', error, ctx, ctx)
    }
})
//* END

module.exports = MediaScene