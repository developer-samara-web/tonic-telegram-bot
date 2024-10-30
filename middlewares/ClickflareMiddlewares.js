//? MIDDLEWARES | ADMIN

//* Requires
const { Bot } = require('@services/telegram')
const { LOG, generateCSVData } = require('@helpers/base')
const { SearchSheet } = require('@services/sheet')
const { GetFirebaseUser } = require('@services/firebase')
const { parse } = require('json2csv');
const fs = require('fs');


//* START
const GenerateeOffersMiddleware = async (ctx, { keywords, length }) => {
    // Получаем имя пользователя из контекста
    const { username, id } = ctx.message?.from || ctx.callbackQuery?.from || 'BOT'

    try {
        // Получаем данные пользователя из Firebase
        const { sheet } = await GetFirebaseUser(ctx, id)
        // Ищем данные в таблице на основе определенного статуса мониторинга
        const sheet_data = await SearchSheet(ctx, sheet, null, 'Cloudflare')

        // Формируем список элементов для мониторинга
        const offers = sheet_data.map(item => {
            return {
                name: item._rawData[2],
                url: item._rawData[5]
            }
        })

        // Генерация данных
        const generateData = await generateCSVData(offers, keywords.split('\n'), length)

        const fields = ['name', 'url', 'notes', 'direct', 'staticUrl', 'payout', 'currency', 'affiliateNetworkName', 'keywords']

        // Преобразование массива объектов в CSV формат
        const opts = { fields }
        const csv = parse(generateData, opts)

        // Запись в файл
        fs.writeFileSync(`./cache/clickflare/${username}-output.csv`, csv)

        await ctx.replyWithDocument({ source: `./cache/clickflare/${username}-output.csv`, filename: `${username}-output.csv` })

        // Логируем выполнение функции
        LOG(username, 'Middlewares/Admin/CreateOffersCSV')
        return true
    } catch (error) {
        // Логируем ошибку
        LOG(username, 'Middlewares/Admin/CreateOffersCSV', error, ctx)
    }
}
//* END

module.exports = {
    GenerateeOffersMiddleware
}