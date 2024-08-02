//? SCENES | USERSADD

//* Requires
const { LOG } = require('@helpers/base')
const { Scenes, Composer } = require('telegraf')
const { UsersAddMiddleware } = require('@middlewares/UsersMiddlewares')


//* START
const stageId = new Composer()
stageId.on('text', async (ctx) => {
    const { username } = ctx.message.from

    try {
        ctx.wizard.state.data = {}
        await ctx.replyWithHTML('<b>♻️ Для добавления пользователя пройдите все этапы.</b>\n\n1️⃣ <b>Укажите id пользователя:</b>')

        LOG(username, 'Scenes/Admin/Users/Add/UsersAddScene/StageId')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/Admin/Users/Add/UsersAddScene/StageId', error, ctx)
        return ctx.scene.leave()
    }
})
//* END


//* START
const stageUsername = new Composer()
stageUsername.on('text', async (ctx) => {
    const { username } = ctx.message.from

    try {
        ctx.wizard.state.data.id = ctx.message.text
        await ctx.replyWithHTML('2️⃣ <b>Укажите Username пользователя:</b>')

        LOG(username, 'Scenes/Admin/Users/Add/UsersAddScene/StageUsername')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/Admin/Users/Add/UsersAddScene/StageUsername', error, ctx)
        return ctx.scene.leave()
    }
})
//* END


//* START
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

        LOG(username, 'Scenes/Admin/Users/Add/UsersAddScene/StageResult')
        return ctx.scene.leave()
    } catch (error) {
        LOG(username, 'Scenes/Admin/Users/Add/UsersAddScene/StageResult', error, ctx)
        return ctx.scene.leave()
    } finally {
        return ctx.scene.enter('users')
    }
})
//* END 


const UsersAddScene = new Scenes.WizardScene('UsersAddWizard', stageId, stageUsername, stageResult)
module.exports = UsersAddScene