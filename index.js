//? INDEX.JS

// Global
require('dotenv').config();
require('module-alias/register');

// Requires
const { Bot } = require('@config/telegram')
const { Scenes, session } = require('telegraf')
const { Permissions, PermissionsAction } = require('@helpers/permissions')

// Requires configs
const stages = require('@config/stages')
const hears = require('@config/hears')

// Stages
const stage = new Scenes.Stage(stages)

// Session & Middleware & Hears
Bot.use(session())
Bot.use(stage.middleware())
hears(Bot)

//Permission Actions
Bot.action(/(grant_access|deny_access)/, async (ctx) => {
    await PermissionsAction(ctx);
})

// Welcome message
Bot.start(async (ctx) => {
    Permissions(ctx, 'start')
})

// Launch
Bot.launch()