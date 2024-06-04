//? SCENES | TONICSTATUS

//* Requires
const { LOG } = require('@helpers/base')
const { Scenes, Composer } = require('telegraf')
const { StatusMiddleware } = require('@middlewares/TonicMiddlewares')


//* START - StageName
const stageName = new Composer()
stageName.on('text', async (ctx) => {
    const { username } = ctx.message.from

    try {
        ctx.wizard.state.data = {}
        await ctx.replyWithHTML('<b>♻️ Для получения статуса пройдите все этапы.</b>\n\n1️⃣ <b>Укажите название ссылки:</b>')

        LOG(username, 'Scenes/User/Tonic/Status/TonicStatusScene/StageName')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/Status/TonicStatusScene/StageName', error)
        return ctx.scene.leave()
    }
})
//* END - StageName


//* START - StageResult
const stageResult = new Composer()
stageResult.on('message', async (ctx) => {
    const { username } = ctx.message.from

    try {
        const { message_id } = await ctx.replyWithHTML(`♻️ Идёт проверка статуса...`)
        const message = await StatusMiddleware(ctx, ctx.message.text)
        await ctx.deleteMessage(message_id);

        if (message) {
            await ctx.replyWithHTML(message)
        } else {
            await ctx.replyWithHTML(`🚫 <b>Ссылка не найдена.</b>`)
        }

        LOG(username, 'Scenes/User/Tonic/Status/TonicStatusScene/StageResult')
        return ctx.scene.leave()
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/Status/TonicStatusScene/StageResult', error)
        return ctx.scene.leave()
    } finally {
        return ctx.scene.enter('tonic')
    }
})
//* END - StageResult


const TonicStatusScene = new Scenes.WizardScene('TonicStatusWizard', stageName, stageResult)
module.exports = TonicStatusScene