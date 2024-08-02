//? SCENE | MEDIAUNIFIERPHOTO

//* Requires
const { LOG } = require('@helpers/base')
const { Scenes, Composer } = require('telegraf')
const { PhotoMiddleware } = require('@middlewares/MediaMiddlewares')

//* START
const stagePhoto = new Composer()
stagePhoto.on('text', async (ctx) => {
    const { username } = ctx.message.from

    try {
        ctx.wizard.state.data = {}
        ctx.wizard.state.data.user = username
        await ctx.replyWithHTML('1️⃣ <b>Отправьте фото:</b>')

        LOG(username, 'Scenes/User/Media/Photo/stagePhoto')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/User/Media/Photo/stagePhoto', error, ctx)
        return ctx.scene.leave()
    }
})
//* END


//* START
const stageResult = new Composer()
stageResult.on('message', async (ctx) => {
    const { username } = ctx.message.from

    try {
        const { message_id } = await ctx.replyWithHTML(`♻️ <b>Идёт уникализация фото...</b>`)
        const message = await PhotoMiddleware(ctx)
        await ctx.deleteMessage(message_id);

        if (!message) {
            await ctx.replyWithHTML(`🚫 <b>Ошибка уникализации.</b>`)
        }

        LOG(username, 'Scenes/User/Media/Photo/StageResult')
        return ctx.scene.leave()
    } catch (error) {
        LOG(username, 'Scenes/User/Media/Photo/StageResult', error, ctx)
        return ctx.scene.leave()
    } finally {
        return ctx.scene.enter('media')
    }
})
//* END


const MediaUnifierPhotoScene = new Scenes.WizardScene('MediaUnifierPhotoWizard', stagePhoto, stageResult)
module.exports = MediaUnifierPhotoScene