//Require
const { LOG } = require('@helpers/helpers')
const { Scenes, Composer } = require('telegraf')
const { UsersRemoveMiddleware } = require('@middlewares/UsersMiddlewares')

//Stage Id
const stageId = new Composer()
stageId.on('text', async (ctx) => {
    const { username } = ctx.message.from

    try {
        ctx.wizard.state.data = {}
        await ctx.replyWithHTML('1️⃣ <b>Укажите id пользователя:</b>')

        LOG(username, 'Scenes/Users/UsersRemoveScene/stageId')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/Users/UsersRemoveScene/stageId', error)
        return ctx.scene.leave()
    }
})

//Stage Result
const stageResult = new Composer()
stageResult.on('message', async (ctx) => {
    const { username } = ctx.message.from
    
    try {
        const { message_id } = await ctx.replyWithHTML(`♻️ <b>Удаляем пользователя...</b>`)
        const message = await UsersRemoveMiddleware(ctx, ctx.message.text)
        await ctx.deleteMessage(message_id);

        if (message) {
            await ctx.replyWithHTML(message)
        } else {
            await ctx.replyWithHTML(`🚫 <b>Ошибка удаления пользователя.</b>`)
        }

        LOG(username, 'Scenes/Users/UsersRemoveScene/StageResult')
        return ctx.scene.leave()
    } catch (error) {
        LOG(username, 'Scenes/Users/UsersRemoveScene/StageResult', error)
        return ctx.scene.leave()
    } finally {
        return ctx.scene.enter('users')
    }
})

const UsersRemoveScene = new Scenes.WizardScene('UsersRemoveWizard', stageId, stageResult)
module.exports = UsersRemoveScene