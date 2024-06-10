//? MIDDLEWARES | TONIC

//* Requires
const { LOG } = require('@helpers/base')


//* START - StatusMessage
const StatusMessage = async (ctx, json, { Keywords }, { result }) => {
    const { username } = ctx.message.from
    try {

        LOG(username, 'Messages/Tonic/StatusMessage')
        return json.status === 'active' ?
            `✅ <b>ID:${json['0'].id} | ${json['0'].name}</b>\n---------------------------------------------------------------\n<b>Offer:</b> ${json['0'].offer}\n<b>URL:</b> https://${json['0'].link}\n<b>Status:</b> ${json.status}\nCallbacks: ${result && result.view && result.click ? 'Установлены' : 'Неустановленны'}\nКлючи: ${Keywords ? Keywords : 'Неустановленны'}\n---------------------------------------------------------------` :
            json.status === 'pending' ?
                `🚼 <b>ID:${json['0'].id} | ${json['0'].name}</b>\n---------------------------------------------------------------\n<b>Status:</b> ${json.status}\n---------------------------------------------------------------` :
                undefined;
    } catch (error) {
        LOG(username, 'Messages/Tonic/StatusMessage', error)
        return false
    }
}
//* END - StatusMessage


//* START - StatisticsMessage
const StatisticsMessage = async (ctx, json) => {
    const { username } = ctx.message.from
    const MAX_MESSAGE_LENGTH = 4096; // Максимальная длина сообщения в Telegram
    const MAX_ITEMS_PER_MESSAGE = 10; // Максимальное количество элементов в одном сообщении

    try {
        let messageParts = [];

        for (let i = 0; i < json.length; i += MAX_ITEMS_PER_MESSAGE) {
            const currentSlice = json.slice(i, i + MAX_ITEMS_PER_MESSAGE);
            let currentMessage = '';

            for (const item of currentSlice) {
                const stats = `❇️ <b>${item.campaign_name}</b>\n---------------------------------------------------------------\n<b>Revenue: </b>${item.revenueUsd}$ | <b>Clicks: </b>${item.clicks} | <b>CPC: </b>${item.CPC}\n---------------------------------------------------------------\n\n`;
                if (currentMessage.length + stats.length <= MAX_MESSAGE_LENGTH) {
                    currentMessage += stats;
                } else {
                    messageParts.push(currentMessage);
                    currentMessage = stats;
                }
            }
            messageParts.push(currentMessage);
        }

        LOG(username, 'Messages/Tonic/StatisticsMessage');
        return messageParts;
    } catch (error) {
        LOG(username, 'Messages/Tonic/StatisticsMessage', error);
        return false
    }
}
//* END - StatisticsMessage


//* START - CompanyMessage
const CompanyMessage = async (ctx, json) => {
    const { username } = ctx.message.from
    try {
        // Общая статистика
        const overallStats = json.overall;
        let message = `❇️ <b>${overallStats.campaign_name}</b>\n---------------------------------------------------------------\n<b>Общая статистика</b>\n---------------------------------------------------------------\n<b>Общее количество кликов: </b>${overallStats.totalClicks}\n<b>Общий доход: </b>${parseFloat(overallStats.totalRevenueUsd).toFixed(2)}$\n<b>Общий CPC: </b>${overallStats.totalCPC}$\n---------------------------------------------------------------\n\n`;

        // Детализированная статистика по датам
        const dateStats = json.byDate.map(item =>
            `📅 <b>Дата: ${item.date}</b>\n---------------------------------------------------------------\n<b>Доход: </b>${parseFloat(item.revenueUsd).toFixed(2)}$ | <b>Клики: </b>${item.clicks} | <b>CPC: </b>${item.CPC}$\n---------------------------------------------------------------\n\n`
        ).join('');

        if (json.overall.totalClicks){
            LOG(username, 'Messages/Tonic/CompanyMessage');
            return message + dateStats;
        } else {
            return false
        }
    } catch (error) {
        LOG(username, 'Messages/Tonic/CompanyMessage', error);
        return false;
    }
}
//* END - CompanyMessage


//* START - KeywordMessage
const KeywordMessage = async (ctx, json) => {
    const { username } = ctx.message.from
    const MAX_MESSAGE_LENGTH = 4096; // Максимальная длина сообщения в Telegram
    const MAX_ITEMS_PER_MESSAGE = 10; // Максимальное количество элементов в одном сообщении

    try {
        const company_name = json[0].campaign_name;
        let messageParts = [];

        for (let i = 0; i < json.length; i += MAX_ITEMS_PER_MESSAGE) {
            const currentSlice = json.slice(i, i + MAX_ITEMS_PER_MESSAGE);
            let currentMessage = `✅ <b>${company_name}</b>\n\n`;

            for (const item of currentSlice) {
                const keywordMessage = `🔅<b>${item.keyword}</b>\n<b>Revenue: </b>${item.revenueUsd}$ | <b>Clicks: </b>${item.clicks} | <b>CPC: </b>${item.CPC}\n---------------------------------------------------------------\n`;

                if (currentMessage.length + keywordMessage.length <= MAX_MESSAGE_LENGTH) {
                    currentMessage += keywordMessage;
                } else {
                    messageParts.push(currentMessage);
                    currentMessage = keywordMessage;
                }
            }
            messageParts.push(currentMessage);
        }

        LOG(username, 'Messages/Tonic/KeywordMessage');
        return messageParts;
    } catch (error) {
        LOG(username, 'Messages/Tonic/KeywordMessage', error);
        return false
    }
}
//* END - KeywordMessage


//* START - CreateMessage
const CreateMessage = async (ctx, json) => {
    const { username } = ctx.message.from
    try {
        LOG(username, 'Messages/Tonic/CreateMessage');
        return `✅ <b>Ссылка создана</>.`
    } catch (error) {
        LOG(username, 'Messages/Tonic/CreateMessage', error)
        return false
    }
}
//* END - CreateMessage


module.exports = { 
    StatusMessage, 
    StatisticsMessage, 
    KeywordMessage, 
    CreateMessage, 
    CompanyMessage 
}