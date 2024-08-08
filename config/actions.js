//? CONFIG | TELEGRAM


//* Requires
const { PermissionsAction, PermissionsAdminAction } = require('@actions/PermissionActions');
const { MonitoringAction } = require('@actions/MonitoringAction');


module.exports = (Bot) => {
  Bot.action(/(grant_access|deny_access)/, async (ctx) => {
      await PermissionsAction(ctx)
  })

  Bot.action(/(grant_admin_access|deny_admin_access)/, async (ctx) => {
      await PermissionsAdminAction(ctx)
  })

  Bot.action(/(create_monitoring|delete_monitoring|refresh_monitoring|clear_monitoring)/, async (ctx) => {
      await MonitoringAction(ctx)
  })
}