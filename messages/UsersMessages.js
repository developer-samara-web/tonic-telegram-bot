//? MIDDLEWARES | USERS

//* Requires
const { LOG } = require('@helpers/base')


//* START - UsersAddMessage
const UsersAddMessage = async (ctx, status, id, name) => {
    const { username } = ctx.message.from
    try {
        LOG(username, 'Messages/Users/UsersAddMessage')

        return status ?
            `✅ <b>[ @${name} | ID:${id} ]</b> успешно добавлен.`:
            `🚫 <b>[ @${name} | ID:${id} ]</b> не был добавлен.`
    } catch (error) {
        LOG(username, 'Messages/Users/UsersAddMessage', error)
    }
}
//* END - UsersAddMessage


//* START - UsersRemoveMessage
const UsersRemoveMessage = async (ctx, status, id) => {
    const { username } = ctx.message.from
    try {
        LOG(username, 'Messages/Users/UsersRemoveMessage')

        return status ?
            `✅ <b>[ ID:${id} ]</b> успешно удалён.`:
            `🚫 <b>[ ID:${id} ]</b> не был удалён.`
    } catch (error) {
        LOG(username, 'Messages/Users/UsersRemoveMessage', error)
    }
}
//* END - UsersRemoveMessage


//* START - UsersListMessage
const UsersListMessage = async (ctx, users) => {
    const { username } = ctx.message.from
    try {
        let message = "🚹 <b>Список пользователей:</b>\n\n----------------------------------\n";

        for (const user of users) {
            message += `💠 <b>ID:</b> ${user.id} | <b>Ник:</b> ${user.name}\n----------------------------------\n`;
        }

        LOG(username , 'Messages/Users/UsersListMessage')
        return message
    } catch (error) {
        LOG(username , 'Messages/Users/UsersListMessage', error)
    }
}
//* END - UsersListMessage


module.exports = { 
    UsersAddMessage, 
    UsersRemoveMessage, 
    UsersListMessage 
}