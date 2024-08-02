//? SCENES | SETTINGS

//* Requires
const { LOG } = require('@helpers/base')
const { Scenes: { BaseScene }, Markup } = require('telegraf')
const { GetFirebaseUser } = require('@helpers/firebase')


//* START
const SettingsScene = new BaseScene('settings');
SettingsScene.enter(async (ctx) => {
    const { username, id } = ctx.message.from
    const { name, role, sheet, domain } = await GetFirebaseUser(ctx, id)

    try {
        await ctx.replyWithHTML(`<b>❇️  USER PANEL |</b> Информация пользователя:\n\n<b>▫️ [ ID ]: <i>${id}</i>\n▫️ [ Ник ]: <i>${name}</i>\n▫️ [ Роль ]: <i>${role}</i>\n▫️ [ Домен ]: <i>${domain ? domain : 'Не установлен'}</i>\n▫️ [ Таблица ]: <i>${sheet ? sheet : 'Не установлена'}</i></b>`, Markup.keyboard([
            ['🔹 Добавить таблицу', '🔹 Добавить домен'],
            ['🔹 Повысить уровень'],
            ['⬅️ На главную'],
        ]).resize().oneTime());

        LOG(username, 'Scenes/User/Settings/SettingsScene')
    } catch (error) {
        LOG(username, 'Scenes/User/Settings/SettingsScene', error, ctx)
    }
})
//* END


module.exports = SettingsScene