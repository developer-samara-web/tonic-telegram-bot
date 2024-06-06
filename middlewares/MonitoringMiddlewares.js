//? MIDDLEWARES | MONITORING

//* Requires
const fs = require('fs');
const { LOG } = require('@helpers/base')
const { Status } = require('@helpers/tonic')
const { SaveSheet } = require('@helpers/sheet')
const { Bot } = require('@config/telegram')


//* START - MonitoringMiddleware / Мониторинг и создание компаний
const MonitoringMiddleware = async (ctx) => {
    const { username } = ctx.message.from

    const LoadMonitoring = async (filePath) => {
        const fileContents = await fs.promises.readFile(filePath, 'utf8');
        return JSON.parse(fileContents);
    }
    
    const UpdateMonitoring = async (filePath, data) => {
        await fs.promises.writeFile(filePath, JSON.stringify(data, null, 4));
    }
    
    const CheckLink = async (ctx, link, list) => {
        const item = await Status(ctx, link.name);
        
        if (item.status === 'active') {
            await SaveSheet(ctx, link.sheet_id, link.name, { type: 'href', data: `https://${item['0'].link}` });
            list.data = list.data.filter(item => item.name !== link.name);
            await UpdateMonitoring('./data/monitoring.json', list);

            await Bot.telegram.sendMessage(process.env.TELEGRAM_ADMIN_ID, `✅ <b>Заявка: №${message_id} | ${item.name} обновлена</b>`, {
                parse_mode: 'HTML'
            })
        }
    }

    try {
        const Monitoring = async () => {
            let list = await LoadMonitoring('./data/monitoring.json');
        
            if (!list.status) {
                console.log("Функция остановлена.");
                return;
            }
        
            if (list.data.length) {
                await Promise.all(list.data.map(link => CheckLink(ctx, link, list)));
            }
        
            setTimeout(Monitoring, process.env.MONITORING_TIMEOUT);
        }
        
        Monitoring();

        LOG(username, 'Messages/Monitoring/MonitoringMiddleware')
    } catch (error) {
        LOG(username, 'Messages/Monitoring/MonitoringMiddleware', error)
    }
}
//* END - MonitoringMiddleware


//* START - MonitoringAddMiddleware / Переключатель работы мониторинга
const MonitoringAddMiddleware = async (ctx, name, sheet_id) => {
    const { username } = ctx.message.from
    try {
        const LoadMonitoring = async (filePath) => {
            const fileContents = await fs.promises.readFile(filePath, 'utf8');
            return JSON.parse(fileContents);
        }
        
        const UpdateMonitoring = async (filePath, data) => {
            await fs.promises.writeFile(filePath, JSON.stringify(data, null, 4));
        }

        const list = await LoadMonitoring('./data/monitoring.json')

        list.data.push({
            name,
            sheet_id
        })

        UpdateMonitoring('./data/monitoring.json', list)

        LOG(username, 'Messages/Monitoring/MonitoringAddMiddleware')
    } catch (error) {
        LOG(username, 'Messages/Monitoring/MonitoringAddMiddleware', error)
    }
}
//* END - MonitoringAddMiddleware


//* START - MonitoringSwitcherMiddleware/ Переключатель работы мониторинга
const MonitoringSwitcherMiddleware = async (ctx, status) => {
    const { username } = ctx.message.from
    try {
        const config = require('@data/monitoring')
        config.status = status
        fs.writeFileSync('./data/monitoring.json', JSON.stringify(config, null, 4))

        if (status) {
            MonitoringMiddleware(ctx)
        }

        LOG(username, 'Messages/Monitoring/MonitoringSwitcherMiddleware')
    } catch (error) {
        LOG(username, 'Messages/Monitoring/MonitoringSwitcherMiddleware', error)
    } finally {
        return ctx.scene.enter('monitoring')
    }
}
//* END - MonitoringSwitcherMiddleware


module.exports = { 
    MonitoringAddMiddleware, 
    MonitoringMiddleware, 
    MonitoringSwitcherMiddleware 
}