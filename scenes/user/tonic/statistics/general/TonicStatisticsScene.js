//? SCENES | TONICSTATISTIC

//* Requires
const { LOG } = require('@helpers/base')
const { Scenes, Composer, Markup } = require('telegraf')
const { StatisticsMiddleware } = require('@middlewares/TonicMiddlewares.js')


//* START - StageData
const stageData = new Composer()
stageData.on('text', async (ctx) => {
    const { username } = ctx.message.from

    try {
        ctx.wizard.state.data = {}
        await ctx.replyWithHTML('<b>♻️ Для получения статистики пройдите все этапы.</b>\n\n1️⃣ <b>Укажите дату статистики:</b>\n( Пример: 2024-04-01:2024-05-01 )',
            Markup.keyboard([
                ['Сегодня', 'Вчера', 'За 3 дня'],
                ['За неделю', 'За месяц']
            ]).resize().oneTime())

        LOG(username, 'Scenes/User/Tonic/Statistics/General/TonicStatisticScene/StageData')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/Statistics/General/TonicStatisticScene/StageData', error)
        return ctx.scene.leave()
    }
})
//* END - StageData


//* START - StageSource
const stageSource = new Composer()
stageSource.on('message', async (ctx) => {
    const { data } = ctx.wizard.state
    const { username } = ctx.message.from

    try {
        data.date = ctx.message.text
        await ctx.replyWithHTML('2️⃣ <b>Укажите источник:</b>',
            Markup.keyboard([
                ['tiktok', 'facebook']
            ]).resize().oneTime())

        LOG(username, 'Scenes/User/Tonic/Statistics/General/TonicStatisticScene/StageSource')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/Statistics/General/TonicStatisticScene/StageSource', error)
        return ctx.scene.leave()
    }
})
//* END - StageSource


//* START - StageBuyer
const stageBuyer = new Composer()
stageBuyer.on('message', async (ctx) => {
    const { data } = ctx.wizard.state
    const { username } = ctx.message.from

    try {
        data.source = ctx.message.text
        await ctx.replyWithHTML('3️⃣ <b>Укажите индификатор баера:</b>')

        LOG(username, 'Scenes/User/Tonic/Statistics/General/TonicStatisticScene/StageBuyer')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/Statistics/General/TonicStatisticScene/StageBuyer', error)
        return ctx.scene.leave()
    }
})
//* END - StageBuyer


//* START - StageResult
const stageResult = new Composer()
stageResult.on('message', async (ctx) => {
    const { data } = ctx.wizard.state
    const { username } = ctx.message.from

    try {
        data.buyer = ctx.message.text
        const { message_id } = await ctx.replyWithHTML(`♻️ <b>Идёт поиск статистики...</b>`)
        const message = await StatisticsMiddleware(ctx, data)
        await ctx.deleteMessage(message_id);

        if (message) {
            for (const item of message) {
                await ctx.replyWithHTML(item)
            }
        } else {
            await ctx.replyWithHTML(`🚫 <b>Статистика не найдена.</b>`)
        }

        LOG(username, 'Scenes/User/Tonic/Statistics/General/TonicStatisticScene/StageResult')
        return ctx.scene.leave()
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/Statistics/General/TonicStatisticScene/StageResult', error)
        return ctx.scene.leave()
    } finally {
        return ctx.scene.enter('tonic-stats')
    }
})
//* END - StageResult


const TonicStatisticsScene = new Scenes.WizardScene('TonicStatisticsWizard', stageData, stageSource, stageBuyer, stageResult)
module.exports = TonicStatisticsScene