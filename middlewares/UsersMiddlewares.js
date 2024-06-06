//? MIDDLEWARES | USERS

//* Require
const { LOG } = require('@helpers/base')
const { UsersAddMessage, UsersRemoveMessage, UsersListMessage } = require('@messages/UsersMessages')
const { AddUser, RemoveUser, LoadUsers, SheetAdd, OfferAdd } = require('@helpers/users')


//* START - UsersAddMiddleware / Добавление пользователей
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
//* END - UsersAddMiddleware


//* START - UsersRemoveMiddleware / Удаление пользователей
const UsersRemoveMiddleware = async (ctx, id) => {
    const { username } = ctx.message.from
    try {
        const response = RemoveUser(ctx, id);

        LOG(username, 'Middlewares/Users/UsersRemoveMiddleware')
        return await UsersRemoveMessage(ctx, response, id)
    } catch (error) {
        LOG(username, 'Middlewares/Users/UsersRemoveMiddleware', error)
    }
}
//* END - UsersRemoveMiddleware


//* START - UsersListMiddleware / Получение списка пользователей
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
//* END - UsersListMiddleware


//* START - UsersSheetAddMiddleware / Добавление sheet_id пользователя
const UsersSheetAddMiddleware = async (ctx, sheet_id) => {
    const { username } = ctx.message.from
    try {
        LOG(username, 'Middlewares/Users/UsersSheetAddMiddleware')
        return await SheetAdd(ctx, sheet_id)
    } catch (error) {
        LOG(username, 'Middlewares/Users/UsersSheetAddMiddleware', error)
    }
}
//* END - UsersSheetAddMiddleware


//* START - UsersOfferAddMiddleware / Добавление оффера Tonic
const UsersOfferAddMiddleware = async (ctx, offer) => {
    const { username } = ctx.message.from
    try {
        LOG(username, 'Middlewares/Users/UsersOfferAddMiddleware')
        return await OfferAdd(ctx, offer)
    } catch (error) {
        LOG(username, 'Middlewares/Users/UsersOfferAddMiddleware', error)
    }
}
//* END - UsersOfferAddMiddleware


module.exports = {
    UsersAddMiddleware,
    UsersRemoveMiddleware,
    UsersListMiddleware,
    UsersSheetAddMiddleware,
    UsersOfferAddMiddleware
}