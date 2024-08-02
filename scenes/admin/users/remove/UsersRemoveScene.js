//? SCENES | USERSREMOVE

//* Requires
const { LOG } = require('@helpers/base')
const { Scenes, Composer } = require('telegraf')
const { UsersRemoveMiddleware } = require('@middlewares/UsersMiddlewares')


//* START
const stageId = new Composer()
stageId.on('text', async (ctx) => {
    const { username } = ctx.message.from

    try {
        ctx.wizard.state.data = {}
        await ctx.replyWithHTML('<b>♻️ Для удаления пользователя пройдите все этапы.</b>\n\n1️⃣ <b>Укажите id пользователя:</b>')

        LOG(username, 'Scenes/Admin/Users/Remove/UsersRemoveScene/StageId')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/Admin/Users/Remove/UsersRemoveScene/StageId', error, ctx)
        return ctx.scene.leave()
    }
})
//* END


//* START
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

        LOG(username, 'Scenes/Admin/Users/Remove/UsersRemoveScene/StageResult')
        return ctx.scene.leave()
    } catch (error) {
        LOG(username, 'Scenes/Admin/Users/Remove/UsersRemoveScene/StageResult', error, ctx)
        return ctx.scene.leave()
    } finally {
        return ctx.scene.enter('users')
    }
})
//* END


const UsersRemoveScene = new Scenes.WizardScene('UsersRemoveWizard', stageId, stageResult)
module.exports = UsersRemoveScene