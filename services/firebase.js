//? HELPERS | FIREBASE

//* Requires
const { initializeApp } = require('firebase/app')
const { getFirestore } = require('firebase/firestore/lite')
const { setDoc, getDoc, getDocs, deleteDoc, updateDoc, deleteField, doc, collection, query, where } = require('firebase/firestore/lite')
const { LOG } = require('@helpers/base')


//* START
const app = initializeApp({
    apiKey: process.env.FIREBASE_APIKEY,
    authDomain: process.env.FIREBASE_DOMAIN,
    databaseURL: process.env.FIREBASE_URL,
    projectId: process.env.FIREBASE_PROJECTID,
    storageBucket: process.env.FIREBASE_STORAGE,
    messagingSenderId: process.env.FIREBASE_SENDERID,
    appId: process.env.FIREBASE_APPID,
    measurementId: process.env.FIREBASE_MEASUREMENTID
})

const DB = getFirestore(app)
//* END


//* START
const GetFirebaseUser = async (ctx, id) => {
    // Получаем имя пользователя из контекста или устанавливаем 'BOT' по умолчанию
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'

    try {
        // Получаем ссылку на документ пользователя в базе данных
        const response = doc(DB, 'users', id.toString())
        // Запрашиваем данные пользователя из документа
        const user = await getDoc(response)

        // Логируем информацию о получении пользователя
        LOG(username, 'Helpers/Firebase/GetFirebaseUser')
        // Возвращаем данные пользователя
        return user.data()
    } catch (error) {
        // Логируем ошибку, если она произошла
        LOG(username, 'Helpers/Firebase/GetFirebaseUser', error, ctx)
        // Возвращаем false в случае ошибки
        return false
    }
}
//* END


//* START
const GetFirebaseUsers = async (ctx) => {
    // Получаем имя пользователя из контекста или устанавливаем 'BOT' по умолчанию
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'

    try {
        // Получаем ссылку на коллекцию пользователей в базе данных
        const cols = collection(DB, 'users')
        // Запрашиваем все документы из коллекции
        const snapshot = await getDocs(cols)

        // Логируем информацию о получении пользователей
        LOG(username, 'Helpers/Firebase/GetFirebaseUsers')
        // Возвращаем массив данных всех пользователей
        return snapshot.docs.map(doc => doc.data())
    } catch (error) {
        // Логируем ошибку, если она произошла
        LOG(username, 'Helpers/Firebase/GetFirebaseUsers', error, ctx)
        // Возвращаем false в случае ошибки
        return false
    }
}
//* END


//* START
const SetFirebaseUser = async (ctx, data) => {
    // Получаем имя пользователя из контекста или устанавливаем 'BOT' по умолчанию
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'

    try {
        // Получаем ссылку на документ пользователя в базе данных по его ID
        const user = doc(DB, 'users', data.id)

        // Логируем информацию о попытке установки пользователя
        LOG(username, 'Helpers/Firebase/SetFirebaseUser')
        // Устанавливаем данные пользователя в документ
        return await setDoc(user, data)
    } catch (error) {
        // Логируем ошибку, если она произошла
        LOG(username, 'Helpers/Firebase/SetFirebaseUser', error, ctx)
        // Возвращаем false в случае ошибки
        return false
    }
}
//* END


//* START
const DeleteFirebaseUser = async (ctx, id) => {
    // Получаем имя пользователя из контекста или устанавливаем 'BOT' по умолчанию
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'

    try {
        // Получаем ссылку на документ пользователя в базе данных по его ID
        const user = doc(DB, 'users', id)

        // Логируем информацию о попытке удаления пользователя
        LOG(username, 'Helpers/Firebase/DeleteFirebaseUser')
        // Удаляем документ пользователя из базы данных
        return await deleteDoc(user)
    } catch (error) {
        // Логируем ошибку, если она произошла
        LOG(username, 'Helpers/Firebase/DeleteFirebaseUser', error, ctx)
        // Возвращаем false в случае ошибки
        return false
    }
}
//* END


//* START
const GetToken = async (ctx, account) => {
    // Получаем имя пользователя из контекста или устанавливаем 'BOT' по умолчанию
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'

    try {
        // Получаем ссылку на документ аккаунта в базе данных по его ID
        const response = doc(DB, 'accounts', account)
        // Запрашиваем документ и сохраняем его данные в переменной token
        const token = await getDoc(response)

        // Логируем информацию о получении токена
        LOG(username, 'Helpers/Firebase/GetToken')
        // Возвращаем данные токена из документа
        return token.data()
    } catch (error) {
        // Логируем ошибку, если она произошла
        LOG(username, 'Helpers/Firebase/GetToken', error, ctx)
        // Возвращаем false в случае ошибки
        return false
    }
}
//* END


//* START
const SetToken = async (ctx, account, data) => {
    // Получаем имя пользователя из контекста или устанавливаем 'BOT' по умолчанию
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'

    try {
        // Получаем ссылку на документ аккаунта в базе данных по его ID
        const user = doc(DB, 'accounts', account)

        // Логируем информацию о установке токена
        LOG(username, 'Helpers/Firebase/SetToken')
        // Устанавливаем данные токена в документ аккаунта и возвращаем результат
        return await setDoc(user, data)
    } catch (error) {
        // Логируем ошибку, если она произошла
        LOG(username, 'Helpers/Firebase/SetToken', error, ctx)
        // Возвращаем false в случае ошибки
        return false
    }
}
//* END


//* START
const HasAccess = async (ctx, id) => {
    // Получаем имя пользователя из контекста или устанавливаем 'BOT' по умолчанию
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'

    try {
        // Получаем ссылку на документ пользователя по его ID
        const response = doc(DB, 'users', id.toString())
        // Получаем данные пользователя из документа
        const access = await getDoc(response)

        // Логируем информацию о проверке доступа
        LOG(username, 'Helpers/Firebase/HasAccess')
        // Возвращаем true, если данные пользователя существуют, иначе false
        return access.data() ? true : false
    } catch (error) {
        // Логируем ошибку, если она произошла
        LOG(username, 'Helpers/Firebase/HasAccess', error, ctx)
        // Возвращаем false в случае ошибки
        return false
    }
}
//* END


//* START
const HasAdminAccess = async (ctx, id) => {
    // Получаем имя пользователя из контекста или устанавливаем 'BOT' по умолчанию
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'

    try {
        // Получаем ссылку на документ пользователя по его ID
        const response = doc(DB, 'users', id.toString())
        // Получаем данные пользователя из документа
        const access = await getDoc(response)
        // Извлекаем роль пользователя
        const role = await access.data().role

        // Проверяем, является ли пользователь администратором
        if (role === 'admin') {
            // Логируем успешную проверку доступа
            LOG(username, 'Helpers/Firebase/HasAdminAccess')
            return true
        } else {
            // Логируем, что доступ не предоставлен
            LOG(username, 'Helpers/Firebase/HasAdminAccess')
            return false
        }
    } catch (error) {
        // Логируем ошибку, если она произошла
        LOG(username, 'Helpers/Firebase/HasAdminAccess', error, ctx)
        // Возвращаем false в случае ошибки
        return false
    }
}
//* END


//* START
const GrantAccess = async (ctx, id, name) => {
    // Получаем имя пользователя из контекста или устанавливаем 'BOT' по умолчанию
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'

    try {
        // Устанавливаем данные пользователя в Firebase с помощью функции SetFirebaseUser
        const user = await SetFirebaseUser(ctx, {
            id: id,
            name: name
        })

        // Логируем успешное предоставление доступа
        LOG(username, 'Helpers/Firebase/GrantAccess')
        // Возвращаем true, если пользователь успешно создан, иначе false
        return user ? true : false
    } catch (error) {
        // Логируем ошибку, если она произошла
        LOG(username, 'Helpers/Firebase/GrantAccess', error, ctx)
        // Возвращаем false в случае ошибки
        return false
    }
}
//* END


//* START
const GrantAdminAccess = async (ctx, id) => {
    // Получаем имя пользователя из контекста или устанавливаем 'BOT' по умолчанию
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'

    try {
        // Получаем ссылку на документ пользователя в Firestore по его ID
        const user = doc(DB, 'users', id.toString());
        // Обновляем роль пользователя на 'admin'
        await updateDoc(user, {
            role: 'admin'
        });

        // Логируем успешное предоставление административного доступа
        LOG(username, 'Helpers/Firebase/GrantAdminAccess')
        // Возвращаем true, если доступ успешно предоставлен
        return true
    } catch (error) {
        // Логируем ошибку, если она произошла
        LOG(username, 'Helpers/Firebase/GrantAdminAccess', error, ctx)
        // Возвращаем false в случае ошибки
        return false
    }
}
//* END


//* START
const UpdateUserSheet = async (ctx, sheet_id) => {
    // Получаем имя пользователя из контекста или устанавливаем 'BOT' по умолчанию
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'

    try {
        // Получаем ссылку на документ пользователя в Firestore по его ID
        const user = doc(DB, 'users', id.toString());
        // Обновляем поле 'sheet' пользователя с новым значением sheet_id
        await updateDoc(user, {
            sheet: sheet_id
        })

        // Возвращаем true, если обновление прошло успешно
        return true
    } catch (error) {
        // Логируем ошибку, если она произошла
        LOG(username, 'Helpers/Firebase/UpdateUserSheet', error, ctx)
        // Возвращаем false в случае ошибки
        return false
    }
}
//* END


//* START
const UpdateUserDomain = async (ctx, domain) => {
    // Получаем имя пользователя из контекста или устанавливаем 'BOT' по умолчанию
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'

    try {
        // Получаем ссылку на документ пользователя в Firestore по его ID
        const user = doc(DB, 'users', id.toString());
        // Обновляем поле 'domain' пользователя с новым значением domain
        await updateDoc(user, {
            domain: domain
        })

        // Возвращаем true, если обновление прошло успешно
        return true
    } catch (error) {
        // Логируем ошибку, если она произошла
        LOG(username, 'Helpers/Firebase/UpdateUserDomain', error, ctx)
        // Возвращаем false в случае ошибки
        return false
    }
}
//* END


//* START
const GetUserSheet = async (ctx) => {
    // Получаем имя пользователя из контекста или устанавливаем 'BOT' по умолчанию
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'
    // Получаем ID пользователя из контекста
    const id = ctx.message?.from?.id || ctx.callbackQuery?.from?.id

    try {
        // Получаем ссылку на документ пользователя в Firestore по его ID
        const response = doc(DB, 'users', id.toString());
        // Получаем данные пользователя из документа
        const access = await getDoc(response)

        // Логируем успешное выполнение функции
        LOG(username, 'Helpers/Firebase/GetUserSheet')
        // Возвращаем значение поля 'sheet' из данных пользователя
        return await access.data().sheet
    } catch (error) {
        // Логируем ошибку, если она произошла
        LOG(username, 'Helpers/Firebase/GetUserSheet', error, ctx)
        // Возвращаем false в случае ошибки
        return false
    }
}
//* END


//* START
const GetMonitoringList = async (ctx, id) => {
    // Получаем имя пользователя из контекста или устанавливаем 'BOT' по умолчанию
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'
    try {
        // Получаем ссылку на коллекцию 'monitoring' в Firestore
        const cols = collection(DB, 'monitoring')
        // Создаем запрос для фильтрации документов по полю 'user', равному переданному id
        const q = query(cols, where('user', '==', id))
        // Выполняем запрос и получаем результаты
        const snapshot = await getDocs(q)

        // Логируем успешное выполнение функции
        LOG(username, 'Helpers/Firebase/GetMonitoringList')
        // Возвращаем массив данных всех найденных документов
        return snapshot.docs.map(doc => doc.data())
    } catch (error) {
        // Логируем ошибку, если она произошла
        LOG(username, 'Helpers/Firebase/GetMonitoringList', error, ctx)
        // Возвращаем false в случае ошибки
        return false
    }
}
//* END


//* START
const SetMonitoringItem = async (ctx, data) => {
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT' // Получаем имя пользователя из контекста или устанавливаем 'BOT' по умолчанию

    try {
        const monitoring = doc(DB, 'monitoring', data.name) // Создаем ссылку на документ в коллекции 'monitoring' с использованием имени из data

        LOG(username, 'Helpers/Firebase/SetMonitoringList') // Логируем успешное выполнение функции
        return await setDoc(monitoring, data) // Сохраняем данные в документе
    } catch (error) {
        LOG(username, 'Helpers/Firebase/SetMonitoringList', error, ctx) // Логируем ошибку, если она произошла
        return false // Возвращаем false в случае ошибки
    }
}
//* END


//* START
const ClearAllMonitoringItems = async (ctx) => {
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT' // Получаем имя пользователя из контекста или устанавливаем 'BOT' по умолчанию

    try {
        const monitoringCollection = collection(DB, 'monitoring') // Получаем коллекцию 'monitoring'
        const snapshot = await getDocs(monitoringCollection) // Получаем все документы из коллекции

        for (const doc of snapshot.docs) { // Итерируемся по всем документам
            const fields = doc.data() // Получаем данные текущего документа
            const deleteFields = {} // Создаем объект для удаления полей

            for (let key in fields) { // Итерируемся по всем полям документа
                deleteFields[key] = deleteField() // Добавляем поле в объект удаления
            }

            await updateDoc(doc.ref, deleteFields) // Обновляем документ, удаляя указанные поля
        }

        LOG(username, 'Helpers/Firebase/ClearAllMonitoringItems') // Логируем успешное выполнение функции
        return true // Возвращаем true при успешном выполнении
    } catch (error) {
        LOG(username, 'Helpers/Firebase/ClearAllMonitoringItems', error, ctx) // Логируем ошибку, если она произошла
        return false // Возвращаем false в случае ошибки
    }
}
//* END


//* START
const DeleteMonitoringItem = async (ctx, name) => {
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT' // Получаем имя пользователя из контекста или устанавливаем 'BOT' по умолчанию

    try {
        const item = doc(DB, 'monitoring', name) // Получаем ссылку на документ с именем 'name' в коллекции 'monitoring'

        LOG(username, 'Helpers/Firebase/DeleteMonitoringItem') // Логируем выполнение функции
        return await deleteDoc(item) // Удаляем документ и возвращаем результат
    } catch (error) {
        LOG(username, 'Helpers/Firebase/DeleteMonitoringItem', error, ctx) // Логируем ошибку, если она произошла
        return false // Возвращаем false в случае ошибки
    }
}
//* END


//* START
const UpdateMonitoringItem = async (ctx, name, status) => {
    // Получаем имя пользователя из контекста
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'
    
    try {
        // Получаем ссылку на документ в коллекции 'monitoring'
        const item = doc(DB, 'monitoring', name) 
        
        // Обновляем статус документа
        await updateDoc(item, {
            status: status 
        })

        // Логируем информацию о выполнении функции
        LOG(username, 'Helpers/Firebase/UpdateMonitoringItem') 
        
        return true 
    } catch (error) {
        // Логируем ошибку, если она произошла
        LOG(username, 'Helpers/Firebase/UpdateMonitoringItem', error, ctx) 
        
        return false 
    }
}
//* END


module.exports = {
    GetFirebaseUser,
    GetFirebaseUsers,
    SetFirebaseUser,
    DeleteFirebaseUser,
    GetToken,
    SetToken,
    HasAdminAccess,
    HasAccess,
    GrantAccess,
    GrantAdminAccess,
    UpdateUserSheet,
    UpdateUserDomain,
    GetUserSheet,
    GetMonitoringList,
    SetMonitoringItem,
    ClearAllMonitoringItems,
    DeleteMonitoringItem,
    UpdateMonitoringItem
}