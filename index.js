//? INDEX

//* Global Requires
require('dotenv').config();
require('module-alias/register');

//* Requires
const { Bot } = require('@services/telegram')
const { Scenes, session } = require('telegraf')
const { Permissions } = require('@helpers/permissions')

//* Configs
const stages = require('@config/stages')
const hears = require('@config/hears')


//* Stages
const stage = new Scenes.Stage(stages)


//* Session & Middleware & Hears
Bot.use(session())
Bot.use(stage.middleware())
hears(Bot)


//* Actions
require('@config/actions')(Bot)


//* Welcome message
Bot.start(async (ctx) => {
    Permissions(ctx, 'start')
})


//* Launch
Bot.launch()