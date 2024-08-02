//? CONFIG | STAGES


module.exports = [
    //* GLOBAL
    require('@scenes/StartScene'),

    //* TONIC
    require('@scenes/user/tonic/TonicScene'),
    require('@scenes/user/tonic/create/TonicCreateScene'),
    require('@scenes/user/tonic/status/TonicStatusScene'),
    require('@scenes/user/tonic/edits/TonicEditsScene'),
    require('@scenes/user/tonic/edits/pixel/TonicPixelScene'),
    require('@scenes/user/tonic/edits/keywords/TonicKeywordsScene'),
    require('@scenes/user/tonic/edits/callbacks/TonicСallbackScene'),
    require('@scenes/user/tonic/statistics/TonicStatisticsScene'),
    require('@scenes/user/tonic/statistics/general/TonicStatisticsScene'),
    require('@scenes/user/tonic/statistics/сompany/TonicCompanyScene'),
    require('@scenes/user/tonic/statistics/keywords/TonicKeywordsScene'),

    //* MEDIA
    require('@scenes/user/media/MediaScene'),
    require('@scenes/user/media/photo/MediaUnifierPhotoScene'),
    require('@scenes/user/media/video/MediaUnifierVideoScene'),

    //* GENERATORS
    require('@scenes/user/generators/GeneratorsScene'),
    require('@scenes/user/generators/cards/CardsScene'),

    //* USER
    require('@scenes/user/settings/SettingsScene'),
    require('@scenes/user/settings/sheet/SheetAddScene'),
    require('@scenes/user/settings/domain/DomainAddScene'),

    //* ADMIN
    require('@scenes/admin/AdminScene'),
    require('@scenes/admin/message/AdminMessageScene'),
    require('@scenes/admin/users/UsersScene'),
    require('@scenes/admin/users/add/UsersAddScene'),
    require('@scenes/admin/users/remove/UsersRemoveScene'),

    //* MONITORING
    require('@scenes/admin/monitoring/MonitoringScene'),
]