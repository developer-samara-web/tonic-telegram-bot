//? MESSAGES | USERS

//* Requires
const { LOG } = require('@helpers/base')


//* START
const UsersAddMessage = async (ctx, status, id, name) => {
    // Получаем имя пользователя из контекста
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'
    
    try {
        // Логируем выполнение функции
        LOG(username, 'Messages/Users/UsersAddMessage')

        // Возвращаем сообщение об успешном добавлении или неудаче
        return status ?
            `✅ <b>[ @${name} | ID:${id} ]</b> успешно добавлен.` :
            `🚫 <b>[ @${name} | ID:${id} ]</b> не был добавлен.`
    } catch (error) {
        // Логируем ошибку
        LOG(username, 'Messages/Users/UsersAddMessage', error, ctx)
    }
}
//* END


//* START
const UsersRemoveMessage = async (ctx, status, id) => {
    // Получаем имя пользователя из контекста
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'
    
    try {
        // Логируем выполнение функции
        LOG(username, 'Messages/Users/UsersRemoveMessage')

        // Возвращаем сообщение об успешном удалении или неудаче
        return status ?
            `✅ <b>[ ID:${id} ]</b> успешно удалён.` :
            `🚫 <b>[ ID:${id} ]</b> не был удалён.`
    } catch (error) {
        // Логируем ошибку
        LOG(username, 'Messages/Users/UsersRemoveMessage', error, ctx)
    }
}
//* END


//* START
const UsersListMessage = async (ctx, users) => {
    // Получаем имя пользователя из контекста
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'
    
    try {
        // Инициализируем сообщение с заголовком
        let message = "🚹 <b>Список пользователей:</b>\n----------------------------------\n"

        // Перебираем список пользователей и добавляем информацию о каждом
        for (const user of users) {
            message += `🔹 <b>ID:</b> ${user.id}\n🔸 <b>Ник:</b> ${user.name}\n----------------------------------\n`
        }

        // Логируем выполнение функции
        LOG(username, 'Messages/Users/UsersListMessage')
        return message
    } catch (error) {
        // Логируем ошибку
        LOG(username, 'Messages/Users/UsersListMessage', error, ctx)
    }
}
//* END


module.exports = { 
    UsersAddMessage, 
    UsersRemoveMessage, 
    UsersListMessage 
}