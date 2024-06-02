//? USERSMIDDLEWARES.JS

// Require
const { LOG } = require('@helpers/helpers')
const { UsersAddMessage, UsersRemoveMessage, UsersListMessage } = require('@messages/UsersMessages')
const { AddUser, RemoveUser, LoadUsers, SheetAdd } = require('@helpers/users')

// User Add Middleware
const UsersAddMiddleware = async (ctx) => {
    const { username } = ctx.message.from
    const { id, name } = ctx.wizard.state.data
    try {
        const response = AddUser(ctx, id, name);

        LOG(username, 'Middlewares/Users/UsersAddMiddleware')
        return await UsersAddMessage(ctx, response, id, name)
    } catch (error) {
        LOG(username, 'Middlewares/Users/UsersAddMiddleware', error)
    }
}

// User Delete Middleware
const UsersRemoveMiddleware = async (ctx, id) => {
    const { username } = ctx.message.from
    try {
        const response = RemoveUser(ctx, id);

        LOG(username, 'Middlewares/Users/UserDeleteMiddleware')
        return await UsersRemoveMessage(ctx, response, id)
    } catch (error) {
        LOG(username, 'Middlewares/Users/UserDeleteMiddleware', error)
    }
}

// User List Middleware
const UsersListMiddleware = async (ctx) => {
    const { username } = ctx.message.from
    try {
        const list = await LoadUsers(ctx);
        const message = await UsersListMessage(ctx, list)

        LOG(username, 'Middlewares/Users/UsersListMiddleware')
        return await ctx.replyWithHTML(message)
    } catch (error) {
        LOG(username, 'Middlewares/Users/UsersListMiddleware', error)
    } finally {
        return ctx.scene.enter('users')
    }
}

// User Sheet Add Middleware
const UsersSheetAddMiddleware = async (ctx, sheet_id) => {
    const { username } = ctx.message.from
    try {
        LOG(username, 'Middlewares/Users/UsersListMiddleware')
        return await SheetAdd(ctx, sheet_id)
    } catch (error) {
        LOG(username, 'Middlewares/Users/UsersListMiddleware', error)
    }
}

module.exports = { UsersAddMiddleware, UsersRemoveMiddleware, UsersListMiddleware, UsersSheetAddMiddleware }