//? SCENES | TONICKEYWORDS

//* Requires
const { LOG } = require('@helpers/base')
const { Scenes, Composer, Markup } = require('telegraf')
const { KeywordsMiddleware } = require('@middlewares/TonicMiddlewares')


//* START - StageName
const stageName = new Composer()
stageName.on('text', async (ctx) => {
    const { username } = ctx.message.from

    try {
        ctx.wizard.state.data = {}
        await ctx.replyWithHTML('<b>♻️ Для получения статистики пройдите все этапы.</b>\n\n1️⃣ <b>Укажите название компании:</b>')

        LOG(username, 'Scenes/User/Tonic/Statistics/Keywords/TonicKeywordsScene/StageName')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/Statistics/Keywords/TonicKeywordsScene/StageName', error)
        return ctx.scene.leave()
    }
})
//* END - StageName


//* START - StageDate
const stageDate = new Composer()
stageDate.on('text', async (ctx) => {
    const { data } = ctx.wizard.state
    const { username } = ctx.message.from

    try {
        data.company_name = ctx.message.text
        await ctx.replyWithHTML('2️⃣ <b>Укажите дату статистики:</b>\n( Пример: 2024-04-01:2024-05-01 )',
            Markup.keyboard([
                ['Сегодня', 'Вчера', 'За 3 дня'],
                ['За неделю', 'За месяц']
            ]).resize().oneTime())

        LOG(username, 'Scenes/User/Tonic/Statistics/Keywords/TonicKeywordsScene/StageDate')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/Statistics/Keywords/TonicKeywordsScene/StageDate', error)
        return ctx.scene.leave()
    }
})
//* END - StageDate


//* START - StageResult
const stageResult = new Composer()
stageResult.on('message', async (ctx) => {
    const { data } = ctx.wizard.state
    const { username } = ctx.message.from

    try {
        ctx.wizard.state.data.date = ctx.message.text
        const { message_id } = await ctx.replyWithHTML(`♻️ <b>Идёт поиск статистики...</b>`)
        const message = await KeywordsMiddleware(ctx, data)
        await ctx.deleteMessage(message_id);
        
        if (message) {
            for (const item of message){
                await ctx.replyWithHTML(item)
            }
        } else {
            await ctx.replyWithHTML(`🚫 <b>Статистика не найдена.</b>`)
        }

        LOG(username, 'Scenes/User/Tonic/Statistics/Keywords/TonicKeywordsScene/StageResult')
        return ctx.scene.leave()
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/Statistics/Keywords/TonicKeywordsScene/StageResult', error)
        return ctx.scene.leave()
    } finally {
        return ctx.scene.enter('tonic-stats')
    }
})
//* END - StageResult


const TonicKeywordsScene = new Scenes.WizardScene('TonicKeywordsWizard', stageName, stageDate, stageResult)
module.exports = TonicKeywordsScene