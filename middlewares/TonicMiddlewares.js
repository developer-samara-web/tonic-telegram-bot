//? MIDDLEWARES | TONIC

//* Requires
const { LOG, GroupByDate, CalculateStatistics, FilterKeyword, FilterStats } = require('@helpers/base')
const { Create, Keywords, GetKeywords, Callback, GetCallback, Pixel, Status, Statistics, List } = require('@services/tonic')
const { StatusMessage, StatisticsMessage, KeywordMessage, CreateMessage, CompanyMessage } = require('@messages/TonicMessages')
const { GetUserSheet } = require('@services/firebase')
const { LoadSheet, SearchSheet } = require('@services/sheet')


//* START
const CreateMiddleware = async (ctx, { name, offer, country, keywords, domain, pixel, token, target, event }, mode) => {
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'
    try {
        // Создаем новый объект (StageCreate)
        const StageCreate = await Create(ctx, encodeURIComponent(name), encodeURIComponent(offer), country, target)
        // Ищем ID объекта с указанным статусом и именем (StageId)
        const StageId = await SearchMiddleware(ctx, 'pending', name, target)
        // Добавляем ключевые слова, если они указаны (StageKeyword)
        const StageKeyword = keywords ? await Keywords(ctx, Number(StageId[0].id), keywords, target) : false
        // Настраиваем callback, если указан домен (StageCallback)
        const StageCallback = domain ? await Callback(ctx, Number(StageId[0].id), domain, target) : false
        // Настраиваем пиксель, если целевая платформа не Facebook (StagePixel)
        const StagePixel = target != 'facebook' ? await Pixel(ctx, Number(StageId[0].id), pixel, token, event, target) : false

        // Логируем успешное выполнение функции
        LOG(username, 'Middlewares/Tonic/CreateMiddleware')

        // Если режим mode активен, возвращаем true
        if (mode) {
            return true
        } else {
            // В противном случае отправляем сообщение о создании
            return await CreateMessage(ctx, name, StageCreate, StageId, StageKeyword, StageCallback, StagePixel)
        }
    } catch (error) {
        // Логируем ошибку, если что-то пошло не так
        LOG(username, 'Middlewares/Tonic/CreateMiddleware', error, ctx)
    }
}
//* END


//* START
const StatusMiddleware = async (ctx, name) => {
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'
    try {
        // Получаем идентификатор таблицы пользователя
        const sheet_id = await GetUserSheet(ctx)
        // Ищем строку в таблице по указанному имени
        const sheet_str = await SearchSheet(ctx, sheet_id, name)

        if(sheet_str){
            // Получаем аккаунт из строки таблицы
            const account = sheet_str._rawData[1]
            // Запрашиваем статус
            const response = await Status(ctx, name, account)
            // Ищем объект в базе данных по статусу, имени и аккаунту
            const item = await SearchMiddleware(ctx, response.status, name, account)
            // Получаем callback для найденного объекта
            const callback = await GetCallback(ctx, item[0].id, account)
            // Получаем ключевые слова для найденного объекта
            const keywords = await GetKeywords(ctx, item[0].id, account)

            // Логируем успешное выполнение функции
            LOG(username, 'Middlewares/Tonic/StatusMiddleware')
            // Возвращаем сообщение со статусом
            return await StatusMessage(ctx, { status: response.status, ...item }, keywords, callback)
        } else {
            return false
        }
    } catch (error) {
        // Логируем ошибку, если что-то пошло не так
        LOG(username, 'Middlewares/Tonic/StatusMiddleware', error, ctx)
    }
}
//* END


//* START
const StatisticsMiddleware = async (ctx, { date, source }) => {
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'
    try {
        // Запрашиваем статистику за указанный период
        const response = await Statistics(ctx, date)

        // Получаем идентификатор таблицы пользователя
        const sheet_id = await GetUserSheet(ctx)
        // Загружаем таблицу пользователя
        const sheet = await LoadSheet(ctx, sheet_id)

        // Формируем список кампаний из таблицы
        const compains = sheet.map(row => row._rawData[2])

        // Фильтруем статистику по источнику и кампаниям
        const filter = FilterStats(response, source, compains)

        // Логируем успешное выполнение функции
        LOG(username, 'Middlewares/Tonic/StatisticsMiddleware')
        // Возвращаем сообщение со статистикой
        return await StatisticsMessage(ctx, filter)
    } catch (error) {
        // Логируем ошибку, если что-то пошло не так
        LOG(username, 'Middlewares/Tonic/StatisticsMiddleware', error, ctx)
    }
}
//* END


//* START
const KeywordsMiddleware = async (ctx, { date, company_name }) => {
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'
    try {
        // Запрашиваем статистику за указанный период
        const response = await Statistics(ctx, date)
        // Фильтруем статистику по названию компании
        const filter = FilterKeyword(response, company_name)

        // Логируем успешное выполнение функции
        LOG(username, 'Middlewares/Tonic/StatsKeywordsMiddleware')
        // Возвращаем сообщение с отфильтрованной статистикой по ключевым словам
        if(filter.length) {
            return await KeywordMessage(ctx, filter)
        } else {
            return false
        }
    } catch (error) {
        // Логируем ошибку, если что-то пошло не так
        LOG(username, 'Middlewares/Tonic/StatsKeywordsMiddleware', error, ctx)
    }
}
//* END


//* START
const CompanyMiddleware = async (ctx, { company_name, date }) => {
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'
    try {
        // Запрашиваем статистику за указанный период
        const response = await Statistics(ctx, date)
        // Фильтруем статистику по названию компании
        const filter = response.filter(obj => obj.campaign_name === company_name)
        // Группируем статистику по датам
        const grouped = GroupByDate(filter, company_name)
        // Рассчитываем общую статистику
        const overall = CalculateStatistics(grouped, company_name)

        // Логируем успешное выполнение функции
        LOG(username, 'Middlewares/Tonic/CompanyMiddleware')
        // Возвращаем сообщение с общей статистикой и статистикой по датам
        return await CompanyMessage(ctx, {
            overall: overall,
            byDate: Object.values(grouped)
        })
    } catch (error) {
        // Логируем ошибку, если что-то пошло не так
        LOG(username, 'Middlewares/Tonic/CompanyMiddleware', error, ctx)
    }
}
//* END


//* START
const SearchMiddleware = async (ctx, status, name, account) => {
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'
    try {
        // Получаем список объектов с указанным статусом и аккаунтом
        const list = await List(ctx, status, account)

        // Логируем успешное выполнение функции
        LOG(username, 'Middlewares/Tonic/SearchMiddleware')
        // Фильтруем список по имени и возвращаем результат
        return list.filter(obj => obj.name === name)
    } catch (error) {
        // Логируем ошибку, если что-то пошло не так
        LOG(username, 'Middlewares/Tonic/SearchMiddleware', error, ctx)
    }
}
//* END


//* START
const SetPixelMiddleware = async (ctx, { name, pixel, token, event }) => {
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'
    try {
        // Получаем идентификатор таблицы
        const sheet_id = await GetUserSheet(ctx)
        // Ищем строку в таблице по имени
        const sheet_str = await SearchSheet(ctx, sheet_id, name)
        // Получаем аккаунт из найденной строки
        const account = sheet_str._rawData[1]
        // Ищем объект по имени и аккаунту
        const [{ id }] = await SearchMiddleware(ctx, null, name, account)

        // Логируем успешное выполнение функции
        LOG(username, 'Middlewares/Tonic/SetPixelMiddleware')
        // Устанавливаем пиксель и возвращаем результат
        return await Pixel(ctx, Number(id), pixel, token, event, account)
    } catch (error) {
        // Логируем ошибку, если что-то пошло не так
        LOG(username, 'Middlewares/Tonic/SetPixelMiddleware', error, ctx)
    }
}
//* END


//* START
const SetCallbackMiddleware = async (ctx, { name, domain }) => {
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'
    try {
        // Получаем идентификатор таблицы
        const sheet_id = await GetUserSheet(ctx)
        // Ищем строку в таблице по имени
        const sheet_str = await SearchSheet(ctx, sheet_id, name)
        // Получаем аккаунт из найденной строки
        const account = sheet_str._rawData[1]
        // Ищем объект по имени и аккаунту
        const [{ id }] = await SearchMiddleware(ctx, null, name, account)

        // Логируем успешное выполнение функции
        LOG(username, 'Middlewares/Tonic/SetCallbackMiddleware')
        // Устанавливаем колбэк и возвращаем результат
        return await Callback(ctx, Number(id), domain, account)
    } catch (error) {
        // Логируем ошибку, если что-то пошло не так
        LOG(username, 'Middlewares/Tonic/SetCallbackMiddleware', error, ctx)
    }
}
//* END


//* START
const SetKeywordsMiddleware = async (ctx, { name, keywords }) => {
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'
    try {
        // Получаем идентификатор таблицы
        const sheet_id = await GetUserSheet(ctx)
        // Ищем строку в таблице по имени
        const sheet_str = await SearchSheet(ctx, sheet_id, name)
        // Получаем аккаунт из найденной строки
        const account = sheet_str._rawData[1]
        // Ищем объект по имени и аккаунту
        const [{ id }] = await SearchMiddleware(ctx, null, name, account)

        // Логируем успешное выполнение функции
        LOG(username, 'Middlewares/Tonic/SetKeywordsMiddleware')

        // Устанавливаем ключевые слова и возвращаем результат
        const result = await Keywords(ctx, Number(id), keywords ? keywords : null, account)

        // Если результат содержит ошибки, выбрасываем исключение с их содержимым
        if (Array.isArray(result) && result.length > 0 && typeof result[0] === 'string') {
            throw new Error(result[0]) // Ловим первую ошибку
        }

        return result
    } catch (error) {
        // Логируем ошибку и явно возвращаем null или передаем ошибку
        LOG(username, 'Middlewares/Tonic/SetKeywordsMiddleware', error.message, ctx)
        return { error: error.message } // Возвращаем ошибку как объект
    }
}
//* END


module.exports = {
    StatusMiddleware,
    StatisticsMiddleware,
    KeywordsMiddleware,
    CompanyMiddleware,
    CreateMiddleware,
    SetPixelMiddleware,
    SetCallbackMiddleware,
    SetKeywordsMiddleware
}