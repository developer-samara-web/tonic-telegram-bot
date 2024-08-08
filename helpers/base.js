//? HELPERS | BASE

//* Requires
const fs = require('fs');
const archiver = require('archiver');
const path = require('path');
const { Markup } = require('telegraf')


//* START
const LOG = async (user, object, error, ctx) => {
    // Получаем текущую дату и время
    const now = new Date()
    const date = now.toISOString().slice(0, 10) // Форматируем дату в ISO формате (YYYY-MM-DD)
    const time = now.toTimeString().slice(0, 8) // Форматируем время в HH:MM:SS

    // Формируем сообщение для лога
    const logMessage = `[${error ? 'ERROR' : 'INFO'}][${date} ${time}] User: ${user}, Function: ${object}, ${error ? 'ERROR' : 'INFO'}: ${error ? error : 'OK'}\n`

    // Определяем директорию для логов
    const logDir = path.join(__dirname, '..', 'logs')

    try {
        // Создаем директорию для логов, если она не существует
        await fs.promises.mkdir(logDir, { recursive: true })
        // Определяем путь к файлу лога с именем по текущей дате
        const filePath = path.join(logDir, `${date}.log`)
        // Записываем сообщение в файл лога
        await fs.promises.appendFile(filePath, logMessage)

        // Если произошла ошибка, отправляем сообщение админу в Telegram
        if (error) {
            await ctx.telegram.sendMessage(
                process.env.TELEGRAM_ADMIN_ID, 
                `🚫  <b>Ошибка от ${user}:</b>\n${error}\n\n<b>🔸  Функция:</b>\n[${object}]\n\n<b>🔸  Подробнее:</b>\n${error.stack}`, 
                { parse_mode: 'HTML' }
            )
        }
    } catch (error) {
        // Если произошла ошибка при записи лога, выводим сообщение в консоль
        console.error('Ошибка записи логов:', error)
    }
}
//* END


//* START
const Archive = (ctx, logDirectory, outputFilePath) => {
    // Извлекаем username из контекста сообщения или callbackQuery, если не найден, устанавливаем значение 'BOT'
    const { username = 'BOT' } = ctx.message?.from || ctx.callbackQuery?.from;

    try {
        return new Promise((resolve, reject) => {
            // Создаем поток для записи архива в указанный файл
            const output = fs.createWriteStream(outputFilePath);
            // Создаем архиватор с использованием формата zip и уровнем сжатия 9
            const archive = archiver('zip', { zlib: { level: 9 } });

            // Обработчик события 'close' для потока вывода, разрешаем промис с путём к архиву
            output.on('close', () => {
                resolve(outputFilePath);
            });

            // Обработчик ошибок архивации, отклоняем промис в случае ошибки
            archive.on('error', reject);

            // Направляем данные архива в поток вывода
            archive.pipe(output);

            // Добавляем файлы в архив, игнорируя файл самого архива
            archive.glob('**/*', {
                cwd: logDirectory,
                ignore: [path.basename(outputFilePath)]
            });

            // Завершаем архивацию
            archive.finalize();

            // Логируем успешное начало архивации
            LOG(username, 'Helpers/Base/Archive');
        });
    } catch (error) {
        // Логируем ошибку, если она возникла
        LOG(username, 'Helpers/Base/Archive', error, ctx);
    }
}
//* END


//* START
const DateCurent = async (ctx, date) => {
    // Извлекаем username из контекста сообщения или callbackQuery, если не найден, устанавливаем значение 'BOT'
    const { username = 'BOT' } = ctx.message?.from || ctx.callbackQuery?.from

    try {
        // Асинхронная функция для генерации даты, отнимая указанное количество дней от текущей даты
        const dateGenerateAsync = async (num) => {
            const previousDay = new Date()
            previousDay.setDate(previousDay.getDate() - num)

            const [year, month, day] = [
                previousDay.getFullYear(),
                String(previousDay.getMonth() + 1).padStart(2, '0'), // Форматируем месяц с ведущим нулём
                String(previousDay.getDate()).padStart(2, '0') // Форматируем день с ведущим нулём
            ];

            return `${year}-${month}-${day}` // Возвращаем дату в формате YYYY-MM-DD
        };

        // Обрабатываем значение параметра date
        switch (date) {
            case 'Сегодня':
                // Логируем действие для текущего пользователя
                LOG(username, 'Helpers/Base/DateCurent')
                // Возвращаем текущую дату
                return `date=${await dateGenerateAsync(0)}`
            case 'Вчера':
                // Логируем действие для текущего пользователя
                LOG(username, 'Helpers/Base/DateCurent');
                // Возвращаем дату вчерашнего дня
                return `date=${await dateGenerateAsync(1)}`
            case 'За 3 дня':
                // Логируем действие для текущего пользователя
                LOG(username, 'Helpers/Base/DateCurent')
                // Возвращаем даты за последние 3 дня
                return `from=${await dateGenerateAsync(3)}&to=${await dateGenerateAsync(0)}`
            case 'За неделю':
                // Логируем действие для текущего пользователя
                LOG(username, 'Helpers/Base/DateCurent');
                // Возвращаем даты за последнюю неделю
                return `from=${await dateGenerateAsync(7)}&to=${await dateGenerateAsync(0)}`
            case 'За месяц':
                // Логируем действие для текущего пользователя
                LOG(username, 'Helpers/Base/DateCurent')
                // Возвращаем даты за последний месяц
                return `from=${await dateGenerateAsync(30)}&to=${await dateGenerateAsync(0)}`
            default:
                // Логируем действие для текущего пользователя
                LOG(username, 'Helpers/Base/DateCurent')
                // Возвращаем даты, разделённые параметром ':'
                return `from=${date.split(':')[0]}&to=${date.split(':')[1]}`
        }
    } catch (error) {
        // Логируем ошибку, если она возникла
        LOG(username, 'Helpers/Base/DateCurent', error, ctx)
    }
}
//* END


//* START
const GroupByDate = (data) => {
    // Используем метод reduce для агрегации данных по дате
    return data.reduce((acc, item) => {
        const dateKey = item.date; // Получаем ключ даты из текущего элемента

        // Если ключ даты еще не существует в аккумуляторе, создаем новый объект для этой даты
        if (!acc[dateKey]) {
            acc[dateKey] = {
                date: dateKey, // Сохраняем дату
                campaign_name: item.campaign_name, // Сохраняем название кампании
                clicks: 0, // Инициализируем количество кликов
                revenueUsd: 0.0, // Инициализируем доход в долларах
                CPC: 0.0, // Инициализируем стоимость за клик
                items: [] // Инициализируем массив для хранения элементов
            };
        }

        // Увеличиваем общее количество кликов для данной даты
        acc[dateKey].clicks += Number(item.clicks);
        // Увеличиваем общий доход для данной даты
        acc[dateKey].revenueUsd += parseFloat(item.revenueUsd);
        // Добавляем текущий элемент в массив элементов для данной даты
        acc[dateKey].items.push(item);

        return acc; // Возвращаем аккумулятор для следующей итерации
    }, {}); // Начинаем с пустого объекта
}
//* END


//* START
const CalculateStatistics = (groupedData, companyName) => {
    let totalClicks = 0 // Инициализируем переменную для общего количества кликов
    let totalRevenueUsd = 0.0 // Инициализируем переменную для общего дохода в долларах

    // Проходим по всем ключам дат в сгруппированных данных
    for (const dateKey in groupedData) {
        totalClicks += groupedData[dateKey].clicks // Суммируем клики для каждой даты
        totalRevenueUsd += groupedData[dateKey].revenueUsd // Суммируем доход для каждой даты
        // Вычисляем CPC (стоимость за клик) для текущей даты и округляем до двух знаков
        groupedData[dateKey].CPC = (groupedData[dateKey].revenueUsd / groupedData[dateKey].clicks).toFixed(2)
    }

    // Возвращаем объект со статистикой кампании
    return {
        campaign_name: companyName, // Название кампании
        totalClicks: totalClicks, // Общее количество кликов
        totalRevenueUsd: totalRevenueUsd.toFixed(2), // Общий доход, округленный до двух знаков
        totalCPC: (totalRevenueUsd / totalClicks).toFixed(2) // Общая стоимость за клик, округленная до двух знаков
    }
}
//* END


//* START
const CreateKeywordItem = (item) => {
    // Создаем и возвращаем новый объект, основанный на переданном элементе
    return {
        ...item, // Распаковываем все свойства исходного элемента
        CPC: (item.revenueUsd / item.clicks).toFixed(2) // Вычисляем CPC (стоимость за клик) и округляем до двух знаков
    }
}
//* END


//* START
const KeywordUpdateItem = (existingItem, item) => {
    // Обновляем количество кликов, складывая существующее и новое значение
    existingItem.clicks = String(Number(existingItem.clicks) + Number(item.clicks))
    // Обновляем общий доход, складывая существующий и новый доход, затем округляем до двух знаков
    existingItem.revenueUsd = (parseFloat(existingItem.revenueUsd) + parseFloat(item.revenueUsd)).toFixed(2)
    // Вычисляем CPC (стоимость за клик) как отношение общего дохода к количеству кликов и округляем до двух знаков
    existingItem.CPC = (existingItem.revenueUsd / existingItem.clicks).toFixed(2)
}
//* END


//* START
const FilterKeyword = (data, companyName) => {
    // Фильтруем данные по имени компании и затем редуцируем их для создания агрегированного списка
    return data.filter(obj => obj.campaign_name === companyName) // Оставляем только те объекты, которые соответствуют заданному имени компании
        .reduce((acc, item) => {
            // Находим существующий элемент в аккумуляторе по имени кампании и ключевому слову
            const existingItem = acc.find(group => group.campaign_name === item.campaign_name && group.keyword === item.keyword)
            if (existingItem) {
                // Если элемент существует, обновляем его данные
                KeywordUpdateItem(existingItem, item)
            } else {
                // Если элемента нет, создаем новый и добавляем его в аккумулятор
                acc.push(CreateKeywordItem(item))
            }
            return acc // Возвращаем аккумулятор для следующей итерации
        }, []) // Инициализируем аккумулятор пустым массивом
}
//* END


//* START
const CreateStatsItem = (item) => {
    // Создаем и возвращаем новый объект, основанный на переданном элементе
    return {
        ...item, // Распаковываем все свойства исходного элемента
        revenueUsd: parseFloat(item.revenueUsd).toFixed(2), // Преобразуем доход в число и округляем до двух знаков
        CPC: (item.revenueUsd / item.clicks).toFixed(2) // Вычисляем CPC (стоимость за клик) и округляем до двух знаков
    }
}
//* END


//* START
const UpdateStatsItem = (existingItem, item) => {
    // Обновляем количество кликов, складывая существующее и новое значение
    existingItem.clicks = String(Number(existingItem.clicks) + Number(item.clicks))
    
    // Обновляем общий доход, складывая существующий и новый доход, затем округляем до двух знаков
    existingItem.revenueUsd = (parseFloat(existingItem.revenueUsd) + parseFloat(item.revenueUsd)).toFixed(2)
    
    // Вычисляем CPC (стоимость за клик) как отношение общего дохода к количеству кликов и округляем до двух знаков
    existingItem.CPC = (existingItem.revenueUsd / existingItem.clicks).toFixed(2)
}
//* END


//* START
const FilterStats = (data, source, compains) => {
    // Фильтруем данные, чтобы получить элементы, чьи названия кампаний присутствуют в массиве compains
    const filter = data.filter(item => compains.includes(item.campaign_name))

    // Дополнительно фильтруем по источнику и обрабатываем элементы
    return filter.filter(obj => obj.network === source)
        .reduce((acc, item) => {
            // Ищем существующий элемент в аккумулированном массиве по имени кампании
            const existingItem = acc.find(group => group.campaign_name === item.campaign_name)
            if (existingItem) {
                // Если элемент найден, обновляем его данные
                UpdateStatsItem(existingItem, item)
            } else {
                // Если элемент не найден, создаем новый элемент и добавляем в массив
                acc.push(CreateStatsItem(item))
            }
            return acc // Возвращаем аккумулированный массив
        }, []) // Инициализируем пустой массив для аккумуляции
}
//* END


//* START
const CreateURL = (ctx, update, offer, network) => {
    // Извлекаем имя пользователя, устанавливаем значение по умолчанию 'BOT'
    const { username = 'BOT' } = ctx.message?.from || ctx.callbackQuery?.from
    // Формируем заголовок рекламы, удаляя ' PR' и заменяя пробелы на '+'
    const adTitle = offer.replace(/(?:\s|%20)?PR$/, '').replace(/\s+/g, '+').replace(/%20/g, '+');

    try {
        // Проверяем, если сеть Facebook
        if (network === 'facebook') {
            // Формируем и возвращаем URL для Facebook
            return `${update.data}/?adtitle=${adTitle}${process.env.FACEBOOK_URL}`
        } else if (network === 'tiktok') {
            // Формируем и возвращаем URL для TikTok
            return `${update.data}/?adtitle=${adTitle}${process.env.TIKTOK_URL}`
        }

        // Логируем информацию о создании URL
        LOG(username, 'Helpers/Base/CreateURL')
    } catch (error) {
        // Логируем ошибку, если она возникает
        LOG(username, 'Helpers/Base/CreateURL', error)
    }
}
//* END


//* START
const UpdateRowData = (ctx, row, update, offer) => {
    // Извлекаем имя пользователя, устанавливаем значение по умолчанию 'BOT'
    const { username = 'BOT' } = ctx.message?.from || ctx.callbackQuery?.from
    
    // Словарь для сопоставления типов обновлений с индексами в row._rawData
    const updateMap = { status: 0, network: 1 }

    try {
        // Проверяем, есть ли тип обновления в updateMap
        if (update.type in updateMap) {
            // Обновляем соответствующий индекс в row._rawData
            row._rawData[updateMap[update.type]] = update.data
        } 
        // Проверяем, является ли тип обновления 'href' и сеть Facebook или TikTok
        else if (update.type === 'href' && (row._rawData[1] === 'facebook' || row._rawData[1] === 'tiktok')) {
            // Создаем URL и обновляем соответствующее значение в row._rawData
            row._rawData[5] = CreateURL(ctx, update, offer, row._rawData[1])
            // Устанавливаем статус в 'Cloudflare'
            row._rawData[0] = 'Cloudflare'
        }

        // Логируем информацию об обновлении данных строки
        LOG(username, 'Helpers/Base/UpdateRowData')
    } catch (error) {
        // Логируем ошибку, если она возникает
        LOG(username, 'Helpers/Base/UpdateRowData', error)
    }
}
//* END


//* START
const SendAdminMessage = async (ctx, username) => {
    // Отправляем сообщение администратору с указанием пользователя, который отправил новые ссылки
    return await ctx.telegram.sendMessage(process.env.TELEGRAM_ADMIN_ID, `♻️ <b>Новые ссылки от <i>${username}</i>, загружаю...</b>`, {
        parse_mode: 'HTML' // Указываем режим разметки HTML
    })
}
//* END


//* START
const EditAdminMessage = async (ctx, message_id, username, keyboard) => {
    // Редактируем сообщение администратору с новой информацией о заявке и пользователе
    await ctx.telegram.editMessageText(process.env.TELEGRAM_ADMIN_ID, message_id, null, `♻️ <b>Заявка №${message_id} | Новые ссылки от <i>${username}</i></b>`, {
        parse_mode: 'HTML', // Указываем режим разметки HTML для форматирования текста
        reply_markup: keyboard.reply_markup // Передаем клавиатуру для редактирования кнопок в сообщении
    })
}
//* END


//* START
const CreateKeyboard = (id, message_id) => {
    // Создаем клавиатуру с одной кнопкой для выполнения действия
    return Markup.inlineKeyboard([
        // Создаем кнопку с текстом '✅ Выполнено', которая отправляет данные с действием 'complite', id и message_id
        Markup.button.callback('✅ Выполнено', JSON.stringify({ action: 'complite', id, message_id }))
    ])
}
//* END


module.exports = {
    LOG,
    Archive,
    GroupByDate,
    CalculateStatistics,
    FilterKeyword,
    FilterStats,
    UpdateRowData,
    DateCurent,
    SendAdminMessage,
    EditAdminMessage,
    CreateKeyboard
}