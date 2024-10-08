//? MESSAGES | MONITORING

//* Requires
const { LOG, DateNow } = require('@helpers/base')
const { Markup } = require('telegraf')


//* START
const MonitoringMessage = async (ctx, message) => {
    // Получаем имя пользователя из контекста или устанавливаем 'BOT' по умолчанию
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'

    try {
        // Формируем сообщение в зависимости от наличия данных в массиве message
        const result = message.length
            ? `♻️ <b>[ ${DateNow()} ]  У вас в очереди:</b>\n-- -- -- -- -- -- -- -- -- -- -- -- -- -- --\n${message.map(item => `${item.status ? '🔸' : '🔺'} ${item.name}\n${item.status}\n-- -- -- -- -- -- -- -- -- -- -- -- -- -- --\n`).join('')}`
            : `🔸 <b>Список компаний пуст.</b>`; // Сообщение о пустом списке, если массив message пустой

        // Отправляем сформированное сообщение в чат
        await ctx.replyWithHTML(result)

        // Логируем информацию о вызове функции
        LOG(username, 'Messages/Monitoring/MonitoringMessage')
    } catch (error) {
        // Логируем ошибку, если она произошла
        LOG(username, 'Messages/Monitoring/MonitoringMessage', error, ctx)
    }
}
//* END


//* START
const MonitoringAddMessage = async (ctx, message) => {
    // Получаем имя пользователя из контекста или устанавливаем 'BOT' по умолчанию
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'

    try {
        // Формируем сообщение в зависимости от наличия данных в массиве message
        const result = message.length
            ? `♻️ <b>[ ${DateNow()} ]  У вас в очереди:</b>\n-- -- -- -- -- -- -- -- -- -- -- -- -- -- --\n${message.map(item => `${item.status == '🔸 В очереди' ? '🔸' : '🔺'} <b>${item.name}</b>\n-- -- -- -- -- -- -- -- -- -- -- -- -- -- --\n`).join('')}`
            : `🔸 <b>В таблице нет компаний на создание.</b>\n(Для чтения компаний проставьте статус "Создать").`; // Сообщение о пустом списке, если массив message пустой
        // Отправляем сформированное сообщение в чат, с кнопками для взаимодействия
        await ctx.replyWithHTML(result, message.length ? Markup.inlineKeyboard([
            Markup.button.callback('▶️ Отправить', 'create_monitoring'), // Кнопка для отправки мониторинга
            Markup.button.callback('🚫 Отменить', 'clear_monitoring') // Кнопка для отмены действия
        ]) : null)

        // Логируем информацию о вызове функции
        LOG(username, 'Messages/Monitoring/MonitoringAddMessage')
    } catch (error) {
        // Логируем ошибку, если она произошла
        LOG(username, 'Messages/Monitoring/MonitoringAddMessage', error, ctx)
    }
}
//* END


//* START
const MonitoringDeleteMessage = async (ctx) => {
    // Получаем идентификатор чата и идентификатор сообщения из контекста обратного вызова
    const chatId = ctx.update.callback_query.from.id
    const messageId = ctx.update.callback_query.message.message_id

    // Получаем имя пользователя из контекста или устанавливаем 'BOT' по умолчанию
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'

    try {
        // Изменяем текст сообщения в чате на новое сообщение о пустом списке компаний
        await ctx.telegram.editMessageText(chatId, messageId, null, '<b>🔸 Список компаний пуст.</b>', {
            parse_mode: 'HTML' // Указываем режим парсинга HTML для форматирования текста
        });

        // Логируем информацию о вызове функции
        LOG(username, 'Messages/Monitoring/MonitoringDeleteMessage')
    } catch (error) {
        // Логируем ошибку, если она произошла
        LOG(username, 'Messages/Monitoring/MonitoringDeleteMessage', error, ctx)
    }
}
//* END


//* START
const MonitoringRefreshMessage = async (ctx, message) => {
    // Получаем идентификатор чата и идентификатор сообщения из контекста обратного вызова
    const chatId = ctx.update.callback_query.from.id
    const messageId = ctx.update.callback_query.message.message_id

    // Получаем имя пользователя из контекста или устанавливаем 'BOT' по умолчанию
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'

    try {
        // Формируем результат с информацией о количестве компаний и их статусах
        const result = `<b>♻️ [ ${DateNow()} ]  У вас в очереди:\n-- -- -- -- -- -- -- -- -- -- -- -- -- -- --\n</b>${message.map(item => `${item.status == '🔸 Создаётся' || item.status == '✅ Ссылка готова' ? '🔸' : '🔺'} <b>${item.name}</b>${item.status == '🔸 Создаётся' || item.status == '✅ Ссылка готова' || item.status == '🔸 В очереди' ? '' : `\n🚫 ${item.status}`}\nКлючи: ${item.keywords_status ? '✅' : '🚫'} | Постбек: ${item.callback_status ? '✅' : '🚫'} | Пиксель: ${item.pixel_status ? '✅' : '🚫'}\n-- -- -- -- -- -- -- -- -- -- -- -- -- -- --\n`).join('')}`
        // Обновляем текст сообщения в чате с новым содержимым и добавляем кнопку для обновления
        await ctx.telegram.editMessageText(chatId, messageId, null, result, {
            parse_mode: 'HTML', // Указываем режим парсинга HTML для форматирования текста
            reply_markup: { // Добавляем инлайн-клавиатуру с кнопкой "Обновить"
                inline_keyboard: [
                    [{ text: '🔄 Обновить', callback_data: 'refresh_monitoring' }]
                ]
            }
        })

        // Логируем информацию о вызове функции
        LOG(username, 'Messages/Monitoring/MonitoringRefreshMessage')
    } catch (error) {
        // Логируем ошибку, если она произошла
        LOG(username, 'Messages/Monitoring/MonitoringRefreshMessage', error, ctx)
    }
}
//* END


//* START
const MonitoringEndMessage = async (ctx, message, sheet) => {
    // Получаем идентификатор чата и идентификатор сообщения из контекста обратного вызова
    const chatId = ctx.update.callback_query.from.id;
    const messageId = ctx.update.callback_query.message.message_id;

    // Получаем имя пользователя из контекста или устанавливаем 'BOT' по умолчанию
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT';

    try {
        // Формируем результат с сообщением о завершении очереди и информацией о каждом элементе
        const result = `✅ [ ${DateNow()} ]  <b>Очередь завершена:</b>\n` +
            message.map(item =>
                `-- -- -- -- -- -- -- -- -- -- -- -- -- -- --\n` +  // Заменяем дефисы на HTML-тег <hr/>
                `${item.status === '✅ Ссылка готова' ? '✅' : '🔺'} ` +
                `<b>${item.name}</b>\n`
            ).join('') +
            `-- -- -- -- -- -- -- -- -- -- -- -- -- -- --\n` +  // Заменяем дефисы на HTML-тег <hr/>
            `<b>Таблица:</b>\nhttps://docs.google.com/spreadsheets/d/${sheet}`;

        // Обновляем текст сообщения в чате с новым содержимым и добавляем кнопку для очистки очереди
        await ctx.telegram.editMessageText(chatId, messageId, null, result + ' ', {
            parse_mode: 'HTML', // Указываем режим парсинга HTML для форматирования текста
            reply_markup: { // Добавляем инлайн-клавиатуру с кнопкой "Очистить очередь"
                inline_keyboard: [
                    [{ text: 'Очистить очередь', callback_data: 'clear_monitoring' }]
                ]
            }
        });

        // Логируем информацию о вызове функции
        LOG(username, 'Messages/Monitoring/MonitoringEndMessage');
    } catch (error) {
        // Логируем ошибку, если она произошла
        LOG(username, 'Messages/Monitoring/MonitoringEndMessage', error, ctx);
    }
};
//* END


module.exports = {
    MonitoringMessage,
    MonitoringAddMessage,
    MonitoringDeleteMessage,
    MonitoringRefreshMessage,
    MonitoringEndMessage
}