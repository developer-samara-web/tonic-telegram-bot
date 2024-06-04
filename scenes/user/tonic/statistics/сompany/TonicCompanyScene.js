//? SCENES | TONICCOMPANY

//* Requires
const { LOG } = require('@helpers/base')
const { Scenes, Composer, Markup } = require('telegraf')
const { CompanyMiddleware } = require('@middlewares/TonicMiddlewares')


//* START - StageName
const stageName = new Composer()
stageName.on('text', async (ctx) => {
    const { username } = ctx.message.from

    try {
        ctx.wizard.state.data = {}
        await ctx.replyWithHTML('<b>♻️ Для получения статистики пройдите все этапы.</b>\n\n1️⃣ <b>Укажите название компании:</b>')

        LOG(username, 'Scenes/User/Tonic/Statistics/Company/TonicCompanyScene/StageName')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/Statistics/Company/TonicCompanyScene/StageName', error)
        return ctx.scene.leave()
    }
})
//* END - StageName


//* START - StageData
const stageData = new Composer()
stageData.on('text', async (ctx) => {
    const { data } = ctx.wizard.state
    const { username } = ctx.message.from

    try {
        data.company_name = ctx.message.text
        await ctx.replyWithHTML('2️⃣ <b>Укажите дату статистики:</b>\n( Пример: 2024-04-01:2024-05-01 )',
            Markup.keyboard([
                ['Сегодня', 'Вчера', 'За 3 дня'],
                ['За неделю', 'За месяц']
            ]).resize().oneTime())

        LOG(username, 'Scenes/User/Tonic/Statistics/Company/TonicCompanyScene/StageData')
        return ctx.wizard.next()
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/Statistics/Company/TonicCompanyScene/StageData', error)
        return ctx.scene.leave()
    }
})
//* END - StageData


//* START - StageResult
const stageResult = new Composer()
stageResult.on('message', async (ctx) => {
    const { data } = ctx.wizard.state
    const { username } = ctx.message.from

    try {
        data.date = ctx.message.text
        const { message_id } = await ctx.replyWithHTML(`♻️ <b>Идёт поиск статистики...</b>`)
        const message = await CompanyMiddleware(ctx, data)
        await ctx.deleteMessage(message_id);

        if (message) {
            await ctx.replyWithHTML(message)
        } else {
            await ctx.replyWithHTML(`🚫 <b>Статистика не найдена.</b>`)
        }

        LOG(username, 'Scenes/User/Tonic/Statistics/Company/TonicCompanyScene/StageResult')
        return ctx.scene.leave()
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/Statistics/Company/TonicCompanyScene/StageResult', error)
        return ctx.scene.leave()
    } finally {
        return ctx.scene.enter('tonic-stats')
    }
})
//* END - StageResult


const TonicCompanyScene = new Scenes.WizardScene('TonicCompanyWizard', stageName, stageData, stageResult)
module.exports = TonicCompanyScene