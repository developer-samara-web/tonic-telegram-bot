//? SCENES | ADMINMESSAGE

//* Requires
const { LOG } = require('@helpers/base')
const { Scenes, Composer } = require('telegraf')
const { AdminMessageMiddleware } = require('@middlewares/AdminMiddlewares')


//* START - StageMessage
const stageMessage = new Composer()
stageMessage.on('text', async (ctx) => {
    const { username } = ctx.message.from

    try {
        ctx.wizard.state.data = {}
        await ctx.replyWithHTML('<b>♻️ Для отправки сообщения пройдите все этапы.</b>\n\n1️⃣ <b>Напишите сообщение:</b>')

        LOG(username, 'Scenes/Admin/Message/AdminMessageScene/stageMessage')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/Admin/Message/AdminMessageScene/stageMessage', error)
        return ctx.scene.leave()
    }
})
//* END - StageMessage


//* START - StageResult
const stageResult = new Composer()
stageResult.on('message', async (ctx) => {
    const { username } = ctx.message.from

    try {
        const message = await AdminMessageMiddleware(ctx, ctx.message.text)

        if (message) {
            await ctx.replyWithHTML(`✅ <b>Сообщение отправлено:</b>\n\n${ctx.message.text}`)
        } else {
            await ctx.replyWithHTML('🚫 <b>Ошибка отправки сообщения</b>')
        }

        LOG(username, 'Scenes/Admin/Message/AdminMessageScene/StageResult')
        return ctx.scene.leave()
    } catch (error) {
        LOG(username, 'Scenes/Admin/Message/AdminMessageScene/StageResult', error)
        return ctx.scene.leave()
    } finally {
        return ctx.scene.enter('admin')
    }
})
//* END - StageResult


const AdminMessageScene = new Scenes.WizardScene('AdminMessageWizard', stageMessage, stageResult)
module.exports = AdminMessageScene