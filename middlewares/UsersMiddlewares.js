//? MIDDLEWARES | USERS

//* Require
const { LOG } = require('@helpers/base')
const { UsersAddMessage, UsersRemoveMessage, UsersListMessage } = require('@messages/UsersMessages')
const { SetFirebaseUser, DeleteFirebaseUser, GetFirebaseUsers, UpdateUserSheet, UpdateUserDomain } = require('@helpers/firebase')


//* START
const UsersAddMiddleware = async (ctx) => {
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'
    const { id, name } = ctx.wizard.state.data
    try {
        // Устанавливаем пользователя в Firebase
        const response = SetFirebaseUser(ctx, { id, name });

        // Логируем успешное выполнение функции
        LOG(username, 'Middlewares/Users/UsersAddMiddleware')
        // Возвращаем сообщение о добавлении пользователя
        return await UsersAddMessage(ctx, response, id, name)
    } catch (error) {
        // Логируем ошибку, если что-то пошло не так
        LOG(username, 'Middlewares/Users/UsersAddMiddleware', error, ctx)
    }
}
//* END


//* START
const UsersRemoveMiddleware = async (ctx, id) => {
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'
    try {
        // Удаляем пользователя из Firebase
        const response = DeleteFirebaseUser(ctx, id);

        // Логируем успешное выполнение функции
        LOG(username, 'Middlewares/Users/UsersRemoveMiddleware')
        // Возвращаем сообщение о удалении пользователя
        return await UsersRemoveMessage(ctx, response, id)
    } catch (error) {
        // Логируем ошибку, если что-то пошло не так
        LOG(username, 'Middlewares/Users/UsersRemoveMiddleware', error, ctx)
    }
}
//* END


//* START
const UsersListMiddleware = async (ctx) => {
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'
    try {
        // Получаем список пользователей из Firebase
        const list = await GetFirebaseUsers(ctx);
        // Формируем сообщение со списком пользователей
        const message = await UsersListMessage(ctx, list)

        // Логируем успешное выполнение функции
        LOG(username, 'Middlewares/Users/UsersListMiddleware')
        // Отправляем сообщение с пользователями в чат
        return await ctx.replyWithHTML(message)
    } catch (error) {
        // Логируем ошибку, если что-то пошло не так
        LOG(username, 'Middlewares/Users/UsersListMiddleware', error, ctx)
    } finally {
        // Переходим к сцене управления пользователями
        return ctx.scene.enter('users')
    }
}
//* END


//* START
const UsersSheetAddMiddleware = async (ctx, sheet_id) => {
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'
    try {
        // Логируем начало выполнения функции
        LOG(username, 'Middlewares/Users/UsersSheetAddMiddleware')
        // Обновляем лист пользователя в Firebase
        return await UpdateUserSheet(ctx, sheet_id)
    } catch (error) {
        // Логируем ошибку, если что-то пошло не так
        LOG(username, 'Middlewares/Users/UsersSheetAddMiddleware', error, ctx)
    }
}
//* END


//* START
const UsersDomainAddMiddleware = async (ctx, domain) => {
    const username = ctx.message?.from?.username || ctx.callbackQuery?.from?.username || 'BOT'
    try {
        // Логируем начало выполнения функции
        LOG(username, 'Middlewares/Users/UsersDomainAddMiddleware')
        // Обновляем домен пользователя в Firebase
        return await UpdateUserDomain(ctx, domain)
    } catch (error) {
        // Логируем ошибку, если что-то пошло не так
        LOG(username, 'Middlewares/Users/UsersDomainAddMiddleware', error, ctx)
    }
}
//* END


module.exports = {
    UsersAddMiddleware,
    UsersRemoveMiddleware,
    UsersListMiddleware,
    UsersSheetAddMiddleware,
    UsersDomainAddMiddleware
}