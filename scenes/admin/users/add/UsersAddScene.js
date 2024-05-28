//Require
const { LOG } = require('@helpers/helpers')
const { Scenes, Composer } = require('telegraf')
const { UsersAddMiddleware } = require('@middlewares/UsersMiddlewares')

//Stage Id
const stageId = new Composer()
stageId.on('text', async (ctx) => {
    const { username } = ctx.message.from

    try {
        ctx.wizard.state.data = {}
        await ctx.replyWithHTML('1️⃣ <b>Укажите id пользователя:</b>')

        LOG(username, 'Scenes/Admin/User/AddUser/stageId')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/Admin/User/AddUser/stageId', error)
        return ctx.scene.leave()
    }
})

//Stage Username
const stageUsername = new Composer()
stageUsername.on('text', async (ctx) => {
    const { username } = ctx.message.from

    try {
        ctx.wizard.state.data.id = ctx.message.text
        await ctx.replyWithHTML('2️⃣ <b>Укажите Username пользователя:</b>')

        LOG(username, 'Scenes/Admin/User/AddUser/stageUsername')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/Admin/User/AddUser/stageUsername', error)
        return ctx.scene.leave()
    }
})

//Stage Result
const stageResult = new Composer()
stageResult.on('message', async (ctx) => {
    const { username } = ctx.message.from
    
    try {
        ctx.wizard.state.data.name = ctx.message.text
        const { message_id } = await ctx.replyWithHTML(`♻️ <b>Добавляем пользователя...</b>`)
        const message = await UsersAddMiddleware(ctx)
        await ctx.deleteMessage(message_id);

        if (message) {
            await ctx.replyWithHTML(message)
        } else {
            await ctx.replyWithHTML(`🚫 <b>Ошибка добавления.</b>`)
        }

        LOG(username, 'Scenes/Admin/User/AddUser/StageResult')
        return ctx.scene.leave()
    } catch (error) {
        LOG(username, 'Scenes/Admin/User/AddUser/StageResult', error)
        return ctx.scene.leave()
    } finally {
        return ctx.scene.enter('users')
    }
})

const UsersAddScene = new Scenes.WizardScene('UsersAddWizard', stageId, stageUsername, stageResult)
module.exports = UsersAddScene