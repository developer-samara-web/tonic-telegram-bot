//? MIDDLEWARES | MEDIA

//* Requires
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const { LOG } = require('@helpers/base')


//* START
const PhotoMiddleware = async (ctx) => {
  // Получаем имя пользователя из контекста
  const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'

  try {
    // Получаем ID самого большого изображения из массива photo
    const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id
    const file = await ctx.telegram.getFile(fileId) // Получаем информацию о файле
    const inputPath = file.file_path // Путь к файлу в Telegram
    const outputPath = path.join(process.cwd(), 'cache', `${path.basename(inputPath, path.extname(inputPath))}_${Math.random().toString(36).substring(7)}.jpg`) // Путь для сохранения обработанного изображения

    // URL для доступа к файлу
    const fileUrl = `https://api.telegram.org/file/bot${ctx.telegram.token}/${inputPath}`

    // Обработка изображения с помощью ffmpeg
    await new Promise((resolve, reject) => {
      ffmpeg(fileUrl)
        .output(outputPath) // Указываем выходной путь
        .outputOptions([
          '-vf', `noise=alls=${Math.floor(Math.random() * 7)}:allf=t` // Применяем эффект шумоподавления
        ])
        .on('end', () => resolve()) // Успешное завершение обработки
        .on('error', (err) => reject(err)) // Обработка ошибки
        .run()
    })

    // Отправляем сообщение с готовым фото
    await ctx.replyWithHTML(`✅ <b>Ваше фото готово:</b>`)
    await ctx.replyWithDocument({ source: outputPath }) // Отправляем обработанное изображение
    fs.unlinkSync(outputPath) // Удаляем временный файл

    // Логируем выполнение функции
    LOG(username, 'Middlewares/Media/PhotoMiddleware')
    return true
  } catch (error) {
    // Логируем ошибку
    LOG(username, 'Middlewares/Media/PhotoMiddleware', error, ctx)
    return false
  }
}
//* END


//* START
const VideoMiddleware = async (ctx) => {
  // Получаем имя пользователя из контекста
  const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'

  try {
    // Получаем ID видео из сообщения
    const fileId = ctx.message.video.file_id
    const file = await ctx.telegram.getFile(fileId) // Получаем информацию о файле
    const inputPath = file.file_path // Путь к файлу в Telegram
    const outputPath = path.join(process.cwd(), 'cache', `${path.basename(inputPath, path.extname(inputPath))}_${Math.random().toString(36).substring(7)}.mp4`) // Путь для сохранения обработанного видео

    // URL для доступа к файлу
    const fileUrl = `https://api.telegram.org/file/bot${ctx.telegram.token}/${inputPath}`

    // Обработка видео с помощью ffmpeg
    await new Promise((resolve, reject) => {
      ffmpeg(fileUrl)
        .output(outputPath) // Указываем выходной путь
        .outputOptions([
          '-vf', `noise=alls=${Math.floor(Math.random() * 7)}:allf=t` // Применяем эффект шумоподавления
        ])
        .on('end', () => resolve()) // Успешное завершение обработки
        .on('error', (err) => reject(err)) // Обработка ошибки
        .run()
    })

    // Отправляем сообщение с готовым видео
    await ctx.replyWithHTML(`✅ <b>Ваше видео готово:</b>`)
    await ctx.replyWithDocument({ source: outputPath }) // Отправляем обработанное видео
    fs.unlinkSync(outputPath) // Удаляем временный файл

    // Логируем выполнение функции
    LOG(username, 'Middlewares/Media/VideoMiddleware')
    return true
  } catch (error) {
    // Логируем ошибку
    LOG(username, 'Middlewares/Media/VideoMiddleware', error, ctx)
    return false
  }
}
//* END


module.exports = { PhotoMiddleware, VideoMiddleware }