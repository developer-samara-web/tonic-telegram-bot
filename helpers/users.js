//? USERS.JS

// Requires
const fs = require('fs')
const list = require('@data/users.json')
const { LOG } = require('@helpers/helpers')

// Load Users
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

//Add User
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

// Save Users
const SaveUsers = (ctx, user, update) => {
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT';
    try {
        console.log(update)
        fs.writeFileSync('./data/users.json', JSON.stringify(user, null, 4))

        LOG(username, 'Helpers/Users/SaveUsers')
        return true
    } catch (error) {
        LOG(username, 'Helpers/Users/SaveUsers', error)
        return false
    }
}

// Remove User
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

// Grant Access
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
};

// Grant Admin Access
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
};

// Deny Access
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
};

// Has Access
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
};

// Has Admin Access
const HasAdminAccess = (ctx, id) => {
    const { username } = ctx.message.from
    try {
        const update = list
        const { role } = update.find(user => user.id === id);

        if( role === 'admin'){
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
};

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
};

module.exports = { LoadUsers, AddUser, SaveUsers, RemoveUser, GrantAccess, DenyAccess, HasAccess, HasAdminAccess, SheetAdd, GrantAdminAccess }