//? MIDDLEWARES | MEDIA

//* Requires
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const { LOG } = require('@helpers/base')


//* START - PhotoMiddleware
const PhotoMiddleware = async (ctx) => {
  const { username } = ctx.message.from

  try {
    const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
    const file = await ctx.telegram.getFile(fileId);
    const inputPath = file.file_path;
    const outputPath = path.join(process.cwd(), 'cache', `${path.basename(inputPath, path.extname(inputPath))}_${Math.random().toString(36).substring(7)}.jpg`);

    const fileUrl = `https://api.telegram.org/file/bot${ctx.telegram.token}/${inputPath}`;

    await new Promise((resolve, reject) => {
      ffmpeg(fileUrl)
        .output(outputPath)
        .outputOptions([
          '-vf', `noise=alls=${Math.floor(Math.random() * 7)}:allf=t`
        ])
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .run();
    });

    await ctx.replyWithHTML(`✅ <b>Ваше фото готово:</b>`)
    await ctx.replyWithDocument({ source: outputPath });
    fs.unlinkSync(outputPath)

    LOG(username, 'Middlewares/Media/PhotoMiddleware')
    return true
  } catch (error) {
    LOG(username, 'Middlewares/Media/PhotoMiddleware', error);
    return false
  }
}
//* END - PhotoMiddleware


//* START - VideoMiddleware
const VideoMiddleware = async (ctx) => {
  const { username } = ctx.message.from

  try {
    const fileId = ctx.message.video.file_id;
    const file = await ctx.telegram.getFile(fileId);
    const inputPath = file.file_path;
    const outputPath = path.join(process.cwd(), 'cache', `${path.basename(inputPath, path.extname(inputPath))}_${Math.random().toString(36).substring(7)}.mp4`);

    const fileUrl = `https://api.telegram.org/file/bot${ctx.telegram.token}/${inputPath}`;

    await new Promise((resolve, reject) => {
      ffmpeg(fileUrl)
        .output(outputPath)
        .outputOptions([
          '-vf', `noise=alls=${Math.floor(Math.random() * 7)}:allf=t`
        ])
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .run();
    });

    await ctx.replyWithHTML(`✅ <b>Ваше видео готово:</b>`)
    await ctx.replyWithDocument({ source: outputPath })
    fs.unlinkSync(outputPath)

    LOG(username, 'Middlewares/Media/VideoMiddleware')
    return true
  } catch (error) {
    LOG(username, 'Middlewares/Media/VideoMiddleware', error)
    return false
  }
}
//* END - VideoMiddleware


module.exports = { PhotoMiddleware, VideoMiddleware }