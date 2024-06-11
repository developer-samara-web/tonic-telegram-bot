//Require
const { LOG } = require('@helpers/base')
const { Scenes, Composer, Markup } = require('telegraf')
const { VideoMiddleware } = require('@middlewares/MediaMiddlewares')

//Stage Video
const stageVideo = new Composer()
stageVideo.on('text', async (ctx) => {
    const { username } = ctx.message.from

    try {
        ctx.wizard.state.data = {}
        ctx.wizard.state.data.user = username
        await ctx.replyWithHTML('1️⃣ <b>Отправьте видео файлом:</b>')

        LOG(username, 'Scenes/Media/Video/stageVideo')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/Media/Video/stageVideo', error)
        return ctx.scene.leave()
    }
})

//Stage Result
const stageResult = new Composer()
stageResult.on('message', async (ctx) => {
    const { username } = ctx.message.from
    
    try {
        const { message_id } = await ctx.replyWithHTML(`♻️ <b>Идёт уникализация видео...</b>`)
        const message = await VideoMiddleware(ctx)
        await ctx.deleteMessage(message_id);

        if (!message) {
            await ctx.replyWithHTML(`🚫 <b>Ошибка уникализации.</b>`)
        }

        LOG(username, 'Scenes/Media/Video/StageResult')
        return ctx.scene.leave()
    } catch (error) {
        LOG(username, 'Scenes/Media/Video/StageResult', error)
        return ctx.scene.leave()
    } finally {
        return ctx.scene.enter('media')
    }
})

const MediaUnifierVideoScene = new Scenes.WizardScene('MediaUnifierVideoWizard', stageVideo, stageResult)
module.exports = MediaUnifierVideoScene