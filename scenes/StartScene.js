//? STARTSCENE.JS

//Require
const { LOG } = require('@helpers/helpers')
const { Scenes: { BaseScene } } = require('telegraf')

//Start Scene
const StartScene = new BaseScene('start');
StartScene.enter(async (ctx) => {
    const { username } = ctx.message.from
    try {
        await ctx.replyWithPhoto(
            { source: './assets/start.png' },
            {
                caption: `Приветствую, *${username}*.\nЭто панель управления *GSEARCHBOT*.\n\n🔹 *Выберите действие:*`,
                parse_mode: 'Markdown',
                reply_markup: {
                    keyboard: [
                        ['🔻 В разработке', '🔻 В разработке'],
                        ['🔻 В разработке', '🔻 В разработке'],
                        ['🔻 В разработке', '🔻 В разработке'],
                        ['🔻 В разработке', '🔻 В разработке']
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