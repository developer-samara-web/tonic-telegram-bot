//? SCENES | START

//* Requires
const { LOG } = require('@helpers/base')
const { HasAdminAccess } = require('@helpers/firebase')
const { Scenes: { BaseScene } } = require('telegraf')


//* START
const StartScene = new BaseScene('start');
StartScene.enter(async (ctx) => {
    const { username, id } = ctx.message.from
    const admin = await HasAdminAccess(ctx, id)
    
    try {
        await ctx.replyWithPhoto(
            { source: './assets/start.png' },
            {
                caption: `Приветствую, *${username}*.\nЭто панель управления *GSEARCHBOT*.\n\n❇️ *Обновление 2.0:* [Инструкция](https://telegra.ph/Sozdanie-kompanij-08-02)\n\n*Администратор:* ${process.env.ADMIN_NAME}`,
                parse_mode: 'Markdown',
                reply_markup: {
                    keyboard: [
                        ['🔹 Tonic'],
                        ['📝 Генераторы', '🖼 Уникализаторы'],
                        [ admin ? '⚙️ Панель управления' : '⚙️ Настройки']
                    ],
                    resize_keyboard: true,
                    one_time_keyboard: true
                }
            }
        )

        LOG(username, 'Scenes/StartScene')
    } catch (error) {
        LOG(username, 'Scenes/StartScene', error, ctx)
    }
});
//* END


module.exports = StartScene