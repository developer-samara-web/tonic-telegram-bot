//? SCENES | TONIC

//* Requires
const { LOG } = require('@helpers/base')
const { HasAdminAccess } = require('@helpers/users')
const { Scenes: { BaseScene }, Markup } = require('telegraf')


//* START - TonicScene
const TonicScene = new BaseScene('tonic');
TonicScene.enter(async (ctx) => {
    const { username, id } = ctx.message.from
    try {
        const admin = await HasAdminAccess(ctx, id)

        await ctx.replyWithHTML('<b>❇️  TONIC PANEL |</b> Выберите действие:', Markup.keyboard([
            admin ? ['🔹 Создать', '🔹 Редактировать'] : ['🔹 Запросить ссылки', '🔹 Проверить статус'],
            admin ? ['🔹 Компании в работе'] : ['🔹 Редактировать', '🔹 Статистика'],
            ['🔺 На главную'],
        ]).resize().oneTime());

        LOG(username, 'Scenes/User/Tonic/TonicScene')
    } catch (error) {
        LOG(username, 'Scenes/User/Tonic/TonicScene', error)
    }
});
//* END - TonicScene


module.exports = TonicScene