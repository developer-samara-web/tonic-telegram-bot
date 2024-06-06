//? HELPERS | SHEET

//* Requires
const { LOG, UpdateRowData } = require('@helpers/base')
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library')


//* START - AuthSheet | Авторизация Google Sheet
const AuthSheet = async (ctx) => {
    const { username } = ctx.message.from
    try {
        LOG(username, 'Helpers/Sheet/AuthSheet')
        return serviceAccountAuth = new JWT({
            email: process.env.SHEET_EMAIL,
            key: process.env.SHEET_KEY,
            scopes: [
                process.env.SHEET_SCOPES_1,
                process.env.SHEET_SCOPES_2
            ],
        });
    } catch (error) {
        LOG(username, 'Helpers/Sheet/AuthSheet', error)
    }
}
//* END - AuthSheet


//* START - LoadSheet | Запрос получения данных из GoogleSheet тыблицы
const LoadSheet = async (ctx, sheet_id) => {
    const auth = await AuthSheet(ctx)
    const { username } = ctx.message.from
    try {
        const sheet = new GoogleSpreadsheet(sheet_id, auth);
        await sheet.loadInfo();

        LOG(username, 'Helpers/Sheet/LoadSheet')
        return await sheet.sheetsByIndex[0].getRows()
    } catch (error) {
        LOG(username, 'Helpers/Sheet/LoadSheet', error)
    }
}
//* END - LoadSheet


//* START - SearchSheet | Поиск строк в GoogleSheet таблице
const SearchSheet = async (ctx, sheet_id, name, status) => {
    const { username } = ctx.message.from
    try {
        const rows = await LoadSheet(ctx, sheet_id);

        LOG(username, 'Helpers/Sheet/SearchSheet')
        if (status){
            return rows.filter(row => row._rawData[0] === status)
        } else {
            return rows.find(row => row._rawData[2] === name)
        }
    } catch (error) {
        LOG(username, 'Helpers/Sheet/SearchSheet', error)
    }
}
//* END - SearchSheet


//* START - SaveSheet | Сохранение изменений в GoogleSheet таблице
const SaveSheet = async (ctx, sheet_id, name, update) => {
    const { username } = ctx.message.from;
    try {
        const row = await SearchSheet(ctx, sheet_id, name);
        const [offer] = name.split('_');
        
        UpdateRowData(ctx, row, update, offer);
        LOG(username, 'Helpers/Sheet/SaveSheet')

        return await row.save();
    } catch (error) {
        LOG(username, 'Helpers/Sheet/SaveSheet', error)
    }
}
//* END - SaveSheet


module.exports = { 
    LoadSheet, 
    SaveSheet,
    SearchSheet
}