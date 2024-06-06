//? NOTIFICATION | COMPANY

//* Requires
const { LOG } = require('@helpers/base')
const { SendAdminMessage, EditAdminMessage, CreateKeyboard } = require('@helpers/base')
const { CreateMiddleware } = require('@middlewares/TonicMiddlewares')
const { MonitoringAddMiddleware } = require('@middlewares/MonitoringMiddlewares')
const { SearchSheet } = require('@helpers/sheet')
const { GetUser } = require('@helpers/users')


//* START - CompanyNotification
const CompanyNotification = async (ctx) => {
    const { id, username } = ctx.from;

    try {
        const { message_id } = await SendAdminMessage(ctx, username);
        const { sheet, domain } = await GetUser(ctx, id)

        const sheetList = await SearchSheet(ctx, sheet, null, 'В работе')
        const list = sheetList.map(item => {
            const [ ,target, name,,pixel,token,,,event,...keywords ] = item._rawData;
            const country = name.split('_')[1]
            const offer = name.split('_')[0].replace(/([a-z])([A-Z])/g, '$1 $2') + ' PR'
            return { name, offer, country, keywords: keywords, domain, pixel, token, target, event };
        });

        for (const item of list) {
            const company = await CreateMiddleware(ctx, item)

            if(company) {
                MonitoringAddMiddleware(ctx, item.name, sheet)
            }
        }

        const keyboard = CreateKeyboard(id, message_id);

        setTimeout(async () => {
            await EditAdminMessage(ctx, message_id, username, keyboard);
        }, 2000);

        await ctx.replyWithHTML(`♻️ <b>Заявка: №${message_id} | Отправлена в работу...</b>`);

        LOG(username, 'Notifications/CompanyNotification');
    } catch (error) {
        LOG(username, 'Notifications/CompanyNotification', error);
    }
};
//* END - CompanyNotification


module.exports = { CompanyNotification }