//? MIDDLEWARES | MONITORING

//* Requires
const { LOG } = require('@helpers/base')
const { SearchSheet } = require('@services/sheet')
const { GetMonitoringList, SetMonitoringItem, GetFirebaseUser, DeleteMonitoringItem } = require('@services/firebase')
const { MonitoringAddMessage, MonitoringMessage, MonitoringRefreshMessage } = require('@messages/MonitoringMessages')


//* START
const MonitoringListMiddleware = async (ctx) => {
    // Извлекаем имя пользователя и идентификатор из контекста сообщения или callback-запроса
    const { username, id } = ctx.message?.from || ctx.callbackQuery?.from || 'BOT'
    
    try {
        // Получаем список для мониторинга с помощью асинхронной функции
        const message = await GetMonitoringList(ctx, id)

        // Логируем успешное выполнение функции
        LOG(username, 'Messages/Monitoring/MonitoringListMiddleware')

        // Отправляем сообщение о мониторинге
        return await MonitoringMessage(ctx, message)
    } catch (error) {
        // Логируем ошибку, если что-то пошло не так
        LOG(username, 'Messages/Monitoring/MonitoringListMiddleware', error, ctx)
    }
}
//* END

//* START
const MonitoringListAllMiddleware = async (ctx) => {
    // Извлекаем имя пользователя и идентификатор из контекста сообщения или callback-запроса
    const { username, id } = ctx.message?.from || ctx.callbackQuery?.from || 'BOT'

    try {
        // Получаем полный список для мониторинга с помощью асинхронной функции
        const message = await GetMonitoringList(ctx, id)

        // Логируем успешное выполнение функции
        LOG(username, 'Messages/Monitoring/MonitoringListAllMiddleware')

        // Отправляем сообщение о мониторинге
        return await MonitoringMessage(ctx, message)
    } catch (error) {
        // Логируем ошибку, если что-то пошло не так
        LOG(username, 'Messages/Monitoring/MonitoringListAllMiddleware', error, ctx)
    }
}
//* END

const UpdateMonitoringItemMiddleware = async (ctx, linkName) => {
    // Извлекаем имя пользователя и идентификатор из контекста сообщения или callback-запроса
    const { username, id } = ctx.message?.from || ctx.callbackQuery?.from || 'BOT';

    try {
        // Получаем данные пользователя из Firebase
        const { sheet, domain } = await GetFirebaseUser(ctx, id);
        // Ищем данные в таблице на основе определенного статуса мониторинга
        const sheet_data = await SearchSheet(ctx, sheet, null, process.env.MONITORING_STATUS);

        // Находим элемент мониторинга по названию ссылки (linkName)
        const itemToUpdate = sheet_data.find(item => item._rawData[2] === linkName);

        if (!itemToUpdate) {
            ctx.reply(`⚠️ Ссылка с именем "${linkName}" не найдена в таблице.`);
            return false;
        }

        // Собираем новые данные для обновления
        const keywords = [
            itemToUpdate._rawData[11],
            itemToUpdate._rawData[12],
            itemToUpdate._rawData[13],
            itemToUpdate._rawData[14],
            itemToUpdate._rawData[15],
            itemToUpdate._rawData[16],
        ];

        const newItem = {
            user: id,
            name: itemToUpdate._rawData[2],
            offer: itemToUpdate._rawData[3],
            country: itemToUpdate._rawData[4],
            pixel: itemToUpdate._rawData[6] || null,
            token: itemToUpdate._rawData[7] || null,
            target: itemToUpdate._rawData[1],
            event: itemToUpdate._rawData[10] || null,
            sheet: sheet,
            domain: domain,
            tonicDomain: itemToUpdate._rawData[8] || null,
            keywords: keywords.filter(element => element !== undefined),
            status: '🔸 В очереди'
        };

        // Удаляем элемент из мониторинга
        await DeleteMonitoringItem(ctx, newItem.name);

        // Добавляем элемент снова с новыми данными
        await SetMonitoringItem(ctx, newItem);

        // Получаем обновленный список для мониторинга
        const message = await GetMonitoringList(ctx, id);
        // Обновляем сообщение
        await MonitoringRefreshMessage(ctx, message, sheet);

        // Логируем успешное выполнение
        LOG(username, `Messages/Monitoring/UpdateMonitoringItemMiddleware - ${linkName} обновлён`);
        return true;
    } catch (error) {
        // Логируем ошибку
        LOG(username, 'Messages/Monitoring/UpdateMonitoringItemMiddleware', error, ctx);
        return false;
    }
};


//* START
const SetMonitoringItemMiddleware = async (ctx) => {
    // Извлекаем имя пользователя и идентификатор из контекста сообщения или callback-запроса
    const { username, id } = ctx.message?.from || ctx.callbackQuery?.from || 'BOT'
    try {
        // Получаем данные пользователя из Firebase
        const { sheet, domain } = await GetFirebaseUser(ctx, id)
        // Ищем данные в таблице на основе определенного статуса мониторинга
        const sheet_data = await SearchSheet(ctx, sheet, null, process.env.MONITORING_STATUS)

        // Формируем список элементов для мониторинга
        const list = sheet_data.map(item => {
            const keywords = [
                item._rawData[11],
                item._rawData[12],
                item._rawData[13],
                item._rawData[14],
                item._rawData[15],
                item._rawData[16],
            ]

            return {
                user: id,
                name: item._rawData[2],
                offer: item._rawData[3],
                country: item._rawData[4],
                pixel: item._rawData[6] || null,
                token: item._rawData[7] || null,
                target: item._rawData[1],
                event: item._rawData[10] || null,
                sheet: sheet,
                domain: domain,
                tonicDomain: item._rawData[8] || null,
                keywords: keywords.filter(element => element !== undefined),
                status: '🔸 В очереди'
            }
        })

        // Устанавливаем каждый элемент для мониторинга
        for (const item of list) {
            await SetMonitoringItem(ctx, item)
        }

        // Получаем обновленный список для мониторинга
        const message = await GetMonitoringList(ctx, id)
        // Отправляем сообщение о добавлении мониторинга
        await MonitoringAddMessage(ctx, message, 'update')

        // Логируем успешное выполнение функции
        LOG(username, 'Messages/Monitoring/SetMonitoringItemMiddleware')
        return true
    } catch (error) {
        // Логируем ошибку, если что-то пошло не так
        LOG(username, 'Messages/Monitoring/SetMonitoringItemMiddleware', error, ctx)
        return false
    }
}
//* END


module.exports = { 
    MonitoringListMiddleware,
    MonitoringListAllMiddleware,
    SetMonitoringItemMiddleware,
    UpdateMonitoringItemMiddleware
}