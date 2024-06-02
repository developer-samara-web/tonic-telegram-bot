//? STAGES.JS

module.exports = [
    // Start
    require('@scenes/StartScene'),

    // Admin
    require('@scenes/admin/AdminScene'),

    // Msg
    require('@scenes/admin/message/AdminMessageScene'),

    // Users
    require('@scenes/admin/users/UsersScene'),
    require('@scenes/admin/users/add/UsersAddScene'),
    require('@scenes/admin/users/remove/UsersRemoveScene'),

    // Monitoring
    require('@scenes/admin/monitoring/MonitoringScene.js'),
]