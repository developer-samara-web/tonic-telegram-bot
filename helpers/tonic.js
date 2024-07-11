//? HELPERS | TONIC

//* Requires
const fs = require('fs')
const crypto = require('crypto');
const OAuth = require('oauth-1.0a');
const { LOG, DateCurent } = require('@helpers/base')


//* START - Auth | Авторизация в Tonic
const Auth = async (account) => {
    return OAuth({
        consumer: {
            key: account == 'facebook' ? process.env.FB_KEY : process.env.TT_KEY,
            secret: account == 'facebook' ? process.env.FB_SECRET : process.env.TT_SECRET,
        },
        signature_method: 'HMAC-SHA1',
        hash_function(base_string, key) {
            return crypto
                .createHmac('sha1', key)
                .update(base_string)
                .digest('base64');
        }
    });
}
//* END - Auth


//* START - Token | Запрос токена в Tonic
const Token = async (ctx, account) => {
    const { username } = ctx.message.from;
    try {
        const tokenData = require('@data/tonic.json');
        const token = tokenData[account];
        const timestamp = Date.now() / 1000;

        if (timestamp > token.expires) {
            const responseRT = await Request(ctx, 'POST', process.env.REQUEST, null, null, account);
            token.key = responseRT.oauth_token;
            token.secret = responseRT.oauth_token_secret;

            const responseVT = await Request(ctx, 'POST', process.env.VERIFY, token, null, account);
            token.verifier = responseVT.oauth_verifier;


            const responseAT = await Request(ctx, 'POST', process.env.OAUTH_VERIFER + token.verifier, token, null, account);
            token.key = responseAT.oauth_token;
            token.secret = responseAT.oauth_token_secret;
            token.expires = responseAT.expires;

            tokenData[account] = token;
            fs.writeFileSync('./data/tonic.json', JSON.stringify(tokenData, null, 4));

            LOG(username, 'Helpers/Tonic/Token');
            return token;
        } else {
            return token;
        }
    } catch (error) {
        LOG(username, 'Helpers/Tonic/Token', error);
    }
};
//* END - Token


//* START - Request | Базовый запрос для Tonic
const Request = async (ctx, method, url, token, body, account) => {
    const { username } = ctx.message.from
    try {
        const Reg = await Auth(account)

        let headers = await Reg.toHeader(Reg.authorize({
            url: url,
            method: method,
        }, token));

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
            body: body ? JSON.stringify(body) : null
        })

        LOG(username, 'Helpers/Tonic/Request')
        return await response.json();
    } catch (error) {
        LOG(username, 'Helpers/Tonic/Request', error)
    }
}
//* END - Request


//* START - Create | Запрос создания компании
const Create = async (ctx, name, offer, country, account) => {
    const { username } = ctx.message.from
    try {
        const token = await Token(ctx, account)
        const url = `${process.env.TONIC_API_URL}/campaign/create?name=${name}&offer=${offer}&country=${country}&imprint=no`;

        LOG(username, 'Requests/Tonic/Create')
        return Request(ctx, 'POST', url, token, null, account);
    } catch (error) {
        LOG(username, 'Requests/Tonic/Create', error)
    }
}
//* END - Create


//* START - Status | Запрос получения статуса компании
const Status = async (ctx, name, account) => {
    const { username } = ctx.message.from
    try {
        const token = await Token(ctx, account)
        const url = `${process.env.TONIC_API_URL}/campaign/status?name=${name}`;

        LOG(username, 'Helpers/Tonic/Status')
        return Request(ctx, 'GET', url, token, null, account);
    } catch (error) {
        LOG(username, 'Helpers/Tonic/Status', error)
    }
}
//* END - Status


//* START - Statistics | Запрос получения статистики компаний
const Statistics = async (ctx, date) => {
    const { username } = ctx.message.from
    try {
        const tokenFacebook = await Token(ctx, 'facebook')
        const tokenTiktok = await Token(ctx, 'tiktok')
        const initDate = await DateCurent(ctx, date);

        const url = `${process.env.TONIC_API_URL}/reports/tracking?${initDate}&columns=date,campaign_name,clicks,revenueUsd,keyword,network&output=json`;

        const responseFB =  await Request(ctx, 'GET', url, tokenFacebook)
        const responseTT =  await Request(ctx, 'GET', url, tokenTiktok)

        LOG(username, 'Helpers/Tonic/Statistics')
        return [...responseFB, ...responseTT];
    } catch (error) {
        LOG(username, 'Helpers/Tonic/Statistics', error)
    }
}
//* END - Statistics


//* START - Keywords | Запрос установки ключей компании
const Keywords = async (ctx, id, keywords, account) => {
    const { username } = ctx.message.from
    try {
        const token = await Token(ctx, account)
        const url = `${process.env.TONIC_API_URL}/campaign/keywords?campaign_id=${id}`;

        LOG(username, 'Helpers/Tonic/Keywords')
        return Request(ctx, 'POST', url, token, {
            campaign_id: id,
            keywords: keywords,
            country: "US",
            keyword_amount: keywords.length
        }, account);
    } catch (error) {
        LOG(username, 'Helpers/Tonic/Keywords', error)
    }
}
//* END - Keywords


//* START - GetKeywords | Запрос ключей компании
const GetKeywords = async (ctx, id, account) => {
    const { username } = ctx.message.from
    try {
        const token = await Token(ctx, account)
        const url = `${process.env.TONIC_API_URL}/campaign/keywords?campaign_id=${id}`;

        LOG(username, 'Helpers/Tonic/GetKeywords')
        return Request(ctx, 'GET', url, token);
    } catch (error) {
        LOG(username, 'Helpers/Tonic/GetKeywords', error)
    }
}
//* END - GetKeywords


//* START - Callback | Запрос установки POSTBACK параметров компании
const Callback = async (ctx, id, domain, account) => {
    const { username } = ctx.message.from
    try {
        const token = await Token(ctx, account)
        const url = `${process.env.TONIC_API_URL}/campaign/callback`;

        const requests = [
            { type: "view", url: `https://${domain}/cf/cv?click_id={subid4}&payout=0&ct=view` },
            { type: "click", url: `https://${domain}/cf/cv?click_id={subid4}&payout=0&param1={keyword}&ct=click` },
            { type: "preestimated_revenue", url: `https://${domain}/cf/cv?click_id={subid4}&payout={revenue}&param1={keyword}&ct=preestimated_revenue` },
            { type: "estimated_revenue", url: `https://${domain}/cf/cv?click_id={subid4}&payout={revenue}&param1={keyword}&ct=estimated_revenue` },
            { type: "estimated_revenue_5h", url: `https://${domain}/cf/cv?click_id={subid4}&payout={revenue}&param1={keyword}&ct=estimated_revenue_5h` },
        ];

        const responses = await Promise.all(requests.map(async (request) => {
            return await Request(ctx, 'POST', url, token, { campaign_id: id, ...request }, account);
        }));

        LOG(username, 'Helpers/Tonic/Callback')
        return responses.every(response => response.responseCode === 200);
    } catch (error) {
        LOG(username, 'Helpers/Tonic/Callback', error)
    }
}
//* END - Callback

//* START - GetCallback | Запрос POSTBACK параметров компании
const GetCallback = async (ctx, id, account) => {
    const { username } = ctx.message.from
    try {
        const token = await Token(ctx, account)
        const url = `${process.env.TONIC_API_URL}/campaign/callback?campaign_id=${id}`;

        LOG(username, 'Helpers/Tonic/GetCallback')
        return await Request(ctx, 'GET', url, token);
    } catch (error) {
        LOG(username, 'Helpers/Tonic/GetCallback', error)
    }
}
//* END - GetCallback


//* START - Pixel | Запрос установки пикселя компании
const Pixel = async (ctx, id, pixel, access_token, event, account) => {
    const { username } = ctx.message.from
    try {
        const token = await Token(ctx, account)
        const url = `${process.env.TONIC_API_URL}/campaign/pixel/${account}`;

        switch (account) {
            case 'facebook':
                return Request(ctx, 'POST', url, token, {
                    campaign_id: id,
                    event_name: event,
                    pixel_id: pixel,
                    access_token: access_token
                }, account);
            case 'tiktok':
                return Request(ctx, 'POST', url, token, {
                    campaign_id: id,
                    pixel_id: pixel,
                    access_token: access_token
                }, account);
        }

        LOG(username, 'Helpers/Tonic/Pixel')
        return true
    } catch (error) {
        LOG(username, 'Helpers/Tonic/Pixel', error)
        return false
    }
}
//* END - Pixel


//* START - List | Запрос получения списка всех компаний
const List = async (ctx, status, account) => {
    const { username } = ctx.message.from
    try {
        const token = await Token(ctx, account)
        const state = status ? `state=${status}&` : ''
        const url = `${process.env.TONIC_API_URL}/campaign/list?${state}output=json`;

        LOG(username, 'Helpers/Tonic/List')
        return Request(ctx, 'GET', url, token, null, account);
    } catch (error) {
        LOG(username, 'Helpers/Tonic/List', error)
    }
}
//* END - List


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