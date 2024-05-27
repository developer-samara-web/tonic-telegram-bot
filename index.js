//? INDEX.JS

// Global
require('dotenv').config();
require('module-alias/register');

// Requires
const { Bot } = require('@config/telegram')
const { Scenes, session } = require('telegraf')

// Require
const stages = require('@config/stages')
const hears = require('@config/hears')

// Stages
const stage = new Scenes.Stage(stages)

// Session & Middleware & Hears
Bot.use(session())
Bot.use(stage.middleware())
hears(Bot)

// Launch
Bot.launch()