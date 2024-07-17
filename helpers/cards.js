//? HELPERS | CARDS

//* Requires
const { createCanvas, loadImage, registerFont } = require('canvas');
const fs = require('fs');

//* Fonts
registerFont('./assets/fonts/CeraPro-Black.ttf', { family: 'CeraProBlack' });
registerFont('./assets/fonts/CeraPro-Regular.ttf', { family: 'CeraProRegular' });
registerFont('./assets/fonts/CeraPro-Bold.ttf', { family: 'CeraProBold' });


//* START - SetTextStyle
const SetTextStyle = (generator, font, fillStyle, textAlign) => {
    generator.font = font
    generator.fillStyle = fillStyle
    generator.textAlign = textAlign
}
//* END - SetTextStyle


//* START - DrawText
const DrawText = (generator, text, x, y) => {
    generator.fillText(text, x, y)
}
//* END - DrawText


//* START - GenerateCanvas
const GenerateCanvas = (width, height) => {
    return createCanvas(width, height)
}
//* END - GenerateCanvas


//* START - SaveImage
const SaveImage = (canvas, path) => {
    const buffer = canvas.toBuffer('image/png')
    fs.writeFileSync(path, buffer)
}
//* END - SaveImage


module.exports = { 
    SetTextStyle,
    DrawText,
    GenerateCanvas,
    SaveImage,
    loadImage
}