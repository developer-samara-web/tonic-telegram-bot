//? SCENES | SHEETADD

//* Requires
const { LOG } = require('@helpers/base')
const { Scenes, Composer } = require('telegraf')
const { UsersOfferAddMiddleware } = require('@middlewares/UsersMiddlewares')


//* START - StageSheetId
const stageOfferName = new Composer()
stageOfferName.on('text', async (ctx) => {
    const { username } = ctx.message.from

    try {
        ctx.wizard.state.data = {}
        await ctx.replyWithHTML('1️⃣ <b>Отправьте полное название оффера:</b>')

        LOG(username, 'Scenes/User/Settings/Sheet/OfferAddScene/StageSheetId')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/User/Settings/Sheet/OfferAddScene/StageSheetId', error)
        return ctx.scene.leave()
    }
})
//* END - StageSheetId


//* START - StageResult
const stageResult = new Composer()
stageResult.on('message', async (ctx) => {
    const { username } = ctx.message.from

    try {
        const message = await UsersOfferAddMiddleware(ctx, ctx.message.text)

        if (message) {
            await ctx.replyWithHTML(`✅ <b>Оффер добавлен:</b> <i>${ctx.message.text}</i>`)
        } else {
            await ctx.replyWithHTML('🚫 <b>Ошибка добавления оффера</b>')
        }

        LOG(username, 'Scenes/User/Settings/Sheet/OfferAddScene/StageResult')
        return ctx.scene.leave()
    } catch (error) {
        LOG(username, 'Scenes/User/Settings/Sheet/OfferAddScene/StageResult', error)
        return ctx.scene.leave()
    } finally {
        return ctx.scene.enter('settings')
    }
})
//* END - StageResult


const OfferAddScene = new Scenes.WizardScene('OfferAddWizard', stageOfferName, stageResult)
module.exports = OfferAddScene