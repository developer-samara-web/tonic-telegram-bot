//? STAGES.JS

module.exports = [
    // Start
    require('@scenes/StartScene'),

    // Admin
    require('@scenes/admin/AdminScene'),

    // Users
    require('@scenes/admin/users/UsersScene'),
    require('@scenes/admin/users/add/UsersAddScene'),
    require('@scenes/admin/users/remove/UsersRemoveScene')
]