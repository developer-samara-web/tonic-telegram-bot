//? USERS.JS

// Requires
const fs = require('fs')
const list = require('@users/users.json')
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

        if (!update.some(u => u.id === id)) {
            update.push({ id, name })
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
const SaveUsers = (ctx, user) => {
    const { username } = ctx.message.from
    try {
        fs.writeFileSync('./users/users.json', JSON.stringify(user, null, 4))

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
        const index = data.findIndex(user => user.id === id)

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
    const { username } = ctx.message.from
    try {
        const update = list
        update.push({ id, name });

        SaveUsers(list, update);

        LOG(username, 'Helpers/Users/GrantAccess')
        return true
    } catch (error) {
        LOG(username, 'Helpers/Users/GrantAccess', error)
        return false
    }
};

// Deny Access
const DenyAccess = (id) => {
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
const HasAccess = (id) => {
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
const HasAdminAccess = (id) => {
    const { username } = ctx.message.from
    try {
        LOG(username, 'Helpers/Users/HasAdminAccess')
        return id == process.env.TELEGRAM_ADMIN_ID;
    } catch (error) {
        LOG(username, 'Helpers/Users/HasAccess', error)
        return false
    }
};

module.exports = { LoadUsers, AddUser, SaveUsers, RemoveUser, GrantAccess, DenyAccess, HasAccess, HasAdminAccess }