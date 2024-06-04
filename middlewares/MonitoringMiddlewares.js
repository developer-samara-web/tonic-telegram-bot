//? MIDDLEWARES | MONITORING

//* Requires
const fs = require('fs');
const { LOG } = require('@helpers/base')
const { Status } = require('@helpers/tonic')
const { SaveSheet } = require('@helpers/sheet')


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
    MonitoringMiddleware, 
    MonitoringSwitcherMiddleware 
}