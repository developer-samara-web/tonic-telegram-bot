//? HELPERS | SHEET

//* Requires
const { LOG, UpdateRowData } = require('@helpers/base')
const { GoogleSpreadsheet } = require('google-spreadsheet')


//* START
const AuthSheet = async (ctx) => {
    const { username = 'BOT' } = ctx.message?.from || ctx.callbackQuery?.from

    try {
        LOG(username, 'Config/AuthSheet')
        return serviceAccountAuth = new JWT({
            email: process.env.SHEET_EMAIL,
            key: process.env.SHEET_KEY,
            scopes: [
                process.env.SHEET_SCOPES_1,
                process.env.SHEET_SCOPES_2
            ],
        });
    } catch (error) {
        LOG(username, 'Config/AuthSheet', error, ctx)
    }
}
//* END


//* START
const LoadSheet = async (ctx, sheet_id) => {
    // Авторизация для доступа к Google Sheets
    const auth = await AuthSheet(ctx)
    // Получаем имя пользователя из контекста
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'

    try {
        // Создаем объект для работы с таблицей Google Sheets
        const sheet = new GoogleSpreadsheet(sheet_id, auth)
        // Загружаем информацию о таблице
        await sheet.loadInfo()

        // Логируем успешную загрузку таблицы
        LOG(username, 'Helpers/Sheet/LoadSheet')
        // Возвращаем строки из первого листа таблицы
        return await sheet.sheetsByIndex[0].getRows()
    } catch (error) {
        // Логируем ошибку, если она произошла
        LOG(username, 'Helpers/Sheet/LoadSheet', error, ctx)
    }
}
//* END


//* START
const SearchSheet = async (ctx, sheet_id, name, status) => {
    // Получаем имя пользователя из контекста
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'

    try {
        // Загружаем строки из таблицы
        const rows = await LoadSheet(ctx, sheet_id)

        // Логируем успешное выполнение поиска
        LOG(username, 'Helpers/Sheet/SearchSheet')

        // Если передан статус, фильтруем строки по статусу
        if (status) {
            return rows.filter(row => row._rawData[0] === status)
        } else {
            // Иначе ищем строку по имени
            return rows.find(row => row._rawData[2] === name)
        }
    } catch (error) {
        // Логируем ошибку, если она произошла
        LOG(username, 'Helpers/Sheet/SearchSheet', error, ctx)
    }
}
//* END


//* START
const SaveSheet = async (ctx, sheet_id, name, update, offer) => {
    // Получаем имя пользователя из контекста
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'

    try {
        // Ищем строку в таблице по имени
        const row = await SearchSheet(ctx, sheet_id, name)

        // Обновляем данные строки
        UpdateRowData(ctx, row, update, offer)

        // Логируем успешное выполнение сохранения
        LOG(username, 'Helpers/Sheet/SaveSheet')

        // Сохраняем обновленную строку
        return await row.save()
    } catch (error) {
        // Логируем ошибку, если она произошла
        LOG(username, 'Helpers/Sheet/SaveSheet', error, ctx)
    }
}
//* END


module.exports = { 
    LoadSheet, 
    SaveSheet,
    SearchSheet
}