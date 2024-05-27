//index.js

require('dotenv').config();
require('module-alias/register');

// Requires
const { Bot } = require('@config/telegram')

// Launch
Bot.launch()