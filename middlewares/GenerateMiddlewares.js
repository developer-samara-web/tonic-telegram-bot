//? MIDDLEWARES | GENERATE

//* Requires
const { LOG } = require('@helpers/base')
const { SetTextStyle, DrawText, GenerateCanvas, SaveImage, loadImage } = require('@helpers/cards')


//* START
const Card = async (ctx, { card, bank, date, name }) => {
    // Получаем имя пользователя из контекста
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'
    try {
        const width = 400 // Ширина изображения
        const height = 250 // Высота изображения

        // Генерируем новый холст
        const canvas = GenerateCanvas(width, height)
        const generator = canvas.getContext('2d') // Получаем контекст рисования

        // Загружаем шаблон изображения
        const templateImage = await loadImage('./assets/cards/1.png')
        generator.drawImage(templateImage, 0, 0, width, height) // Рисуем шаблон на холсте

        // Устанавливаем стиль текста и рисуем название банка
        SetTextStyle(generator, 'bold 32px CeraProBlack', 'white', 'right')
        DrawText(generator, bank, width - 15, 35)

        // Устанавливаем стиль текста и рисуем номер карты
        SetTextStyle(generator, '36px CeraProRegular', '#d6d6d6', 'left')
        DrawText(generator, card, 15, 150)

        // Устанавливаем стиль текста и рисуем дату и имя
        SetTextStyle(generator, '16px CeraProRegular', '#d6d6d6', 'left')
        DrawText(generator, date, 15, 170)
        DrawText(generator, name, 15, height - 15)

        // Сохраняем изображение на диск
        SaveImage(canvas, `./cache/cards/${ctx.message.message_id}.png`)

        // Логируем выполнение функции
        LOG(username, 'Middlewares/Generate/GenerateMiddlewares')
        // Отправляем сгенерированное изображение пользователю
        return await ctx.replyWithDocument({ source: `./cache/cards/${ctx.message.message_id}.png` })
    } catch (error) {
        // Логируем ошибку
        LOG(username, 'Middlewares/Generate/GenerateMiddlewares', error, ctx)
    }
}
//* END


module.exports = { Card }