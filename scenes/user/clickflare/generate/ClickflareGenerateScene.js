//? SCENES | ClickflareGenerate

//* Requires
const { LOG } = require('@helpers/base')
const { Scenes, Composer, Markup } = require('telegraf')
const { GenerateeOffersMiddleware } = require('@middlewares/ClickflareMiddlewares')


//* START
const stageLength = new Composer()
stageLength.on('text', async (ctx) => {
    const { username } = ctx.message.from

    try {
        ctx.wizard.state.data = {}
        await ctx.replyWithHTML('<b>♻️ Для генерации офферов пройдите все этапы.</b>\n\n1️⃣ <b>Введите колличество повторений:</b>')

        LOG(username, 'Scenes/User/Tonic/Create/TonicCreateScene/StageName')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/Create/TonicCreateScene/StageName', error, ctx)
        return ctx.scene.leave()
    }
})
//* END


//* START
const stageKeywords = new Composer()
stageKeywords.on('message', async (ctx) => {
    const { data } = ctx.wizard.state
    const { username } = ctx.message.from

    try {
        data.length = ctx.message.text
        await ctx.replyWithHTML('2️⃣ <b>Укажите ключи: ( Если в повторении они не нужны то - )</b>\n<i>&kw1=Keyword1&kw2=Keyword2&kw3=Keyword3</i>')

        LOG(username, 'Scenes/User/Tonic/Create/TonicCreateScene/StageOffer')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/Create/TonicCreateScene/StageOffer', error, ctx)
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
        data.keywords = ctx.message.text

        const { message_id } = await ctx.replyWithHTML(`♻️ Идёт создание офферов...`)
        const message = await GenerateeOffersMiddleware(ctx, data, message_id)

        await ctx.deleteMessage(message_id);

        if (message) {
            await ctx.replyWithHTML('✅ Ваш файл с офферами для загрузки в clickflare.')
        } else {
            await ctx.replyWithHTML(`🚫 <b>Ошибка создания офферов.</b>`)
        }

        LOG(username, 'Scenes/User/Tonic/Create/TonicCreateScene/StageResult')
        return ctx.scene.leave()
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/Create/TonicCreateScene/StageResult', error, ctx)
        return ctx.scene.leave()
    } finally {
        return ctx.scene.enter('clickflare')
    }
})
//* END


const ClickflareGenerateScene = new Scenes.WizardScene('ClickflareGenerateWizard', stageLength, stageKeywords, stageResult )
module.exports = ClickflareGenerateScene