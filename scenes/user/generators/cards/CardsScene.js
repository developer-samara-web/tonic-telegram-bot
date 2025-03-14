//? SCENES | CARDS

//* Requires
const { LOG } = require('@helpers/base')
const { Scenes, Composer } = require('telegraf')
const { Card } = require('@middlewares/GenerateMiddlewares')


//* START
const stageCard = new Composer()
stageCard.on('text', async (ctx) => {
    const { username } = ctx.message.from

    try {
        ctx.wizard.state.data = {}
        await ctx.replyWithHTML('1️⃣ <b>Отправьте номер карты:</b>')

        LOG(username, 'Scenes/User/Generators/Cards/stageCard')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/User/Generators/Cards/stageCard', error, ctx)
        return ctx.scene.leave()
    }
})
//* END


//* START
const stageBank = new Composer()
stageBank.on('text', async (ctx) => {
    const { data } = ctx.wizard.state
    const { username } = ctx.message.from

    try {
        data.card = ctx.message.text
        await ctx.replyWithHTML('1️⃣ <b>Отправьте название банка:</b>')

        LOG(username, 'Scenes/User/Generators/Cards/stageBank')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/User/Generators/Cards/stageBank', error, ctx)
        return ctx.scene.leave()
    }
})
//* END


//* START
const stageDate = new Composer()
stageDate.on('text', async (ctx) => {
    const { data } = ctx.wizard.state
    const { username } = ctx.message.from

    try {
        data.bank = ctx.message.text
        await ctx.replyWithHTML('1️⃣ <b>Отправьте дату окончания карты:</b>')

        LOG(username, 'Scenes/User/Generators/Cards/stageDate')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/User/Generators/Cards/stageDate', error, ctx)
        return ctx.scene.leave()
    }
})
//* END


//* START
const stageName = new Composer()
stageName.on('text', async (ctx) => {
    const { data } = ctx.wizard.state
    const { username } = ctx.message.from

    try {
        data.date = ctx.message.text
        await ctx.replyWithHTML('1️⃣ <b>Отправьте имя карты:</b>')

        LOG(username, 'Scenes/User/Generators/Cards/stageBank')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/User/Generators/Cards/stageBank', error, ctx)
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
        const { message_id } = await ctx.replyWithHTML(`♻️ Идёт создание карты...`)
        const message = await Card(ctx, data)

        await ctx.deleteMessage(message_id);

        if (!message) {
            await ctx.replyWithHTML(`🚫 <b>Ошибка создания карты.</b>`)
        }

        LOG(username, 'Scenes/User/Generators/Cards/StageResult')
        return ctx.scene.leave()
    } catch (error) {
        LOG(username, 'Scenes/User/Generators/Cards/StageResult', error, ctx)
        return ctx.scene.leave()
    } finally {
        return ctx.scene.enter('generators')
    }
})
//* END


const CardsScene = new Scenes.WizardScene('CardsWizard', stageCard, stageBank, stageDate, stageName, stageResult)
module.exports = CardsScene