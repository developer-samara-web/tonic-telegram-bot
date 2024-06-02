//? TONIC.JS

// Requires
const fs = require('fs')
const crypto = require('crypto');
const OAuth = require('oauth-1.0a');
const { LOG } = require('@helpers/helpers')

// Auth
const Auth = OAuth({
    consumer: {
        key: process.env.KEY,
        secret: process.env.SECRET,
    },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
        return crypto
            .createHmac('sha1', key)
            .update(base_string)
            .digest('base64')
    }
})

// Token
const Token = async (ctx) => {
    const { username } = ctx.message.from
    const token = require('@data/tonic')
    const timestamp = Date.now() / 1000
    try {
        if(timestamp > token.expires){
            const responseRT = await Request(ctx, 'POST', process.env.REQUEST, null, null);
            token.key = responseRT.oauth_token;
            token.secret = responseRT.oauth_token_secret;

            const responseVT = await Request(ctx, 'POST', process.env.VERIFY, token, null);
            token.verifier = responseVT.oauth_verifier;

            const responseAT = await Request(ctx, 'POST', process.env.OAUTH_VERIFER + token.verifier, token, null);
            token.key = responseAT.oauth_token;
            token.secret = responseAT.oauth_token_secret;
            token.expires = responseAT.expires;

            fs.writeFileSync('./data/tonic.json', JSON.stringify(token, null, 4))

            LOG(username, 'Helpers/Tonic/Token');
            return token
        } else {
            return token
        }
    } catch (error) {
        LOG(username, 'Helpers/Tonic/Token', error);
    }
}

// Request
const Request = async (ctx, method, url, token, body) => {
    const { username } = ctx.message.from
    let headers = await Auth.toHeader(Auth.authorize({
        url: url,
        method: method,
    }, token));
    try {
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

// Status Request
const Status = async (ctx, name) => {
    const { username } = ctx.message.from
    console.log(username)
    try {
        const token = await Token(ctx)
        const url = `${process.env.TONIC_API_URL}/campaign/status?name=${name}`;

        LOG(username, 'Helpers/Tonic/Status')
        return Request(ctx, 'GET', url, token);
    } catch (error) {
        LOG(username, 'Helpers/Tonic/Status', error)
    }
}

module.exports = { Auth, Token, Request, Status }