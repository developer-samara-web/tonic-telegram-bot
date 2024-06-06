//? ACTIONS | COMPANY

//* Requires
const { Bot } = require('@config/telegram')
const { LOG } = require('@helpers/base')


//* START - CompanyAction
const CompanyAction = async (ctx) => {
    const { username } = ctx.update.callback_query.from;
    const { action, id, message_id } = JSON.parse(ctx.callbackQuery.data);

    try {
        if (action === 'complite') {
            await ctx.telegram.editMessageText(process.env.TELEGRAM_ADMIN_ID, message_id, null, `♻️ <b>Заявка: №${message_id}</b> | <i>${username}</i> | ✅ <b>Выполнено:</b>`, {
                parse_mode: 'HTML'
            })

            await Bot.telegram.sendMessage(id, `✅ <b>Заявка: №${message_id} | Компании готовы к работе</b>`, {
                parse_mode: 'HTML'
            })
        }

        LOG(username, 'Notifications/CompanyAction')
    } catch (error) {
        LOG(username, 'Notifications/CompanyAction', error)
    }
}
//* END - CompanyAction


module.exports = { CompanyAction }