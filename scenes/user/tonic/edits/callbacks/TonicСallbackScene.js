//? SCENES | TONICCALLBACK

//* Requires
const { LOG } = require('@helpers/base')
const { Scenes, Composer, Markup } = require('telegraf')
const { SetCallbackMiddleware } = require('@middlewares/TonicMiddlewares')

//* START - StageName
const stageName = new Composer()
stageName.on('text', async (ctx) => {
    const { username } = ctx.message.from

    try {
        ctx.wizard.state.data = {}
        await ctx.replyWithHTML("<b>♻️ Для установки Postback'ов пройдите все этапы.</b>\n\n1️⃣ <b>Укажите название ссылки:</b>")

        LOG(username, 'Scenes/User/Tonic/Edits/Сallbacks/TonicСallbackScene/StageName')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/Edits/Сallbacks/TonicСallbackScene/StageName', error)
        return ctx.scene.leave()
    }
})
//* END - StageName


//* START - StageDomain
const stageDomain = new Composer()
stageDomain.on('text', async (ctx) => {
    const { data } = ctx.wizard.state
    const { username } = ctx.message.from

    try {
        data.name = ctx.message.text
        await ctx.replyWithHTML('2️⃣ <b>Укажите домен постбеков:</b>',
            Markup.keyboard([
                ['apustalligndp.pro', 'flarequick.com'],
            ]).resize().oneTime())

        LOG(username, 'Scenes/User/Tonic/Edits/Сallbacks/TonicСallbackScene/StageDomain')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/Edits/Сallbacks/TonicСallbackScene/StageDomain', error)
        return ctx.scene.leave()
    }
})
//* END - StageDomain


//* START - StageResult
const stageResult = new Composer()
stageResult.on('message', async (ctx) => {
    const { data } = ctx.wizard.state
    const { username } = ctx.message.from

    try {
        data.domain = ctx.message.text
        const { message_id } = await ctx.replyWithHTML(`♻️ Устанавливаю постбеки...`)
        const message = await SetCallbackMiddleware(ctx, data)
        await ctx.deleteMessage(message_id);

        if (message) {
            await ctx.replyWithHTML(`✅ <b>Сallback'и установлены.</b>`)
        } else {
            await ctx.replyWithHTML(`🚫 <b>Сallback не установлен.</b>`)
        }

        LOG(username, 'Scenes/User/Tonic/Edits/Сallbacks/TonicСallbackScene/StageResult')
        return ctx.scene.leave()
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/Edits/Сallbacks/TonicСallbackScene/StageResult', error)
        return ctx.scene.leave()
    } finally {
        return ctx.scene.enter('tonic-edits')
    }
})
//* END - StageResult


const TonicСallbackScene = new Scenes.WizardScene('TonicСallbackWizard', stageName, stageDomain, stageResult)
module.exports = TonicСallbackScene