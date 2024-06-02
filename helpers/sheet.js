//? SHEET.JS

const { LOG } = require('@helpers/helpers')
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library')

// Auth Sheet
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

// Load Sheet
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

// Search Sheet
const SearchSheet = async (ctx, sheet_id, name) => {
    const { username } = ctx.message.from
    try {
        const rows = await LoadSheet(ctx, sheet_id);

        LOG(username, 'Helpers/Sheet/SearchSheet')
        return rows.find(row => row._rawData[2] === name)
    } catch (error) {
        LOG(username, 'Helpers/Sheet/SearchSheet', error)
    }
}

// CreateURL
const CreateURL = (ctx, update, offer, network) => {
    const adTitle = offer.replace(/([a-z])([A-Z])/g, '$1+$2');

    try{
        if (network === 'Facebook') {
            return `${update.data}/?adtitle=${adTitle}${process.env.FACEBOOK_URL}`;
        } else if (network === 'TikTok') {
            return `${update.data}/?adtitle=${adTitle}${process.env.TIKTOK_URL}`;
        }

        LOG(username, 'Helpers/Sheet/CreateURL')
    } catch (error){
        LOG(username, 'Helpers/Sheet/CreateURL', error)
    }
};

// UpdateRowData
const UpdateRowData = (ctx, row, update, offer) => {
    const { username } = ctx.message.from;
    const updateMap = { status: 0, network: 1 };

    try{
        if (update.type in updateMap) {
            row._rawData[updateMap[update.type]] = update.data;
        } else if (update.type === 'href' && (row._rawData[1] === 'Facebook' || row._rawData[1] === 'TikTok')) {
            row._rawData[3] = CreateURL(ctx, update, offer, row._rawData[1]);
            row._rawData[0] = 'Cloudflare';
        }

        LOG(username, 'Helpers/Sheet/UpdateRowData')
    } catch (error){
        LOG(username, 'Helpers/Sheet/UpdateRowData', error)
    }
};

// Save Sheet
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
};

module.exports = { LoadSheet, SaveSheet }