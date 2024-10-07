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
const stageResult = new Composer()
stageResult.on('message', async (ctx) => {
    const { data } = ctx.wizard.state
    const { username } = ctx.message.from

    try {
        data.name = ctx.message.text
        const { message_id } = await ctx.replyWithHTML(`♻️ Удаляю ключи...`)

        // Запрашиваем удаление ключевых слов
        const result = await SetKeywordsMiddleware(ctx, { name: data.name, keywords: null })
        await ctx.deleteMessage(message_id)

        // Если есть ошибка, выводим её
        if (result?.error) {
            await ctx.replyWithHTML(`🚫 <b>Ошибка:</b> ${result.error}`)
        } else if (result.Keywords) {
            await ctx.replyWithHTML(`✅ <b>Ключи удалены.</b>`)
        } else {
            await ctx.replyWithHTML(`🚫 <b>Ключи не удалены.</b>`)
        }

        LOG(username, 'Scenes/User/Tonic/Edits/Keywords/TonicDelKeywordsScene/StageResult')
        return ctx.scene.leave()
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/Edits/Keywords/TonicDelKeywordsScene/StageResult', error, ctx)
        return ctx.scene.leave()
    } finally {
        return ctx.scene.enter('tonic-edits')
    }
})
//* END


const TonicSetKeywordsScene = new Scenes.WizardScene('TonicDelKeywordsWizard', stageName, stageResult)
module.exports = TonicSetKeywordsScene