//? TELEGRAM.JS

const { Telegraf } = require('telegraf')
const Bot = new Telegraf(process.env.TELEGRAM_TOKEN)

module.exports = { Bot }