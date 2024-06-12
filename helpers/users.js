//? HELPERS | USERS

//* Requires
const fs = require('fs')
const list = require('@data/users.json')
const { LOG } = require('@helpers/base')


//* START - LoadUsers | Получаем список пользователей
const LoadUsers = (ctx) => {
    const { username } = ctx.message.from
    try {
        LOG(username, 'Helpers/Users/LoadUsers')
        return list
    } catch (error) {
        LOG(username, 'Helpers/Users/LoadUsers', error)
        return false
    }
}
//* END - LoadUsers


//* START - GetUser | Получаем данных пользователя
const GetUser = (ctx, id) => {
    const { username } = ctx.message.from
    try {
        LOG(username, 'Helpers/Users/LoadUsers')
        return list.find(item => item.id == id)
    } catch (error) {
        LOG(username, 'Helpers/Users/LoadUsers', error)
        return false
    }
}
//* END - GetUser


//* START - AddUser | Добавляем пользователя
const AddUser = (ctx, id, name) => {
    const { username } = ctx.message.from
    try {
        const update = list
        const role = 'user'

        if (!update.some(u => u.id === id)) {
            update.push({ id, name, role })
            SaveUsers(ctx, list, update)
        }

        LOG(username, 'Helpers/Users/AddUser')
        return true
    } catch (error) {
        LOG(username, 'Helpers/Users/AddUser', error)
        return false;
    }
}
//* END - AddUser


//* START - SaveUsers | Сохраняем пользователя
const SaveUsers = (ctx, user, update) => {
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT';
    try {
        fs.writeFileSync('./data/users.json', JSON.stringify(user, null, 4))

        LOG(username, 'Helpers/Users/SaveUsers')
        return true
    } catch (error) {
        LOG(username, 'Helpers/Users/SaveUsers', error)
        return false
    }
}
//* END - SaveUsers


//* START - RemoveUser | Удаляем пользователя
const RemoveUser = (ctx, id) => {
    const { username } = ctx.message.from
    try {
        const update = list
        const index = update.findIndex(user => user.id == id)

        if (index !== -1) {
            update.splice(index, 1)
            SaveUsers(ctx, list, update)
        }

        LOG(username, 'Helpers/Users/RemoveUser')
        return true
    } catch (error) {
        LOG(username, 'Helpers/Users/RemoveUser', error)
        return false
    }
}
//* END - RemoveUser


//* START - GrantAccess | Выдаём доступ к боту
const GrantAccess = (ctx, id, name) => {
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT';
    try {
        const update = list
        update.push({ id, name, role: 'user' });
        SaveUsers(ctx, update);

        LOG(username, 'Helpers/Users/GrantAccess')
        return true
    } catch (error) {
        LOG(username, 'Helpers/Users/GrantAccess', error)
        return false
    }
}
//* END - GrantAccess


//* START - GrantAdminAccess | Даём доступ администратора
const GrantAdminAccess = (ctx, id) => {
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT';
    try {
        const update = list
        const index = update.findIndex(user => user.id == id)

        update[index].role = 'admin';
        SaveUsers(ctx, update);

        LOG(username, 'Helpers/Users/GrantAdminAccess')
        return true
    } catch (error) {
        LOG(username, 'Helpers/Users/GrantAdminAccess', error)
        return false
    }
}
//* END - GrantAdminAccess


//* START - DenyAccess | Запрещаем доступ
const DenyAccess = (ctx, id) => {
    const { username } = ctx.message.from
    try {
        const update = list
        const updated = update.filter(user => user.id !== id);

        SaveUsers(list, updated);

        LOG(username, 'Helpers/Users/DenyAccess')
        return true;
    } catch (error) {
        LOG(username, 'Helpers/Users/DenyAccess', error)
        return false
    }
}
//* END - DenyAccess


//* START - HasAccess | Проверяем доступы 'user'
const HasAccess = (ctx, id) => {
    const { username } = ctx.message.from
    try {
        const update = list

        LOG(username, 'Helpers/Users/HasAccess')
        return update.some(user => Number(user.id) === id);
    } catch (error) {
        LOG(username, 'Helpers/Users/HasAccess', error)
        return false
    }
}
//* END - HasAccess


//* START - HasAdminAccess | Проверяем доступы 'admin'
const HasAdminAccess = (ctx, id) => {
    const { username } = ctx.message.from
    try {
        const update = list
        const { role } = update.find(user => user.id === id);

        if (role === 'admin') {
            LOG(username, 'Helpers/Users/HasAdminAccess')
            return true
        } else {
            LOG(username, 'Helpers/Users/HasAdminAccess')
            return false
        }
    } catch (error) {
        LOG(username, 'Helpers/Users/HasAdminAccess', error)
        return false
    }
}
//* END - HasAdminAccess


//* START - SheetAdd | Добавляем пользователю sheet_id
const SheetAdd = async (ctx, sheet_id) => {
    const { username, id } = ctx.message.from
    try {
        const update = list
        const index = update.findIndex(user => user.id == id)

        update[index].sheet = sheet_id

        LOG(username, 'Helpers/Users/SheetAdd')
        return SaveUsers(ctx, list, update);
    } catch (error) {
        LOG(username, 'Helpers/Users/SheetAdd', error)
        return false
    }
}
//* END - SheetAdd


//* START - OfferAdd | Добавляем пользователю оффер Tonic
const OfferAdd = async (ctx, offer) => {
    const { username, id } = ctx.message.from
    try {
        const update = list
        const index = update.findIndex(user => user.id == id)

        update[index].offer.push(offer)

        LOG(username, 'Helpers/Users/OfferAdd')
        return SaveUsers(ctx, list, update);
    } catch (error) {
        LOG(username, 'Helpers/Users/OfferAdd', error)
        return false
    }
}
//* END - OfferAdd


//* START - DomainAdd | Добавляем пользователю оффер Tonic
const DomainAdd = async (ctx, domain) => {
    const { username, id } = ctx.message.from
    try {
        const update = list
        const index = update.findIndex(user => user.id == id)

        update[index].domain = domain

        LOG(username, 'Helpers/Users/DomainAdd')
        return SaveUsers(ctx, list, update);
    } catch (error) {
        LOG(username, 'Helpers/Users/DomainAdd', error)
        return false
    }
}
//* END - DomainAdd

//* START - GetSheet | Добавляем пользователю sheet_id
const GetSheet = async (ctx) => {
    const { username, id } = ctx.message.from
    try {
        const index = list.findIndex(user => user.id == id)

        LOG(username, 'Helpers/Users/SheetAdd')
        return update[index].sheet;
    } catch (error) {
        LOG(username, 'Helpers/Users/SheetAdd', error)
        return false
    }
}
//* END - GetSheet


module.exports = { 
    LoadUsers, 
    AddUser, 
    SaveUsers, 
    RemoveUser, 
    GrantAccess, 
    DenyAccess, 
    HasAccess, 
    HasAdminAccess, 
    SheetAdd,
    OfferAdd,
    GetUser,
    DomainAdd,
    GetSheet,
    GrantAdminAccess
}