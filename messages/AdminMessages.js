//? MESSAGES | ADMIN

//* Requires
const { LOG } = require('@helpers/base')


//* START
const AdminMessage = async (ctx, message) => {
    // Получаем имя пользователя из контекста или устанавливаем 'BOT' по умолчанию
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'

    try {
        // Логируем информацию о вызове функции
        LOG(username, 'Messages/Admin/AdminMessage')
        
        // Формируем и возвращаем сообщение для администратора
        return `⚠️ <b>Сообщение от бота:</b>\n\n${message}`
    } catch (error) {
        // Логируем ошибку, если она произошла
        LOG(username, 'Messages/Admin/AdminMessage', error, ctx)
    }
}
//* END


module.exports = { AdminMessage }