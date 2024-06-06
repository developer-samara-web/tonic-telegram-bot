//? SCENES | DOMAINADD

//* Requires
const { LOG } = require('@helpers/base')
const { Scenes, Composer } = require('telegraf')
const { UsersDomainAddMiddleware } = require('@middlewares/UsersMiddlewares')


//* START - StageSheetId
const stageDomainName = new Composer()
stageDomainName.on('text', async (ctx) => {
    const { username } = ctx.message.from

    try {
        ctx.wizard.state.data = {}
        await ctx.replyWithHTML('1️⃣ <b>Отправьте домен ваших постбеков Clickflare:</b>')

        LOG(username, 'Scenes/User/Settings/domain/DomainAddScene/stageDomainName')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/User/Settings/domain/DomainAddScene/stageDomainName', error)
        return ctx.scene.leave()
    }
})
//* END - StageSheetId


//* START - StageResult
const stageResult = new Composer()
stageResult.on('message', async (ctx) => {
    const { username } = ctx.message.from

    try {
        const message = await UsersDomainAddMiddleware(ctx, ctx.message.text)

        if (message) {
            await ctx.replyWithHTML(`✅ <b>Домен добавлен:</b> <i>${ctx.message.text}</i>`)
        } else {
            await ctx.replyWithHTML('🚫 <b>Ошибка добавления домена</b>')
        }

        LOG(username, 'Scenes/User/Settings/domain/DomainAddScene/StageResult')
        return ctx.scene.leave()
    } catch (error) {
        LOG(username, 'Scenes/User/Settings/domain/DomainAddScene/StageResult', error)
        return ctx.scene.leave()
    } finally {
        return ctx.scene.enter('settings')
    }
})
//* END - StageResult


const DomainAddScene = new Scenes.WizardScene('DomainAddWizard', stageDomainName, stageResult)
module.exports = DomainAddScene