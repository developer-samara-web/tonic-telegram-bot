//? SCENES | SHEETADD

//* Requires
const { LOG } = require('@helpers/base')
const { Scenes, Composer } = require('telegraf')
const { UsersSheetAddMiddleware } = require('@middlewares/UsersMiddlewares')


//* START - StageSheetId
const stageSheetId = new Composer()
stageSheetId.on('text', async (ctx) => {
    const { username } = ctx.message.from

    try {
        ctx.wizard.state.data = {}
        await ctx.replyWithHTML('1️⃣ <b>Отправьте sheet_id:</b>')

        LOG(username, 'Scenes/User/Settings/Sheet/SheetAddScene/StageSheetId')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/User/Settings/Sheet/SheetAddScene/StageSheetId', error)
        return ctx.scene.leave()
    }
})
//* END - StageSheetId


//* START - StageResult
const stageResult = new Composer()
stageResult.on('message', async (ctx) => {
    const { username } = ctx.message.from

    try {
        const message = await UsersSheetAddMiddleware(ctx, ctx.message.text)

        if (message) {
            await ctx.replyWithHTML(`✅ <b>Sheet_id добавлен:</b>\n${ctx.message.text}`)
        } else {
            await ctx.replyWithHTML('🚫 <b>Ошибка добавления sheet_id</b>')
        }

        LOG(username, 'Scenes/User/Settings/Sheet/SheetAddScene/StageResult')
        return ctx.scene.leave()
    } catch (error) {
        LOG(username, 'Scenes/User/Settings/Sheet/SheetAddScene/StageResult', error)
        return ctx.scene.leave()
    } finally {
        return ctx.scene.enter('settings')
    }
})
//* END - StageResult


const SheetAddScene = new Scenes.WizardScene('SheetAddWizard', stageSheetId, stageResult)
module.exports = SheetAddScene