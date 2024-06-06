//? SCENES | SETTINGS

//* Requires
const { LOG } = require('@helpers/base')
const { Scenes: { BaseScene }, Markup } = require('telegraf')


//* START - SettingsScene
const SettingsScene = new BaseScene('settings');
SettingsScene.enter(async (ctx) => {
    const { username } = ctx.message.from
    
    try {
        await ctx.replyWithHTML('<b>🔹 USER PANEL 🔹</b> Выберите действие:', Markup.keyboard([
            ['🔹 Добавить таблицу'],
            ['🔹 Добавить оффер'],
            ['🔹 Повысить уровень'],
            ['🔺 На главную'],
        ]).resize().oneTime());

        LOG(username, 'Scenes/User/Settings/SettingsScene')
    } catch (error) {
        LOG(username, 'Scenes/User/Settings/SettingsScene', error)
    }
})
//* END - SettingsScene


module.exports = SettingsScene