//? ACTIONS | MONITORING

//* Requires
const { LOG } = require('@helpers/base')
const { SearchSheet, SaveSheet } = require('@services/sheet')
const { GetFirebaseUser, DeleteMonitoringItem, GetMonitoringList, UpdateMonitoringItem } = require('@services/firebase')
const { MonitoringDeleteMessage, MonitoringRefreshMessage, MonitoringEndMessage } = require('@messages/MonitoringMessages')
const { UpdateMonitoringItemMiddleware } = require('@middlewares/MonitoringMiddlewares')
const { CreateMiddleware } = require('@middlewares/TonicMiddlewares')
const { Status } = require('@services/tonic')


//* START
const MonitoringAction = async (ctx) => {
    const { username, id } = ctx.update.callback_query.from
    const { sheet } = await GetFirebaseUser(ctx, id)
    const { data } = ctx.update.callback_query

    try {
        switch (data) {
            // Обработка создания мониторинга
            case 'create_monitoring': {
                ctx.answerCbQuery('♻️ Создаю компании...')
                const items = await GetMonitoringList(ctx, id)

                for (const item of items) {
                    const status = await CreateMiddleware(ctx, item)
                    await UpdateMonitoringItem(ctx, item.name, status)

                    const message = await GetMonitoringList(ctx, id)
                    await MonitoringRefreshMessage(ctx, message, sheet)
                }
                break
            }

            // Обработка удаления мониторинга
            case 'clear_monitoring': {
                ctx.answerCbQuery('♻️ Удаляю компании...')
                const sheet_data = await SearchSheet(ctx, sheet, null, 'Cloudflare')
                const items = sheet_data.map(item => item._rawData[2])

                for (const item of items) {
                    await DeleteMonitoringItem(ctx, item)
                }

                const message = await GetMonitoringList(ctx, id)
                await MonitoringDeleteMessage(ctx, message)
                break
            }

            // Обработка обновления мониторинга
            default: {
                ctx.answerCbQuery('♻️ Обновляю компании...')
                const items = await GetMonitoringList(ctx, id)

                let allLinksUpdated = true  // Инициализируем как true

                for (const item of items) {
                    // Если статус не соответствует, создаём ссылку заново
                    if (item.status !== '🔸 Создаётся' && item.status !== '✅ Ссылка готова') {
                        await UpdateMonitoringItemMiddleware(ctx, item.name)
                        const status = await CreateMiddleware(ctx, item)
                        await UpdateMonitoringItem(ctx, item.name, status)
                        const message = await GetMonitoringList(ctx, id)
                        await MonitoringRefreshMessage(ctx, message, sheet)

                        // Проверяем, если статус всё ещё не соответствует
                        if (status !== '✅ Ссылка готова') {
                            allLinksUpdated = false;  // Не все ссылки обновлены
                        }
                    }

                    // Проверка активного статуса компании
                    if (item.status === '🔸 Создаётся' || item.status === '✅ Ссылка готова') {
                        const company = await Status(ctx, encodeURIComponent(item.name), item.target)

                        if (company.status === 'active' && item.status === '🔸 Создаётся') {
                            const link = `https://${company['0'].link}`
                            const offerName = encodeURIComponent(item.offer)

                            // Сохраняем и обновляем статус
                            await SaveSheet(ctx, item.sheet, item.name, { type: 'href', data: link }, offerName)
                            await UpdateMonitoringItem(ctx, item.name, '✅ Ссылка готова', link)

                            const message = await GetMonitoringList(ctx, id)
                            await MonitoringRefreshMessage(ctx, message, sheet)
                        }

                        // Проверяем, если статус всё ещё не соответствует
                        if (item.status !== '✅ Ссылка готова') {
                            allLinksUpdated = false
                        }
                    }
                }

                // Если все ссылки обновлены, отправляем итоговое сообщение
                if (allLinksUpdated) {
                    const message = await GetMonitoringList(ctx, id)
                    await MonitoringEndMessage(ctx, message, sheet)
                }
            }
        }

        LOG(username, 'Actions/MonitoringAction')
    } catch (error) {
        LOG(username, 'Actions/MonitoringAction', error, ctx)
    }
}
//* END


module.exports = { MonitoringAction }