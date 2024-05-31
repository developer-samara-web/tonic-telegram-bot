//? SHEET.JS

const { LOG } = require('@helpers/helpers')
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library')

// Auth Sheet
const AuthSheet = async () => {
    try{
        LOG(username, 'Helpers/Sheet/AuthSheet')
        return serviceAccountAuth = new JWT({
            email: process.env.SHEET_EMAIL,
            key: process.env.SHEET_KEY,
            scopes: [
                'https://www.googleapis.com/auth/spreadsheets',
                'https://www.googleapis.com/auth/drive.file',
            ],
        });
    } catch (error) {
        LOG(username, 'Helpers/Sheet/AuthSheet', error)
    }
}

// Load Sheet
const LoadSheet = async (sheet_id) => {
    const auth = await AuthSheet()
    try{
        const sheet = new GoogleSpreadsheet(sheet_id, auth);
        await sheet.loadInfo();

        LOG(username, 'Helpers/Sheet/LoadSheet')
        return await sheet.sheetsByIndex[0].getRows()
    } catch (error){
        LOG(username, 'Helpers/Sheet/LoadSheet', error)
    }
}

// Search Sheet
const SearchSheet = async (sheet_id, name) => {
    try{
        const rows = await LoadSheet(sheet_id);

        LOG(username, 'Helpers/Sheet/SearchSheet')
        return rows.find(row => row._rawData[2] === name)
    } catch (error){
        LOG(username, 'Helpers/Sheet/SearchSheet', error)
    }
}

// Save Sheet
const SaveSheet = async (sheet_id, name, update) => {
    try{
        const row = await SearchSheet(sheet_id, name);

        switch(update.type){
            case 'status':
                row._rawData[0] = update.data
                break
            case 'network':
                row._rawData[1] = update.data
                break
            case 'href':
                row._rawData[3] = update.data
                break
        }

        LOG(username, 'Helpers/Sheet/SaveSheet')
        return await row.save();
    } catch (error) {
        LOG(username, 'Helpers/Sheet/SaveSheet')
    }
}

module.exports = { AuthSheet, LoadSheet, SearchSheet, SaveSheet }