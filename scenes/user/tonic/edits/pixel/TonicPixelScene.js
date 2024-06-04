//? SCENES | TONICPIXEL

//* Requires
const { LOG } = require('@helpers/base')
const { Scenes, Composer, Markup } = require('telegraf')
const { SetPixelMiddleware } = require('@middlewares/TonicMiddlewares')


//* START - StageName
const stageName = new Composer()
stageName.on('text', async (ctx) => {
    const { username } = ctx.message.from

    try {
        ctx.wizard.state.data = {}
        await ctx.replyWithHTML('<b>♻️ Для установки пикселя пройдите все этапы.</b>\n\n1️⃣ <b>Укажите название ссылки:</b>')

        LOG(username, 'Scenes/User/Tonic/Edits/Pixel/TonicPixelScene/StageName')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/Edits/Pixel/TonicPixelScene/StageName', error)
        return ctx.scene.leave()
    }
})
//* END - StageName


//* START - StageTarget
const stageTarget = new Composer()
stageTarget.on('text', async (ctx) => {
    const { data } = ctx.wizard.state
    const { username } = ctx.message.from

    try {
        data.name = ctx.message.text
        await ctx.replyWithHTML('2️⃣ <b>Укажите тип пикселя:</b>',
            Markup.keyboard([
                ['facebook', 'tiktok'],
            ]).resize().oneTime())

        LOG(username, 'Scenes/User/Tonic/Edits/Pixel/TonicPixelScene/StageTarget')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/Edits/Pixel/TonicPixelScene/StageTarget')
        return ctx.scene.leave()
    }
})
//* END - StageTarget


//* START - StageEvent
const stageEvent = new Composer()
stageEvent.on('text', async (ctx) => {
    const { data } = ctx.wizard.state
    const { username } = ctx.message.from

    try {
        data.target = ctx.message.text

        await ctx.replyWithHTML('3️⃣ <b>Укажите event пикселя:</b> (Только для Facebook)',
            Markup.keyboard([
                ['Lead', 'Purchase'],
                ['Пропустить']
            ]).resize().oneTime())

        LOG(username, 'Scenes/User/Tonic/Edits/Pixel/TonicPixelScene/StageEvent')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/Edits/Pixel/TonicPixelScene/StageEvent', error)
        return ctx.scene.leave()
    }
})
//* END - StageEvent


//* START - StagePixel
const stagePixel = new Composer()
stagePixel.on('message', async (ctx) => {
    const { data } = ctx.wizard.state
    const { username } = ctx.message.from

    try {
        data.event = ctx.message.text
        await ctx.replyWithHTML('4️⃣ <b>Укажите pixel_id:</b>')

        LOG(username, 'Scenes/User/Tonic/Edits/Pixel/TonicPixelScene/StagePixel')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/Edits/Pixel/TonicPixelScene/StagePixel', error)
        return ctx.scene.leave()
    }
})
//* END - StagePixel


//* START - StageToken
const stageToken = new Composer()
stageToken.on('message', async (ctx) => {
    const { data } = ctx.wizard.state
    const { username } = ctx.message.from

    try {
        data.pixel = ctx.message.text
        await ctx.replyWithHTML('5️⃣ <b>Укажите access_token:</b>')

        LOG(username, 'Scenes/User/Tonic/Edits/Pixel/TonicPixelScene/StageToken')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/Edits/Pixel/TonicPixelScene/StageToken', error)
        return ctx.scene.leave()
    }
})
//* END - StageToken


//* START - StageResult
const stageResult = new Composer()
stageResult.on('message', async (ctx) => {
    const { data } = ctx.wizard.state
    const { username } = ctx.message.from

    try {
        data.token = ctx.message.text
        const { message_id } = await ctx.replyWithHTML(`♻️ <b>Идёт установки пикселя...</b>`)
        const message = await SetPixelMiddleware(ctx, data)
        await ctx.deleteMessage(message_id);

        if (message) {
            await ctx.replyWithHTML(`✅ <b>Пиксель установлен.</b>`)
        } else {
            await ctx.replyWithHTML(`🚫 <b>Ошибка установки пикселя.</b>`)
        }

        LOG(username, 'Scenes/User/Tonic/Edits/Pixel/TonicPixelScene/StageResult')
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/Edits/Pixel/TonicPixelScene/StageResult', error)
        return ctx.scene.leave()
    } finally {
        return ctx.scene.enter('tonic-edits')
    }
})
//* END - StageResult


const TonicPixelScene = new Scenes.WizardScene('TonicPixelWizard', stageName, stageTarget, stageEvent, stagePixel, stageToken, stageResult)
module.exports = TonicPixelScene