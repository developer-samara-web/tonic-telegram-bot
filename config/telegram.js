//? CONFIG | TELEGRAM


//* START - TelegramInit
const { Telegraf } = require('telegraf')
const Bot = new Telegraf(process.env.TELEGRAM_TOKEN)
//* END- TelegramInit


module.exports = { Bot }