//? SCENES | TONICCREATE

//* Requires
const { LOG } = require('@helpers/base')
const { Scenes, Composer, Markup } = require('telegraf')
const { CreateMiddleware } = require('@middlewares/TonicMiddlewares')


//* START
const stageName = new Composer()
stageName.on('text', async (ctx) => {
    const { username } = ctx.message.from

    try {
        ctx.wizard.state.data = {}
        await ctx.replyWithHTML('<b>♻️ Для создания компании пройдите все этапы.</b>\n\n1️⃣ <b>Укажите название ссылки:</b>\n<i>OfferName_CountryCode_BuyerName_DayMounth_id</i>')

        LOG(username, 'Scenes/User/Tonic/Create/TonicCreateScene/StageName')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/Create/TonicCreateScene/StageName', error, ctx)
        return ctx.scene.leave()
    }
})
//* END


//* START
const stageOffer = new Composer()
stageOffer.on('message', async (ctx) => {
    const { data } = ctx.wizard.state
    const { username } = ctx.message.from

    try {
        data.name = ctx.message.text
        await ctx.replyWithHTML('2️⃣ <b>Укажите оффер:</b>\n<i>Personal Loans</i>')

        LOG(username, 'Scenes/User/Tonic/Create/TonicCreateScene/StageOffer')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/Create/TonicCreateScene/StageOffer', error, ctx)
        return ctx.scene.leave()
    }
})
//* END


//* START
const stageCountry = new Composer()
stageCountry.on('message', async (ctx) => {
    const { data } = ctx.wizard.state
    const { username } = ctx.message.from
    
    try {
        data.offer = ctx.message.text
        await ctx.replyWithHTML('3️⃣ <b>Укажите код страны:</b>\n<i>US</i>')

        LOG(username, 'Scenes/User/Tonic/Create/TonicCreateScene/StageCountry')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/Create/TonicCreateScene/StageCountry', error, ctx)
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
        data.country = ctx.message.text
        await ctx.replyWithHTML('4️⃣ <b>Укажите ключи:</b>', Markup.keyboard([
            ['🚫 Пропустить']
        ]).resize().oneTime())

        LOG(username, 'Scenes/User/Tonic/Create/TonicCreateScene/StageKeywords')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/Create/TonicCreateScene/StageKeywords', error, ctx)
        return ctx.scene.leave()
    }
})
//* END


//* START
const stageDomain = new Composer()
stageDomain.on('message', async (ctx) => {
    const { data } = ctx.wizard.state
    const { username } = ctx.message.from

    try {
        data.keywords = ctx.message.text.split('\n')
        await ctx.replyWithHTML('5️⃣ <b>Укажите домен постбеков:</b>',
            Markup.keyboard([
                ['apustalligndp.pro', 'flarequick.com'],
                ['🚫 Пропустить']
            ]).resize().oneTime())

        LOG(username, 'Scenes/User/Tonic/Create/TonicCreateScene/StageDomain')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/Create/TonicCreateScene/StageDomain', error, ctx)
        return ctx.scene.leave()
    }
})
//* END


//* START
const stagePixelId = new Composer()
stagePixelId.on('message', async (ctx) => {
    const { data } = ctx.wizard.state
    const { username } = ctx.message.from

    try {
        data.domain = ctx.message.text
        await ctx.replyWithHTML('6️⃣ <b>Укажите id пикселя:</b>', Markup.keyboard([
            ['🚫 Пропустить']
        ]).resize().oneTime())

        LOG(username, 'Scenes/User/Tonic/Create/TonicCreateScene/StagePixelId')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/Create/TonicCreateScene/StagePixelId', error, ctx)
        return ctx.scene.leave()
    }
})
//* END


//* START
const stagePixelToken = new Composer()
stagePixelToken.on('message', async (ctx) => {
    const { data } = ctx.wizard.state
    const { username } = ctx.message.from

    try {
        data.pixel = ctx.message.text
        await ctx.replyWithHTML('7️⃣ <b>Укажите token пикселя:</b>', Markup.keyboard([
            ['🚫 Пропустить']
        ]).resize().oneTime())

        LOG(username, 'Scenes/User/Tonic/Create/TonicCreateScene/StagePixelToken')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/Create/TonicCreateScene/StagePixelToken', error, ctx)
        return ctx.scene.leave()
    }
})
//* END


//* START
const stageTarget = new Composer()
stageTarget.on('message', async (ctx) => {
    const { data } = ctx.wizard.state
    const { username } = ctx.message.from

    try {
        data.token = ctx.message.text
        await ctx.replyWithHTML('8️⃣ <b>Укажите соц-сеть пикселя:</b>',
            Markup.keyboard([
                ['facebook', 'tiktok'],
                ['🚫 Пропустить']
            ]).resize().oneTime())

        LOG(username, 'Scenes/User/Tonic/Create/TonicCreateScene/StageTarget')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/Create/TonicCreateScene/StageTarget', error, ctx)
        return ctx.scene.leave()
    }
})
//* END


//* START
const stageEvent = new Composer()
stageEvent.on('message', async (ctx) => {
    const { data } = ctx.wizard.state
    const { username } = ctx.message.from

    try {
        data.target = ctx.message.text
        await ctx.replyWithHTML('9️⃣ <b>Укажите event пикселя:</b>',
            Markup.keyboard([
                ['Lead', 'Purchase'],
                ['🚫 Пропустить']
            ]).resize().oneTime())

        LOG(username, 'Scenes/User/Tonic/Create/TonicCreateScene/StageEvent')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/Create/TonicCreateScene/StageEvent', error, ctx)
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
        data.event = ctx.message.text

        const { message_id } = await ctx.replyWithHTML(`♻️ Идёт создание ссылки...`)
        const message = await CreateMiddleware(ctx, data)

        await ctx.deleteMessage(message_id);

        if (message) {
            await ctx.replyWithHTML(message)
        } else {
            await ctx.replyWithHTML(`🚫 <b>Компания не найдена.</b>`)
        }

        LOG(username, 'Scenes/User/Tonic/Create/TonicCreateScene/StageResult')
        return ctx.scene.leave()
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/Create/TonicCreateScene/StageResult', error, ctx)
        return ctx.scene.leave()
    } finally {
        return ctx.scene.enter('tonic')
    }
})
//* END


const TonicLinkScene = new Scenes.WizardScene('TonicLinkWizard', stageName, stageOffer, stageCountry, stageKeywords, stageDomain, stagePixelId, stagePixelToken, stageTarget, stageEvent, stageResult)
module.exports = TonicLinkScene