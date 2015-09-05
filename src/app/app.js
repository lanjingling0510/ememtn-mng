require('./app.less');

const angular = require('angular');
require('../../node_modules/amazeui/js/ui.dropdown.js');
require('../../node_modules/amazeui/js/ui.collapse.js');
require('../../node_modules/amazeui/js/ui.datepicker.js');
require('../common/service.js');
require('../login/login.js');
require('../home/home.js');

require('../admin/list/admins.js');
require('../admin/register/register.js');

require('../attendant/list/attendant_list.js');
require('../attendant/create/attendant_create.js');

require('../tourist/list/tourist_list.js');
require('../tourist/detail/tourist_detail.js');

require('../organizer/setting/organizer_setting.js');

require('../pavilion/setting/pavilion_setting.js');
require('../pavilion/map/pavilion_map.js');
require('../pavilion/dist/pavilion_dist.js');

require('../exhibition/list/exhibition_list.js');
require('../exhibition/create/exhibition_create.js');

require('../news/list/news_list.js');
require('../news/create/news_create.js');

require('../post/list/post_list.js');
require('../post/detail/post_detail.js');

require('../feedback/list/feedback_list.js');
require('../feedback/edit/feedback_edit.js');

require('../treasure_game_map/list/treasure_game_map_list.js');
require('../treasure_game_map/create/treasure_game_map_create.js');

require('../treasure_game/config/treasury_game_config.js');
require('../roulette_game/config/roulette_game_config.js');

require('../beacon/list/beacon_list.js');
require('../beacon/inline_edit/beacon_inline_edit.js');

require('../area/list/area_list.js');
require('../area/create/area_create.js');
require('../area/edit/area_edit.js');

require('../info/list/info_list.js');
require('../info/create/info_create.js');

require('../organizer_custom/list/organizer_custom_list.js');
require('../organizer_custom/create/organizer_custom_create.js');

require('../message/list/message_list.js');
require('../message/push/message_push.js');

require('../notification/list/notification_list.js');
require('../notification/push/notification_push.js');

require('../page_structure/setting/page_structure_setting.js');

require('../prize/exchange/prize_exchange.js');

require('../exhibitor/list/exhibitor_list.js');
require('../exhibitor/batch/exhibitor_batch.js');
require('../exhibitor/edit/exhibitor_edit.js');
require('../exhibitor/inline_edit/exhibitor_inline_edit.js');
require('../exhibitor/inline_create/exhibitor_inline_create.js');
// require('../exhibitor/import/exhibitor_import.js');
require('../exhibitor/guide/exhibitor_guide.js');

require('../exhibition_area/list/exhibition_area_list.js');
require('../exhibition_area/batch/exhibition_area_batch.js');
require('../exhibition_area/inline_create/exhibition_area_inline_create.js');
require('../exhibition_area/inline_edit/exhibition_area_inline_edit.js');
require('../exhibition_area/virtual/exhibition_area_virtual.js');

require('../exhibit/create/exhibit_create.js');
require('../exhibit/list/exhibit_list.js');

module.exports = angular.module('ememtn', [
    'ui.router',
    'ui.bootstrap',
    'angular-storage',
    'ememtn.login',
    'ememtn.home',
    'ememtn.admins',
    'ememtn.admins.register',
    'ememtn.tourist.list',
    'ememtn.tourist.detail',
    'ememtn.exhibition-area.list',
    'ememtn.exhibition-area.batch',
    'ememtn.exhibition-area.inline-create',
    'ememtn.exhibition-area.inline-edit',
    'ememtn.attendant.list',
    'ememtn.attendant.create',
    'ememtn.feedback.list',
    'ememtn.organizer.setting',
    'ememtn.pavilion.setting',
    'ememtn.pavilion.dist',
    'ememtn.exhibition.list',
    'ememtn.exhibition.create',
    'ememtn.post.list',
    'ememtn.post.detail',
    'ememtn.news.list',
    'ememtn.news.create',
    'ememtn.beacon.list',
    'ememtn.beacon.inline-edit',
    'ememtn.area.list',
    'ememtn.area.create',
    'ememtn.info.list',
    'ememtn.info.create',
    'ememtn.message.list',
    'ememtn.message.push',
    'ememtn.notification.list',
    'ememtn.notification.push',
    'ememtn.organizer-custom.list',
    'ememtn.organizer-custom.create',
    'ememtn.page-structure.setting',
    'ememtn.exhibitor.list',
    'ememtn.exhibitor.batch',
    'ememtn.exhibitor.guide',
    'ememtn.exhibitor.inline-create',
    'ememtn.exhibitor.inline-edit',
    'ememtn.exhibitor.edit',
    'ememtn.exhibit.create',
    'ememtn.exhibit.list',
    'ememtn.prize.exchange',
    'ememtn.treasury_game.config',
    'ememtn.treasure_game_map.list',
    'ememtn.treasure_game_map.create',
    'ememtn.roulette_game.config',
]).config(moduleConfig).run(moduleRun);

/* @ngInject */
function moduleConfig($urlRouterProvider, $locationProvider, RestangularProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
    RestangularProvider.setBaseUrl('/apis');
    RestangularProvider.setRestangularFields({ id: '_id' });
}

/* @ngInject */
function moduleRun($rootScope, $location, store) {
    if (!$rootScope.auth || !$rootScope.auth.profile || !$rootScope.auth.accessToken) {
        if (store.get('auth.profile') && store.get('auth.accessToken')) {
            $rootScope.auth = {
                profile: store.get('auth.profile'),
                accessToken: store.get('auth.accessToken'),
            };
            return null;
        }
    }
}
