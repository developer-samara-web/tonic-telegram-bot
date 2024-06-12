//? HELPERS | BASE

//* Requires
const fs = require('fs');
const archiver = require('archiver');
const path = require('path');
const { Markup } = require('telegraf')
const { LoadSheet } = require('@helpers/sheet')


//* START - Logger
const LOG = async (user, object, error) => {
    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const time = now.toTimeString().slice(0, 8);
    const logMessage = `[${error ? 'ERROR' : 'INFO'}][${date} ${time}] User: ${user}, Function: ${object}, ${error ? 'ERROR' : 'INFO'}: ${error ? error : 'OK'}\n`;

    const logDir = path.join(__dirname, '..', 'logs');

    try {
        await fs.promises.mkdir(logDir, { recursive: true });
        const filePath = path.join(logDir, `${date}.log`);
        await fs.promises.appendFile(filePath, logMessage);
    } catch (error) {
        console.error('Ошибка записи логов:', error);
    }
}
//* END - Logger


//* START - Archive
const Archive = (ctx, logDirectory, outputFilePath) => {
    const { username } = ctx.message.from
    try {
        return new Promise((resolve, reject) => {
            const output = fs.createWriteStream(outputFilePath);
            const archive = archiver('zip', { zlib: { level: 9 } });

            output.on('close', () => {
                resolve(outputFilePath);
            });

            archive.on('error', reject);

            archive.pipe(output);
            archive.glob('**/*', {
                cwd: logDirectory,
                ignore: [path.basename(outputFilePath)]
            });

            archive.finalize();

            LOG(username, 'Helpers/Base/Archive')
        });
    } catch (error) {
        LOG(username, 'Helpers/Base/Archive', error)
    }
}
//* END - Archive


//* START - DateCurent
const DateCurent = async (ctx, date) => {
    const { username } = ctx.message.from

    try {
        const dateGenerateAsync = async (num) => {
            const previousDay = new Date();
            previousDay.setDate(previousDay.getDate() - num);

            const [year, month, day] = [
                previousDay.getFullYear(),
                String(previousDay.getMonth() + 1).padStart(2, '0'),
                String(previousDay.getDate()).padStart(2, '0')
            ];

            return `${year}-${month}-${day}`;
        };

        switch (date) {
            case 'Сегодня':
                LOG(username, 'Helpers/Base/DateCurent')
                return `date=${await dateGenerateAsync(0)}`;
            case 'Вчера':
                LOG(username, 'Helpers/Base/DateCurent')
                return `date=${await dateGenerateAsync(1)}`;
            case 'За 3 дня':
                LOG(username, 'Helpers/Base/DateCurent')
                return `from=${await dateGenerateAsync(3)}&to=${await dateGenerateAsync(0)}`
            case 'За неделю':
                LOG(username, 'Helpers/Base/DateCurent')
                return `from=${await dateGenerateAsync(7)}&to=${await dateGenerateAsync(0)}`
            case 'За месяц':
                LOG(username, 'Helpers/Base/DateCurent')
                return `from=${await dateGenerateAsync(30)}&to=${await dateGenerateAsync(0)}`
            default:
                LOG(username, 'Helpers/Base/DateCurent')
                return `from=${date.split(':')[0]}&to=${date.split(':')[1]}`;
        }
    } catch (error) {
        LOG(username, 'Helpers/Base/DateCurent', error)
    }
}
//* END - DateCurent


//* START - GroupByDate
const GroupByDate = (data, companyName) => {
    return data.reduce((acc, item) => {
        const dateKey = item.date;
        if (!acc[dateKey]) {
            acc[dateKey] = {
                date: dateKey,
                campaign_name: item.campaign_name,
                clicks: 0,
                revenueUsd: 0.0,
                CPC: 0.0,
                items: []
            };
        }
        acc[dateKey].clicks += Number(item.clicks);
        acc[dateKey].revenueUsd += parseFloat(item.revenueUsd);
        acc[dateKey].items.push(item);
        return acc;
    }, {});
}
//* END - GroupByDate


//* START - CalculateStatistics
const CalculateStatistics = (groupedData, companyName) => {
    let totalClicks = 0;
    let totalRevenueUsd = 0.0;

    for (const dateKey in groupedData) {
        totalClicks += groupedData[dateKey].clicks;
        totalRevenueUsd += groupedData[dateKey].revenueUsd;
        groupedData[dateKey].CPC = (groupedData[dateKey].revenueUsd / groupedData[dateKey].clicks).toFixed(2);
    }

    return {
        campaign_name: companyName,
        totalClicks: totalClicks,
        totalRevenueUsd: totalRevenueUsd.toFixed(2),
        totalCPC: (totalRevenueUsd / totalClicks).toFixed(2)
    };
}
//* END - CalculateStatistics


//* START - CreateKeywordItem
const CreateKeywordItem = (item) => {
    return {
        ...item,
        CPC: (item.revenueUsd / item.clicks).toFixed(2)
    };
}
//* END - CreateKeywordItem


//* START - KeywordUpdateItem
const KeywordUpdateItem = (existingItem, item) => {
    existingItem.clicks = String(Number(existingItem.clicks) + Number(item.clicks));
    existingItem.revenueUsd = (parseFloat(existingItem.revenueUsd) + parseFloat(item.revenueUsd)).toFixed(2);
    existingItem.CPC = (existingItem.revenueUsd / existingItem.clicks).toFixed(2);
}
//* END - KeywordUpdateItem


//* START - FilterKeyword
const FilterKeyword = (data, companyName) => {
    return data.filter(obj => obj.campaign_name === companyName)
        .reduce((acc, item) => {
            const existingItem = acc.find(group => group.campaign_name === item.campaign_name && group.keyword === item.keyword);
            if (existingItem) {
                KeywordUpdateItem(existingItem, item);
            } else {
                acc.push(CreateKeywordItem(item));
            }
            return acc;
        }, []);
}
//* END - FilterKeyword


//* START - CreateStatsItem
const CreateStatsItem = (item) => {
    return {
        ...item,
        revenueUsd: parseFloat(item.revenueUsd).toFixed(2),
        CPC: (item.revenueUsd / item.clicks).toFixed(2)
    };
}
//* END - CreateStatsItem


//* START - UpdateStatsItem
const UpdateStatsItem = (existingItem, item) => {
    existingItem.clicks = String(Number(existingItem.clicks) + Number(item.clicks));
    existingItem.revenueUsd = (parseFloat(existingItem.revenueUsd) + parseFloat(item.revenueUsd)).toFixed(2);
    existingItem.CPC = (existingItem.revenueUsd / existingItem.clicks).toFixed(2);
}
//* END - UpdateStatsItem


//* START - FilterStats
const FilterStats = (data, source, sheet_id) => {
    const sheetList = LoadSheet(ctx, sheet_id)
    const compains = sheetList.map(row => {
        return row._rawData
    })
    console.log(compains)

    // return data.filter(obj => sheet.includes(obj.name) && obj.network === source)
    //     .reduce((acc, item) => {
    //         const existingItem = acc.find(group => group.campaign_name === item.campaign_name);
    //         if (existingItem) {
    //             UpdateStatsItem(existingItem, item);
    //         } else {
    //             acc.push(CreateStatsItem(item));
    //         }
    //         return acc;
    //     }, []);
}
//* END - FilterStats


//* START - CreateURL | Создание URL компании на основе параметров
const CreateURL = (ctx, update, offer, network) => {
    const { username } = ctx.message.from
    const adTitle = offer.replace(/([a-z])([A-Z])/g, '$1+$2');

    try {
        if (network === 'facebook') {
            return `${update.data}/?adtitle=${adTitle}${process.env.FACEBOOK_URL}`;
        } else if (network === 'tiktok') {
            return `${update.data}/?adtitle=${adTitle}${process.env.TIKTOK_URL}`;
        }

        LOG(username, 'Helpers/Base/CreateURL')
    } catch (error) {
        LOG(username, 'Helpers/Base/CreateURL', error)
    }
}
//* END - CreateURL


//* START - UpdateRowData
const UpdateRowData = (ctx, row, update, offer) => {
    const { username } = ctx.message.from;
    const updateMap = { status: 0, network: 1 };

    try {

        if (update.type in updateMap) {
            row._rawData[updateMap[update.type]] = update.data;
        } else if (update.type === 'href' && (row._rawData[1] === 'facebook' || row._rawData[1] === 'tiktok')) {
            row._rawData[3] = CreateURL(ctx, update, offer, row._rawData[1])
            row._rawData[0] = 'Cloudflare'
        }

        LOG(username, 'Helpers/Base/UpdateRowData')
    } catch (error) {
        LOG(username, 'Helpers/Base/UpdateRowData', error)
    }
}
//* END - UpdateRowData


//* START - SendAdminMessage
const SendAdminMessage = async (ctx, username) => {
    return await ctx.telegram.sendMessage(process.env.TELEGRAM_ADMIN_ID, `♻️ <b>Новые ссылки от <i>${username}</i>, загружаю...</b>`, {
        parse_mode: 'HTML'
    });
}
//* END - SendAdminMessage


//* START - EditAdminMessage
const EditAdminMessage = async (ctx, message_id, username, keyboard) => {
    await ctx.telegram.editMessageText(process.env.TELEGRAM_ADMIN_ID, message_id, null, `♻️ <b>Заявка №${message_id} | Новые ссылки от <i>${username}</i></b>`, {
        parse_mode: 'HTML',
        reply_markup: keyboard.reply_markup
    });
}
//* END - EditAdminMessage


//* START - CreateKeyboard
const CreateKeyboard = (id, message_id) => {
    return Markup.inlineKeyboard([
        Markup.button.callback('✅ Выполнено', JSON.stringify({ action: 'complite', id, message_id }))
    ]);
}
//* END - CreateKeyboard


module.exports = {
    LOG,
    Archive,
    GroupByDate,
    CalculateStatistics,
    FilterKeyword,
    FilterStats,
    UpdateRowData,
    DateCurent,
    SendAdminMessage,
    EditAdminMessage,
    CreateKeyboard
}