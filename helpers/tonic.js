//? HELPERS | TONIC

//* Requires
const crypto = require('crypto');
const OAuth = require('oauth-1.0a');
const { LOG, DateCurent } = require('@helpers/base')
const { GetToken, SetToken } = require('@helpers/firebase')


//* START
const Auth = async (account) => {
    // Возвращает объект OAuth для аутентификации с использованием заданного аккаунта (facebook или tiktok)
    return OAuth({
        consumer: {
            // Устанавливает ключ и секрет на основе типа аккаунта
            key: account === 'facebook' ? process.env.FB_KEY : process.env.TT_KEY,
            secret: account === 'facebook' ? process.env.FB_SECRET : process.env.TT_SECRET,
        },
        signature_method: 'HMAC-SHA1',
        hash_function(base_string, key) {
            // Создает подпись с использованием HMAC-SHA1
            return crypto
                .createHmac('sha1', key)
                .update(base_string)
                .digest('base64')
        }
    })
}
//* END


//* START
const Token = async (ctx, account) => {
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'

    try {
        // Получаем текущий токен из Firebase
        const token = await GetToken(ctx, account)
        const timestamp = Date.now() / 1000

        // Проверяем, истек ли токен
        if (timestamp > token.expires) {
            // Запрашиваем новый токен обновления
            const responseRT = await Request(ctx, 'POST', process.env.REQUEST, null, null, account)
            token.key = responseRT.oauth_token
            token.secret = responseRT.oauth_token_secret

            // Запрашиваем верификационный токен
            const responseVT = await Request(ctx, 'POST', process.env.VERIFY, token, null, account)
            token.verifier = responseVT.oauth_verifier

            // Запрашиваем новый access token используя верификационный токен
            const responseAT = await Request(ctx, 'POST', process.env.OAUTH_VERIFER + token.verifier, token, null, account)
            token.key = responseAT.oauth_token
            token.secret = responseAT.oauth_token_secret
            token.expires = responseAT.expires

            // Сохраняем новый токен в Firebase
            await SetToken(ctx, account, token)

            LOG(username, 'Helpers/Tonic/Token')
            return token
        } else {
            return token
        }
    } catch (error) {
        LOG(username, 'Helpers/Tonic/Token', error, ctx)
    }
}
//* END


//* START
const Request = async (ctx, method, url, token, body, account) => {
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'

    try {
        // Аутентификация для указанного аккаунта (facebook или tiktok)
        const Reg = await Auth(account)
        
        // Генерация заголовков авторизации
        let headers = await Reg.toHeader(Reg.authorize({
            url: url,
            method: method,
        }, token))

        // Устанавливаем задержку перед выполнением последовательных действий
        setTimeout(async () => {
            // Отправка запроса
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    ...headers
                },
                body: body ? JSON.stringify(body) : null
            })

            LOG(username, 'Helpers/Tonic/Request')
            return await response.json()
        }, Number(process.env.TONIC_REQUEST_TIMEOUT));
    } catch (error) {
        LOG(username, 'Helpers/Tonic/Request', error, ctx)
    }
}
//* END


//* START
const Create = async (ctx, name, offer, country, account) => {
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'

    try {
        // Получение токена для доступа к API
        const token = await Token(ctx, account)
        
        // Формирование URL для создания кампании
        const url = `${process.env.TONIC_API_URL}/campaign/create?name=${name}&offer=${offer}&country=${country}&imprint=no`

        LOG(username, 'Requests/Tonic/Create')
        
        // Выполнение POST-запроса для создания кампании
        return Request(ctx, 'POST', url, token, null, account)
    } catch (error) {
        LOG(username, 'Requests/Tonic/Create', error, ctx)
    }
}
//* END


//* START
const Status = async (ctx, name, account) => {
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'

    try {
        // Получение токена для доступа к API
        const token = await Token(ctx, account)
        
        // Формирование URL для получения статуса кампании
        const url = `${process.env.TONIC_API_URL}/campaign/status?name=${name}`

        LOG(username, 'Helpers/Tonic/Status')
        
        // Выполнение GET-запроса для получения статуса кампании
        return Request(ctx, 'GET', url, token, null, account)
    } catch (error) {
        LOG(username, 'Helpers/Tonic/Status', error, ctx)
    }
}
//* END


//* START
const Statistics = async (ctx, date) => {
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'

    try {
        // Получение токенов для Facebook и TikTok
        const tokenFacebook = await Token(ctx, 'facebook')
        const tokenTiktok = await Token(ctx, 'tiktok')

        // Формирование даты для запроса
        const initDate = await DateCurent(ctx, date)

        // Формирование URL для получения статистики
        const url = `${process.env.TONIC_API_URL}/reports/tracking?${initDate}&columns=date,campaign_name,clicks,revenueUsd,keyword,network&output=json`

        // Выполнение GET-запроса для получения статистики с Facebook и TikTok
        const responseFB = await Request(ctx, 'GET', url, tokenFacebook, null, 'facebook')
        const responseTT = await Request(ctx, 'GET', url, tokenTiktok, null, 'tiktok')

        LOG(username, 'Helpers/Tonic/Statistics');
        
        // Объединение и возврат результатов
        return [...responseFB, ...responseTT]
    } catch (error) {
        LOG(username, 'Helpers/Tonic/Statistics', error, ctx)
    }
}
//* END


//* START
const Keywords = async (ctx, id, keywords, account) => {
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'

    try {
        // Получение токена для указанного аккаунта
        const token = await Token(ctx, account)

        // Формирование URL для запроса ключевых слов
        const url = `${process.env.TONIC_API_URL}/campaign/keywords?campaign_id=${id}`

        LOG(username, 'Helpers/Tonic/Keywords')

        // Выполнение POST-запроса для добавления ключевых слов в кампанию
        return Request(ctx, 'POST', url, token, {
            campaign_id: id,
            keywords: keywords,
            country: "US", // Указание страны
            keyword_amount: keywords.length // Количество ключевых слов
        }, account)
    } catch (error) {
        LOG(username, 'Helpers/Tonic/Keywords', error, ctx)
    }
}
//* END


//* START
const GetKeywords = async (ctx, id, account) => {
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'

    try {
        // Получение токена для указанного аккаунта
        const token = await Token(ctx, account)
        
        // Формирование URL для запроса ключевых слов
        const url = `${process.env.TONIC_API_URL}/campaign/keywords?campaign_id=${id}`

        LOG(username, 'Helpers/Tonic/GetKeywords')

        // Выполнение GET-запроса для получения ключевых слов кампании
        return Request(ctx, 'GET', url, token, null, account)
    } catch (error) {
        LOG(username, 'Helpers/Tonic/GetKeywords', error, ctx)
    }
}
//* END


//* START
const Callback = async (ctx, id, domain, account) => {
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'

    try {
        // Получение токена для указанного аккаунта
        const token = await Token(ctx, account)
        const url = `${process.env.TONIC_API_URL}/campaign/callback`

        // Определение различных типов запросов для коллбеков
        const requests = [
            { type: "redirect", url: `https://${domain}/cf/cv?click_id={subid4}&txid={timestamp}&ct=impression` },
            { type: "viewrt", url: `https://${domain}/cf/cv?click_id={subid4}&txid={timestamp}&param1={keyword}&ct=search` },
            { type: "click", url: `https://${domain}/cf/cv?click_id={subid4}&txid={timestamp}&payout={revenue}&param1={keyword}&ct=click` }
        ];

        // Выполнение всех запросов параллельно
        const responses = await Promise.all(requests.map(async (request) => {
            return await Request(ctx, 'POST', url, token, { campaign_id: id, ...request }, account)
        }));

        LOG(username, 'Helpers/Tonic/Callback')
        
        // Проверка, были ли все ответы успешными
        return responses.every(response => response.responseCode === 200)
    } catch (error) {
        LOG(username, 'Helpers/Tonic/Callback', error, ctx)
    }
}
//* END

//* START
const GetCallback = async (ctx, id, account) => {
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'

    try {
        // Получение токена для указанного аккаунта
        const token = await Token(ctx, account)
        const url = `${process.env.TONIC_API_URL}/campaign/callback?campaign_id=${id}`

        LOG(username, 'Helpers/Tonic/GetCallback')
        
        // Выполнение GET запроса для получения информации о коллбеке
        return await Request(ctx, 'GET', url, token, null, account)
    } catch (error) {
        LOG(username, 'Helpers/Tonic/GetCallback', error, ctx)
    }
}
//* END


//* START
const Pixel = async (ctx, id, pixel, access_token, event, account) => {
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'

    try {
        // Получение токена для указанного аккаунта
        const token = await Token(ctx, account)
        const url = `${process.env.TONIC_API_URL}/campaign/pixel/${account}`

        // В зависимости от аккаунта, выполняем соответствующий запрос
        switch (account) {
            case 'facebook':
                return Request(ctx, 'POST', url, token, {
                    campaign_id: id,
                    event_name: event, // Событие для Facebook
                    pixel_id: pixel,
                    access_token: access_token
                }, account)
            case 'tiktok':
                return Request(ctx, 'POST', url, token, {
                    campaign_id: id,
                    pixel_id: pixel,
                    access_token: access_token // Для TikTok
                }, account)
        }

        LOG(username, 'Helpers/Tonic/Pixel')
        return true // Успешное выполнение функции
    } catch (error) {
        LOG(username, 'Helpers/Tonic/Pixel', error, ctx) // Логируем ошибку
        return false // Возвращаем false в случае ошибки
    }
}
//* END


//* START
const List = async (ctx, status, account) => {
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'

    try {
        // Получение токена для указанного аккаунта
        const token = await Token(ctx, account)
        
        // Формирование строки состояния для запроса
        const state = status ? `state=${status}&` : ''
        const url = `${process.env.TONIC_API_URL}/campaign/list?${state}output=json`

        LOG(username, 'Helpers/Tonic/List') // Логируем запрос
        // Выполнение GET-запроса к API для получения списка кампаний
        return await Request(ctx, 'GET', url, token, null, account)
    } catch (error) {
        LOG(username, 'Helpers/Tonic/List', error, ctx) // Логируем ошибку
    }
}
//* END


module.exports = { 
    Auth, 
    Token, 
    Request, 
    Create, 
    Status, 
    Statistics, 
    Keywords, 
    GetKeywords,
    Callback, 
    Pixel, 
    GetCallback,
    List
}