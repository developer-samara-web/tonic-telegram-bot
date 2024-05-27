//? STARTSCENE.JS

//Require
const { LOG } = require('@helpers/helpers')
const { HasAdminAccess } = require('@helpers/users')
const { Scenes: { BaseScene } } = require('telegraf')

//Start Scene
const StartScene = new BaseScene('start');
StartScene.enter(async (ctx) => {
    const { username, id } = ctx.message.from
    const admin = await HasAdminAccess(ctx, id)
    
    try {
        await ctx.replyWithPhoto(
            { source: './assets/start.png' },
            {
                caption: `Приветствую, *${username}*.\nЭто панель управления *GSEARCHBOT*.\n\n*Администратор:* ${process.env.ADMIN_NAME}\n\n🔹 *Выберите действие:*`,
                parse_mode: 'Markdown',
                reply_markup: {
                    keyboard: [
                        ['🔻 В разработке', '🔻 В разработке'],
                        ['🔻 В разработке', '🔻 В разработке'],
                        ['🔻 В разработке', '🔻 В разработке'],
                        [ admin ? '⚙️ Панель управления' : '⚙️ Настройки']
                    ]
                }
            }
        )

        LOG(username, 'Scenes/StartScene')
    } catch (error) {
        LOG(username, 'Scenes/StartScene', error)
    }
});

module.exports = StartScene