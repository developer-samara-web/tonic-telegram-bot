//? MIDDLEWARES | MONITORING

//* Requires
const { LOG } = require('@helpers/base')
const { SearchSheet } = require('@services/sheet')
const { GetMonitoringList, SetMonitoringItem, GetFirebaseUser } = require('@services/firebase')
const { MonitoringAddMessage, MonitoringMessage } = require('@messages/MonitoringMessages')


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
    SetMonitoringItemMiddleware
}