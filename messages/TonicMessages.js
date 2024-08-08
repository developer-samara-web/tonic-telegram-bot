//? MESSAGES | TONIC

//* Requires
const { LOG } = require('@helpers/base')


//* START
const StatusMessage = async (ctx, json, { Keywords }, { result }) => {
    // Получаем имя пользователя из контекста или устанавливаем 'BOT' по умолчанию
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'
    
    try {
        // Логируем имя пользователя и вызов функции
        LOG(username, 'Messages/Tonic/StatusMessage')

        // Формируем и возвращаем сообщение в зависимости от статуса кампании
        return json.status === 'active' ?
            // Если статус 'active', возвращаем подробную информацию о кампании
            `✅ <b>ID:${json['0'].id} | ${json['0'].name}</b>\n---------------------------------------------------------------\n<b>Offer:</b> ${json['0'].offer}\n<b>URL:</b> https://${json['0'].link}\n<b>Status:</b> ${json.status == 'active' ? '✅ Активна' : '⚠️ Создаётся'}\n<b>Callbacks:</b> ${result && result.viewrt && result.click && result.redirect ? '✅ Установлены' : '⚠️ Отсутствуют'}\n<b>Ключи:</b> ${Keywords != 'null' ? '\n🔅' + Keywords.join('\n🔅') : '⚠️ Отсутствуют'}\n---------------------------------------------------------------` :
            json.status === 'pending' ?
                // Если статус 'pending', возвращаем информацию о статусе
                `🚼 <b>ID:${json['0'].id} | ${json['0'].name}</b>\n---------------------------------------------------------------\n<b>Status:</b> ${json.status == 'active' ? '✅ Активна' : '⚠️ Создаётся'}\n---------------------------------------------------------------` :
                // Если статус не 'active' или 'pending', возвращаем undefined
                undefined

    } catch (error) {
        // Логируем ошибку, если она произошла
        LOG(username, 'Messages/Tonic/StatusMessage', error, ctx)
        return false // Возвращаем false в случае ошибки
    }
}
//* END


//* START
const StatisticsMessage = async (ctx, json) => {
    // Получение имени пользователя из контекста
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'
    
    // Константы для максимальной длины сообщения и количества элементов в сообщении
    const MAX_MESSAGE_LENGTH = 4096
    const MAX_ITEMS_PER_MESSAGE = 10

    try {
        // Массив для хранения частей сообщения
        let messageParts = []

        // Вычисление общей статистики
        const overallStats = json.reduce((acc, item) => {
            acc.totalRevenueUsd += parseFloat(item.revenueUsd) // Суммируем общий доход
            acc.totalClicks += parseInt(item.clicks, 10) // Суммируем общее количество кликов
            return acc
        }, { totalRevenueUsd: 0, totalClicks: 0 })

        // Расчет общего CPC
        const overallCPC = overallStats.totalClicks > 0 ? (overallStats.totalRevenueUsd / overallStats.totalClicks).toFixed(2) : '0.00'
        
        // Формирование сообщения об общей статистике
        const overallMessage = `❇️ <b>Общая статистика:</b>\n---------------------------------------------------------------\n<b>Общий доход: </b>${overallStats.totalRevenueUsd.toFixed(2)}$\n<b>Общее количество кликов: </b>${overallStats.totalClicks}\n<b>Общий CPC: </b>${overallCPC}$\n---------------------------------------------------------------\n\n`
        
        // Добавление общего сообщения в массив частей
        messageParts.push(overallMessage)

        // Разбиение статистики по кампаниям на части
        for (let i = 0; i < json.length; i += MAX_ITEMS_PER_MESSAGE) {
            const currentSlice = json.slice(i, i + MAX_ITEMS_PER_MESSAGE) // Получаем текущую часть данных
            let currentMessage = ''

            for (const item of currentSlice) {
                // Формирование сообщения для каждого элемента
                const stats = `🔅 <b>${item.campaign_name}</b>\n---------------------------------------------------------------\n<b>Revenue: </b>${parseFloat(item.revenueUsd).toFixed(2)}$ | <b>Clicks: </b>${item.clicks} | <b>CPC: </b>${parseFloat(item.CPC).toFixed(2)}$\n---------------------------------------------------------------\n\n`
                
                // Проверяем, если сообщение не превышает максимальную длину
                if (currentMessage.length + stats.length <= MAX_MESSAGE_LENGTH) {
                    currentMessage += stats // Добавляем статистику к текущему сообщению
                } else {
                    messageParts.push(currentMessage) // Сохраняем текущее сообщение
                    currentMessage = stats // Начинаем новое сообщение с текущей статистики
                }
            }
            messageParts.push(currentMessage) // Добавляем последнее сообщение, если оно не пустое
        }

        LOG(username, 'Messages/Tonic/StatisticsMessage') // Логирование
        return messageParts // Возвращаем части сообщений
    } catch (error) {
        LOG(username, 'Messages/Tonic/StatisticsMessage', error, ctx) // Логирование ошибок
        return false
    }
}
//* END


//* START
const CompanyMessage = async (ctx, json) => {
    // Получаем имя пользователя из контекста
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'
    // Максимальная длина сообщения
    const MAX_MESSAGE_LENGTH = 4096

    try {
        // Извлекаем общую статистику из JSON
        const overallStats = json.overall
        // Массив для хранения частей сообщения
        let messageParts = []

        // Формируем сообщение об общей статистике
        let overallMessage = `❇️ <b>${overallStats.campaign_name}</b>\n---------------------------------------------------------------\n<b>Общая статистика:</b>\n---------------------------------------------------------------\n<b>Общее количество кликов: </b>${overallStats.totalClicks}\n<b>Общий доход: </b>${parseFloat(overallStats.totalRevenueUsd).toFixed(2)}$\n<b>Общий CPC: </b>${overallStats.totalCPC}$\n---------------------------------------------------------------\n\n`

        // Если количество кликов равно 0, возвращаем false
        if (!json.overall.totalClicks) {
            return false
        }

        // Добавляем общее сообщение в массив частей
        messageParts.push(overallMessage)

        // Переменная для хранения текущего сообщения
        let currentMessage = ''
        // Проходим по каждому элементу в byDate
        for (const item of json.byDate) {
            // Формируем сообщение для текущей даты
            const itemMessage = `📅 <b>Дата: ${item.date}</b>\n---------------------------------------------------------------\n<b>Доход: </b>${parseFloat(item.revenueUsd).toFixed(2)}$ | <b>Клики: </b>${item.clicks} | <b>CPC: </b>${item.CPC}$\n---------------------------------------------------------------\n\n`

            // Проверяем, не превышает ли длина текущего сообщения максимальную длину
            if (currentMessage.length + itemMessage.length <= MAX_MESSAGE_LENGTH) {
                // Если не превышает, добавляем сообщение к текущему
                currentMessage += itemMessage
            } else {
                // Если превышает, добавляем текущее сообщение в массив частей
                messageParts.push(currentMessage)
                // Обнуляем текущее сообщение и добавляем новое
                currentMessage = itemMessage
            }
        }

        // Если есть оставшееся сообщение, добавляем его в массив
        if (currentMessage) {
            messageParts.push(currentMessage)
        }

        // Логируем информацию о пользователе и выполнении функции
        LOG(username, 'Messages/Tonic/CompanyMessage')
        // Возвращаем массив частей сообщения
        return messageParts
    } catch (error) {
        // Логируем ошибку
        LOG(username, 'Messages/Tonic/CompanyMessage', error, ctx)
        return false
    }
}
//* END


//* START
const KeywordMessage = async (ctx, json) => {
    // Получаем имя пользователя из контекста
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'
    // Максимальная длина сообщения
    const MAX_MESSAGE_LENGTH = 4096
    // Максимальное количество элементов в одном сообщении
    const MAX_ITEMS_PER_MESSAGE = 10

    try {
        // Извлекаем имя компании из первого элемента JSON
        const company_name = json[0].campaign_name
        // Массив для хранения частей сообщения
        let messageParts = []

        // Проходим по массиву JSON с шагом, равным максимальному количеству элементов на сообщение
        for (let i = 0; i < json.length; i += MAX_ITEMS_PER_MESSAGE) {
            const currentSlice = json.slice(i, i + MAX_ITEMS_PER_MESSAGE) // Получаем текущий срез данных
            let currentMessage = `✅ <b>${company_name}</b>\n\n` // Начинаем сообщение с названия компании

            // Проходим по каждому элементу в текущем срезе
            for (const item of currentSlice) {
                // Формируем сообщение для текущего ключевого слова
                const keywordMessage = `🔅<b>${item.keyword}</b>\n<b>Revenue: </b>${item.revenueUsd}$ | <b>Clicks: </b>${item.clicks} | <b>CPC: </b>${item.CPC}\n---------------------------------------------------------------\n`

                // Проверяем, не превышает ли длина текущего сообщения максимальную длину
                if (currentMessage.length + keywordMessage.length <= MAX_MESSAGE_LENGTH) {
                    // Если не превышает, добавляем ключевое слово к текущему сообщению
                    currentMessage += keywordMessage
                } else {
                    // Если превышает, добавляем текущее сообщение в массив частей
                    messageParts.push(currentMessage)
                    // Обнуляем текущее сообщение и добавляем новое ключевое слово
                    currentMessage = keywordMessage
                }
            }
            // Добавляем оставшееся сообщение в массив
            messageParts.push(currentMessage)
        }

        // Логируем информацию о пользователе и выполнении функции
        LOG(username, 'Messages/Tonic/KeywordMessage')
        // Возвращаем массив частей сообщения
        return messageParts
    } catch (error) {
        // Логируем ошибку
        LOG(username, 'Messages/Tonic/KeywordMessage', error, ctx)
        return false
    }
}
//* END


//* START
const CreateMessage = async (ctx, json) => {
    // Получаем имя пользователя из контекста
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'
    
    try {
        // Логируем выполнение функции
        LOG(username, 'Messages/Tonic/CreateMessage')
        // Возвращаем сообщение об успешном создании ссылки
        return `✅ <b>Ссылка создана</b>.`
    } catch (error) {
        // Логируем ошибку
        LOG(username, 'Messages/Tonic/CreateMessage', error, ctx)
        return false
    }
}
//* END


module.exports = { 
    StatusMessage, 
    StatisticsMessage, 
    KeywordMessage, 
    CreateMessage, 
    CompanyMessage 
}