//? ACTIONS | MONITORING

//* Requires
const { LOG } = require('@helpers/base')
const { SearchSheet, SaveSheet } = require('@services/sheet')
const { GetFirebaseUser, DeleteMonitoringItem, GetMonitoringList, UpdateMonitoringItem } = require('@services/firebase')
const { MonitoringDeleteMessage, MonitoringRefreshMessage, MonitoringEndMessage } = require('@messages/MonitoringMessages')
const { CreateMiddleware } = require('@middlewares/TonicMiddlewares')
const { Status } = require('@services/tonic')


//* START
const MonitoringAction = async (ctx) => {
    // Извлекаем username и id пользователя из контекста
    const { username, id } = ctx.update.callback_query.from
    // Получаем информацию о пользователе из Firebase
    const { sheet } = await GetFirebaseUser(ctx, id)
    // Получаем данные из callback_query
    const { data } = ctx.update.callback_query
    // Ищем данные в листе, связанные с мониторингом
    const sheet_data = await SearchSheet(ctx, sheet, null, process.env.MONITORING_STATUS)

    try {
        switch (data) {
            // Обработка создания мониторинга
            case 'create_monitoring':
                {
                    // Получаем список элементов мониторинга для пользователя
                    const items = await GetMonitoringList(ctx, id)
                    // Уведомляем пользователя о начале процесса создания компаний
                    ctx.answerCbQuery('♻️ Создаю компании...')
                    // Проходимся по каждому элементу и создаем компании
                    for (const item of items) {
                        await CreateMiddleware(ctx, item, 'monitoring')
                        await UpdateMonitoringItem(ctx, item.name, '🔸 Создаётся')

                        // Обновляем сообщение о мониторинге
                        const message = await GetMonitoringList(ctx, id)
                        await MonitoringRefreshMessage(ctx, message, sheet)
                    }
                }
                break

            // Обработка удаления мониторинга
            case 'delete_monitoring':
                {
                    // Извлекаем элементы для удаления из данных листа
                    const items = sheet_data.map(item => item._rawData[2])
                    // Уведомляем пользователя о начале процесса удаления компаний
                    ctx.answerCbQuery('♻️ Удаляю компании...')
                    // Проходимся по каждому элементу и удаляем его
                    for (const item of items) {
                        await DeleteMonitoringItem(ctx, item)
                    }
                    // Обновляем сообщение о мониторинге
                    const message = await GetMonitoringList(ctx, id)
                    await MonitoringDeleteMessage(ctx, message)
                }
                break

            // Завершаем мониторинг
            case 'clear_monitoring':
                {
                    // Извлекаем элементы для удаления из данных листа
                    const items = await GetMonitoringList(ctx, id)
                    // Уведомляем пользователя о начале процесса удаления компаний
                    ctx.answerCbQuery('♻️ Делаю отчистку...')
                    // Проходимся по каждому элементу и удаляем его
                    for (const item of items) {
                        await DeleteMonitoringItem(ctx, item.name)
                    }
                    // Обновляем сообщение о мониторинге
                    const message = await GetMonitoringList(ctx, id)
                    await MonitoringDeleteMessage(ctx, message)
                }
                break

            // Обработка обновления мониторинга
            default:
                {
                    // Получаем список элементов мониторинга для пользователя
                    const items = await GetMonitoringList(ctx, id)
                    // Уведомляем пользователя о начале процесса обновления компаний
                    await ctx.answerCbQuery('♻️ Обновляю компании...')

                    let allLinksUpdated = true

                    // Проходимся по каждому элементу и проверяем его статус
                    for (const item of items) {
                        const monitoringStatus = item.status
                        const company = await Status(ctx, encodeURIComponent(item.name), item.target)

                        // Если статус компании активен и мониторинг находится в процессе создания
                        if (company.status === 'active' && monitoringStatus === '🔸 Создаётся') {
                            const link = `https://${company['0'].link}`
                            const offerName = encodeURIComponent(item.offer)

                            // Сохраняем данные в лист и обновляем статус мониторинга
                            await SaveSheet(ctx, item.sheet, item.name, { type: 'href', data: link }, offerName)
                            await UpdateMonitoringItem(ctx, item.name, '✅ Ссылка готова')

                            // Обновляем сообщение о мониторинге
                            const message = await GetMonitoringList(ctx, id)
                            await MonitoringRefreshMessage(ctx, message, sheet)

                        // Если статус не соответствует завершенному
                        } else if (monitoringStatus !== '✅ Ссылка готова') {
                            allLinksUpdated = false
                        }
                    }

                    // Если все ссылки обновлены, отправляем итоговое сообщение
                    if (allLinksUpdated) {
                        const message = await GetMonitoringList(ctx, id)
                        await MonitoringEndMessage(ctx, message, sheet)
                    }
                }
                break
        }

        // Логируем действия пользователя
        LOG(username, 'Actions/MonitoringAction')
    } catch (error) {
        // Логируем ошибки, если они возникли
        LOG(username, 'Actions/MonitoringAction', error, ctx)
    }
}
//* END


module.exports = { MonitoringAction }