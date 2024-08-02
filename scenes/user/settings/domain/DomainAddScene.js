//? SCENES | DOMAINADD

//* Requires
const { LOG } = require('@helpers/base')
const { Scenes, Composer } = require('telegraf')
const { UsersDomainAddMiddleware } = require('@middlewares/UsersMiddlewares')


//* START
const stageDomainName = new Composer()
stageDomainName.on('text', async (ctx) => {
    const { username } = ctx.message.from

    try {
        ctx.wizard.state.data = {}
        await ctx.replyWithHTML('<b>♻️ Для установки постбеков пройдите все этапы.</b>\n\n1️⃣ <b>Отправьте домен ваших постбеков Clickflare:</b>')

        LOG(username, 'Scenes/User/Settings/domain/DomainAddScene/stageDomainName')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/User/Settings/domain/DomainAddScene/stageDomainName', error, ctx)
        return ctx.scene.leave()
    }
})
//* END


//* START
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
        LOG(username, 'Scenes/User/Settings/domain/DomainAddScene/StageResult', error, ctx)
        return ctx.scene.leave()
    } finally {
        return ctx.scene.enter('settings')
    }
})
//* END


const DomainAddScene = new Scenes.WizardScene('DomainAddWizard', stageDomainName, stageResult)
module.exports = DomainAddScene