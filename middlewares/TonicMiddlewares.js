//? TONICMIDDLEWARES.JS

// Requires
const { LOG } = require('@helpers/helpers')

// AdminMessageMiddleware
const TonicStatusMiddleware = async (ctx, name) => {
    const { username } = ctx.message.from
    try {
        const response = await Status(ctx, name)

        LOG(username, 'Middlewares/Tonic/TonicStatusMiddleware')
        return true
    } catch (error) {
        LOG(username, 'Middlewares/Tonic/TonicStatusMiddleware', error)
    }
}

//https://api.publisher.tonic.com/privileged/v3/campaign/status?name=Lorem ipsum Campaign

module.exports = { TonicStatusMiddleware }