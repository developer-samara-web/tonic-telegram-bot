//? CONFIG | GOOGLE-SHEET

//* Requires
const { JWT } = require('google-auth-library')
const { LOG } = require('@helpers/base')


//* START
const AuthSheet = async (ctx) => {
    const { username = 'BOT' } = ctx.message?.from || ctx.callbackQuery?.from

    try {
        LOG(username, 'Config/AuthSheet')
        return serviceAccountAuth = new JWT({
            email: process.env.SHEET_EMAIL,
            key: process.env.SHEET_KEY,
            scopes: [
                process.env.SHEET_SCOPES_1,
                process.env.SHEET_SCOPES_2
            ],
        });
    } catch (error) {
        LOG(username, 'Config/AuthSheet', error, ctx)
    }
}
//* END


module.exports = { AuthSheet }