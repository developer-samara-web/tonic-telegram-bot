//? ADMINMESSAGESCENE.JS

// Require
const { LOG } = require('@helpers/helpers')
const { Scenes, Composer } = require('telegraf')
const { AdminMessageMiddleware } = require('@middlewares/AdminMiddlewares')

// Stage Message
const stageMessage = new Composer()
stageMessage.on('text', async (ctx) => {
    const { username } = ctx.message.from

    try {
        ctx.wizard.state.data = {}
        await ctx.replyWithHTML('1️⃣ <b>Напишите сообщение:</b>')

        LOG(username, 'Scenes/Admin/AdminMessageScene/stageMessage')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/Admin/AdminMessageScene/stageMessage', error)
        return ctx.scene.leave()
    }
})

// Stage Result
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

        Logger(username, 'Scenes/Admin/AdminMessageScene/StageResult')
        return ctx.scene.leave()
    } catch (error) {
        Logger(username, 'Scenes/Admin/AdminMessageScene/StageResult', error)
        return ctx.scene.leave()
    } finally {
        return ctx.scene.enter('admin')
    }
})

const AdminMessageScene = new Scenes.WizardScene('AdminMessageWizard', stageMessage, stageResult)
module.exports = AdminMessageScene