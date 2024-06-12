//? MIDDLEWARES | TONIC

//* Requires
const { LOG, GroupByDate, CalculateStatistics, FilterKeyword, FilterStats } = require('@helpers/base')
const { Create, Keywords, GetKeywords, Callback, GetCallback, Pixel, Status, Statistics, List } = require('@helpers/tonic')
const { StatusMessage, StatisticsMessage, KeywordMessage, CreateMessage, CompanyMessage } = require('@messages/TonicMessages')
const { GetSheet } = require('@helpers/users')
const { LoadSheet } = require('@helpers/sheet')


//* START - CreateMiddleware / Создание компании
const CreateMiddleware = async (ctx, { name, offer, country, keywords, domain, pixel, token, target, event }, mode) => {
    const { username } = ctx.message.from
    try {
        const StageCreate = await Create(ctx, name, offer, country)
        const StageId = await SearchMiddleware(ctx, 'pending', name)
        const StageKeyword = keywords != '🚫 Пропустить' ? await Keywords(ctx, Number(StageId[0].id), keywords) : false
        const StageCallback = domain != '🚫 Пропустить' ? await Callback(ctx, Number(StageId[0].id), domain) : false
        const StagePixel = target != 'tiktok' || pixel != '🚫 Пропустить' || token != '🚫 Пропустить' || target != '🚫 Пропустить' || event != '🚫 Пропустить' ? await Pixel(ctx, Number(StageId[0].id), pixel, token, target, event) : false

        LOG(username, 'Middlewares/Tonic/CreateMiddleware');
        if(mode){
            return true
        } else {
            return await CreateMessage(ctx, name, StageCreate, StageId, StageKeyword, StageCallback, StagePixel)
        }
    } catch (error) {
        LOG(username, 'Middlewares/Tonic/CreateMiddleware', error)
    }
}
//* END - CreateMiddleware


//* START - StatusMiddleware / Получение статуса активности компании
const StatusMiddleware = async (ctx, name) => {
    const { username } = ctx.message.from
    try {
        const response = await Status(ctx, name)
        const item = await SearchMiddleware(ctx, response.status, name)
        const callback = await GetCallback(ctx, item[0].id)
        const keywords = await GetKeywords(ctx, item[0].id)

        LOG(username, 'Middlewares/Tonic/StatusMiddleware')
        return await StatusMessage(ctx, { status: response.status, ...item }, keywords, callback)
    } catch (error) {
        LOG(username, 'Middlewares/Tonic/StatusMiddleware', error)
    }
}
//* END - StatusMiddleware


//* StatisticsMiddleware / Получение общей статистики компаний
const StatisticsMiddleware = async (ctx, { date, source }) => {
    const { username } = ctx.message.from;
    try {
        const response = await Statistics(ctx, date);

        const sheet_id = await GetSheet(ctx)
        const sheet = await LoadSheet(ctx, sheet_id)

        const compains = sheet.map(row => {
             return row._rawData[2]
        })
        
        const filter = FilterStats(response, source, compains);

        LOG(username, 'Middlewares/Tonic/StatisticsMiddleware');
        return await StatisticsMessage(ctx, filter);
    } catch (error) {
        LOG(username, 'Middlewares/Tonic/StatisticsMiddleware', error);
    }
};
//* END - StatisticsMiddleware


//* StatsKeywordsMiddleware / Получение статистики ключей компании
const KeywordsMiddleware = async (ctx, { date, company_name }) => {
    const { username } = ctx.message.from;
    try {
        const response = await Statistics(ctx, date);
        const filter = FilterKeyword(response, company_name);

        LOG(username, 'Middlewares/Tonic/StatsKeywordsMiddleware');
        return await KeywordMessage(ctx, filter);
    } catch (error) {
        LOG(username, 'Middlewares/Tonic/StatsKeywordsMiddleware', error);
    }
};
//* END - KeywordsMiddleware


//* CompanyMiddleware / Получение статистики по компании
const CompanyMiddleware = async (ctx, { company_name, date }) => {
    const { username } = ctx.message.from;
    try {
        const response = await Statistics(ctx, date);
        const filter = response.filter(obj => obj.campaign_name === company_name);
        const grouped = GroupByDate(filter, company_name);
        const overall = CalculateStatistics(grouped, company_name);

        LOG(username, 'Middlewares/Tonic/CompanyMiddleware');
        return await CompanyMessage(ctx, {
            overall: overall,
            byDate: Object.values(grouped)
        })
    } catch (error) {
        LOG(username, 'Middlewares/Tonic/CompanyMiddleware', error);
    }
};

//* SearchMiddleware / Поиск компании по параметрам
const SearchMiddleware = async (ctx, status, name) => {
    const { username } = ctx.message.from
    try {
        const list = await List(ctx, status)

        LOG(username, 'Middlewares/Tonic/SearchMiddleware');
        return await list.filter(obj => obj.name === name)
    } catch (error) {
        LOG(username, 'Middlewares/Tonic/SearchMiddleware', error)
    }
}

//* SetPixelMiddleware / Установка пикселя для компании
const SetPixelMiddleware = async (ctx, { name, pixel, token, event, target }) => {
    const { username } = ctx.message.from
    try {
        const [{ id }] = await SearchMiddleware(ctx, null, name)

        LOG(username, 'Middlewares/Tonic/SetPixelMiddleware');
        return await Pixel(ctx, Number(id), pixel, token, target, event)
    } catch (error) {
        LOG(username, 'Middlewares/Tonic/SetPixelMiddleware', error)
    }
}

//* SetCallbackMiddleware / Установка Postback ссылок для компании
const SetCallbackMiddleware = async (ctx, { name, domain }) => {
    const { username } = ctx.message.from
    try {
        const [{ id }] = await SearchMiddleware(ctx, null, name)

        LOG(username, 'Middlewares/Tonic/SetCallbackMiddleware')
        return await Callback(ctx, Number(id), domain)
    } catch (error) {
        LOG(username, 'Middlewares/Tonic/SetCallbackMiddleware', error)
    }
}

//* SetKeywordsMiddleware / Установка ключей для компании
const SetKeywordsMiddleware = async (ctx, { name, keywords }) => {
    const { username } = ctx.message.from
    try {
        const [{ id }] = await SearchMiddleware(ctx, null, name)

        LOG(username, 'Middlewares/Tonic/SetKeywordsMiddleware')
        return await Keywords(ctx, Number(id), keywords)
    } catch (error) {
        LOG(username, 'Middlewares/Tonic/SetKeywordsMiddleware', error)
    }
}


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