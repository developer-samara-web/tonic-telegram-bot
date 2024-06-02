//? STARTSCENE.JS

//Require
const { LOG } = require('@helpers/helpers')
const { Scenes: { BaseScene }, Markup } = require('telegraf')

//Start Scene
const SettingsScene = new BaseScene('settings');
SettingsScene.enter(async (ctx) => {
    const { username } = ctx.message.from
    
    try {
        await ctx.replyWithHTML('<b>🔹 USER PANEL 🔹</b> Выберите действие:', Markup.keyboard([
            ['🔹 Сейчас в работе', '🔹 Добавить таблицу'],
            ['🔸 Повысить уровень'],
            ['🔺 На главную'],
        ]).resize().oneTime());

        LOG(username, 'Scenes/User/Settings/SettingsScene')
    } catch (error) {
        LOG(username, 'Scenes/User/Settings/SettingsScene', error)
    }
});

module.exports = SettingsScene