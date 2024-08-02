//? INDEX

//* Global Requires
require('dotenv').config();
require('module-alias/register');

//* Requires
const { Bot } = require('@config/telegram')
const { Scenes, session } = require('telegraf')
const { Permissions } = require('@helpers/permissions')
const { PermissionsAction, PermissionsAdminAction } = require('@actions/PermissionActions')
const { MonitoringAction } = require('@actions/MonitoringAction')

//* Configs
const stages = require('@config/stages')
const hears = require('@config/hears')


//* Stages
const stage = new Scenes.Stage(stages)


//* Session & Middleware & Hears
Bot.use(session())
Bot.use(stage.middleware())
hears(Bot)


//* Actions
Bot.action(/(grant_access|deny_access)/, async (ctx) => {
    await PermissionsAction(ctx);
})
Bot.action(/(grant_admin_access|deny_admin_access)/, async (ctx) => {
    await PermissionsAdminAction(ctx);
})
Bot.action(/(create_monitoring|delete_monitoring|refresh_monitoring|clear_monitoring)/, async (ctx) => {
    await MonitoringAction(ctx)
})


//* Welcome message
Bot.start(async (ctx) => {
    Permissions(ctx, 'start')
})


//* Launch
Bot.launch()