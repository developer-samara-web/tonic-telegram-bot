//? SCENES | TONICKEYWORDS

//* Require
const { LOG } = require('@helpers/base')
const { Scenes, Composer } = require('telegraf')
const { SetKeywordsMiddleware } = require('@middlewares/TonicMiddlewares')


//* START
const stageName = new Composer()
stageName.on('text', async (ctx) => {
    const { username } = ctx.message.from

    try {
        ctx.wizard.state.data = {}
        await ctx.replyWithHTML('<b>♻️ Для установки ключей пройдите все этапы.</b>\n\n1️⃣ <b>Укажите название ссылки:</b>')

        LOG(username, 'Scenes/User/Tonic/Edits/Keywords/TonicKeywordsScene/StageName')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/Edits/Keywords/TonicKeywordsScene/StageName', error, ctx)
        return ctx.scene.leave()
    }
})
//* END


//* START
const stageKeywords = new Composer()
stageKeywords.on('text', async (ctx) => {
    const { data } = ctx.wizard.state
    const { username } = ctx.message.from

    try {
        data.name = ctx.message.text
        await ctx.replyWithHTML('2️⃣ <b>Укажите построчно ключи:</b>')

        LOG(username, 'Scenes/User/Tonic/Edits/Keywords/TonicKeywordsScene/StageKeywords')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/Edits/Keywords/TonicKeywordsScene/StageKeywords', error, ctx)
        return ctx.scene.leave()
    }
})
//* END


//* START
const stageResult = new Composer()
stageResult.on('message', async (ctx) => {
    const { data } = ctx.wizard.state
    const { username } = ctx.message.from

    try {
        data.keywords = ctx.message.text.split('\n')
        const { message_id } = await ctx.replyWithHTML(`♻️ Устанавливаю ключи...`)
        const message = await SetKeywordsMiddleware(ctx, data)
        await ctx.deleteMessage(message_id);

        if (message) {
            await ctx.replyWithHTML(`✅ <b>Ключи установлены.</b>`)
        } else {
            await ctx.replyWithHTML(`🚫 <b>Ключи не установлены.</b>`)
        }

        LOG(username, 'Scenes/User/Tonic/Edits/Keywords/TonicKeywordsScene/StageResult')
        return ctx.scene.leave()
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/Edits/Keywords/TonicKeywordsScene/StageResult', error, ctx)
        return ctx.scene.leave()
    } finally {
        return ctx.scene.enter('tonic-edits')
    }
})
//* END


const TonicSetKeywordsScene = new Scenes.WizardScene('TonicSetKeywordsWizard', stageName, stageKeywords, stageResult)
module.exports = TonicSetKeywordsScene