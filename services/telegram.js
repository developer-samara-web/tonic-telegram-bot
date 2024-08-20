//? CONFIG | TELEGRAM


//* START
const { Telegraf } = require('telegraf')
const Bot = new Telegraf(process.env.TELEGRAM_TOKEN)
//* END


module.exports = { Bot }