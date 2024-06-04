//? MIDDLEWARES | ADMIN

//* Requires
const { LOG } = require('@helpers/base')


//* START - AdminMessage | Отправка сообщения всем пользователям
const AdminMessage = async (ctx, message) => {
    const { username } = ctx.message.from
    try {
        LOG(username, 'Messages/Admin/AdminMessage')
        return `⚠️ <b>Сообщение от бота:</b>\n\n${message}`
    } catch (error) {
        LOG(username, 'Messages/Admin/AdminMessage', error)
    }
}
//* END - AdminMessage


module.exports = { AdminMessage }