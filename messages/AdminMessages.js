//? ADMINMESSAGES.JS

// Require
const { LOG } = require('@helpers/helpers')

// AdminMessage
const AdminMessage = async (ctx, message) => {
    const { username } = ctx.message.from
    try {
        LOG(username, 'Messages/Admin/AdminMessage')
        return `⚠️ <b>Сообщение от бота:</b>\n\n${message}`
    } catch (error) {
        LOG(username, 'Messages/Admin/AdminMessage', error)
    }
}

module.exports = { AdminMessage }