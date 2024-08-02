//? HELPERS | CARDS

//* Requires
const fs = require('fs')
const { createCanvas, loadImage, registerFont } = require('canvas')

//* Fonts
registerFont('./assets/fonts/CeraPro-Black.ttf', { family: 'CeraProBlack' })
registerFont('./assets/fonts/CeraPro-Regular.ttf', { family: 'CeraProRegular' })
registerFont('./assets/fonts/CeraPro-Bold.ttf', { family: 'CeraProBold' })


//* START
const SetTextStyle = (generator, font, fillStyle, textAlign) => {
    // Устанавливаем стиль текста для графического генератора
    generator.font = font // Устанавливаем шрифт текста
    generator.fillStyle = fillStyle // Устанавливаем цвет заливки текста
    generator.textAlign = textAlign // Устанавливаем выравнивание текста
}
//* END


//* START
const DrawText = (generator, text, x, y) => {
    // Рисуем текст на графическом генераторе
    generator.fillText(text, x, y) // Отображаем текст на позиции (x, y)
}
//* END


//* START
const GenerateCanvas = (width, height) => {
    // Создаем холст с заданной шириной и высотой
    return createCanvas(width, height) // Возвращаем созданный холст
}
//* END


//* START
const SaveImage = (canvas, path) => {
    // Получаем буфер изображения в формате PNG
    const buffer = canvas.toBuffer('image/png')
    // Сохраняем буфер в файл по указанному пути
    fs.writeFileSync(path, buffer)
}
//* END


module.exports = { 
    SetTextStyle,
    DrawText,
    GenerateCanvas,
    SaveImage,
    loadImage
}