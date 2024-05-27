//? HELPERS.JS

//Requires
const fs = require('fs');
const path = require('path');

// Logger Helper
const LOG = async (user, object, error) => {
    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const time = now.toTimeString().slice(0, 8);
    const logMessage = `[${date} ${time}] User: ${user}, Function: ${object}, INFO: ${error ? error : 'OK'}\n`;

    const logDir = path.join(__dirname, '..', 'logs');

    try {
        await fs.promises.mkdir(logDir, { recursive: true });
        const filePath = path.join(logDir, `${date}.log`);
        await fs.promises.appendFile(filePath, logMessage);
    } catch (error) {
        console.error('Ошибка записи логов:', error);
    }
};

module.exports = { LOG }