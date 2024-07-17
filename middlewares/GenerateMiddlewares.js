//? MIDDLEWARES | GENERATE

//* Requires
const { LOG } = require('@helpers/base')
const { SetTextStyle, DrawText, GenerateCanvas, SaveImage, loadImage } = require('@helpers/cards')


//* START - Card
const Card = async (ctx, { card, bank, date, name }) => {
    const { username } = ctx.message.from
    try {
        const width = 400
        const height = 250

        const canvas = GenerateCanvas(width, height)
        const generator = canvas.getContext('2d')

        const templateImage = await loadImage('./assets/cards/1.png')
        generator.drawImage(templateImage, 0, 0, width, height)

        SetTextStyle(generator, 'bold 32px CeraProBlack', 'white', 'right')
        DrawText(generator, bank, width - 15, 35)

        SetTextStyle(generator, '36px CeraProRegular', '#d6d6d6', 'left')
        DrawText(generator, card, 15, 150)

        SetTextStyle(generator, '16px CeraProRegular', '#d6d6d6', 'left')
        DrawText(generator, date, 15, 170)
        DrawText(generator, name, 15, height - 15)

        SaveImage(canvas, `./cache/cards/${ctx.message.message_id}.png`)

        LOG(username, 'Middlewares/User/GenerateMiddlewares')
        return await ctx.replyWithDocument({ source: `./cache/cards/${ctx.message.message_id}.png` })
    } catch (error) {
        LOG(username, 'Middlewares/User/GenerateMiddlewares', error)
    }
}
//* END - Card


module.exports = { Card }