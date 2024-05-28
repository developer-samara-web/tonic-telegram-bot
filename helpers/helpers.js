//? HELPERS.JS

// Requires
const fs = require('fs');
const archiver = require('archiver');
const path = require('path');

// Logger
const LOG = async (user, object, error) => {
    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const time = now.toTimeString().slice(0, 8);
    const logMessage = `[${date} ${time}] User: ${user}, Function: ${object}, ${error ? 'ERROR' : 'INFO'}: ${error ? error : 'OK'}\n`;

    const logDir = path.join(__dirname, '..', 'logs');

    try {
        await fs.promises.mkdir(logDir, { recursive: true });
        const filePath = path.join(logDir, `${date}.log`);
        await fs.promises.appendFile(filePath, logMessage);
    } catch (error) {
        console.error('Ошибка записи логов:', error);
    }
};

// Archive
const Archive = (ctx, logDirectory, outputFilePath) => {
    const { username } = ctx.message.from
    try {
        return new Promise((resolve, reject) => {
            const output = fs.createWriteStream(outputFilePath);
            const archive = archiver('zip', { zlib: { level: 9 } });

            output.on('close', () => {
                Logger('BOT', 'Helpers/Admin/CreateLogArchive', 'Archive created')
                resolve(outputFilePath);
            });

            archive.on('error', reject);

            archive.pipe(output);
            archive.glob('**/*', {
                cwd: logDirectory,
                ignore: [path.basename(outputFilePath)]
            });

            archive.finalize();
            
            LOG(username, 'Helpers/Archive')
        });
    } catch (error) {
        LOG(username, 'Helpers/Archive', error)
    }
};

module.exports = { LOG, Archive }