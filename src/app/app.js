require('./app.less');
const angular = require('angular');
require('../../node_modules/amazeui/js/ui.dropdown.js');
require('../../node_modules/amazeui/js/ui.collapse.js');
require('../../node_modules/amazeui/js/ui.datepicker.js');
require('../common/service.js');
require('../login/login.js');
require('../heat_map/show/heat_map_show.js');

require('../admin/list/admins.js');
require('../admin/register/register.js');
require('../admin/password_change/admin_password_change.js');

require('../attendant/list/attendant_list.js');
require('../attendant/create/attendant_create.js');

require('../tourist/list/tourist_list.js');
require('../tourist/detail/tourist_detail.js');

require('../organizer/setting/organizer_setting.js');

require('../pavilion/setting/pavilion_setting.js');
require('../pavilion/map/pavilion_map.js');
require('../pavilion/map_test/pavilion_map.js');
require('../pavilion/dist/pavilion_dist.js');

require('../exhibition/list/exhibition_list.js');
require('../exhibition/create/exhibition_create.js');

require('../news/list/news_list.js');
require('../news/create/news_create.js');
require('../news/edit/news_edit.js');

require('../post/list/post_list.js');
require('../post/detail/post_detail.js');

require('../feedback/list/feedback_list.js');
require('../feedback/edit/feedback_edit.js');

// require('../treasure_map/list/treasure_map_list.js');
// require('../treasure_map/create/treasure_map_create.js');

require('../treasure_game/list/treasury_game_list.js');
require('../roulette_game/config/roulette_game.js');

require('../treasure_point/list/treasure_point_list.js');
require('../treasure_point/inline_create/treasure_point_inline_create.js');

require('../info/list/info_list.js');
require('../info/create/info_create.js');
require('../info/edit/info_edit.js');

require('../organizer_custom/list/organizer_custom_list.js');
require('../organizer_custom/create/organizer_custom_create.js');

require('../message/list/message_list.js');
require('../message/push/message_push.js');

require('../notification/list/notification_list.js');
require('../notification/push/notification_push.js');

require('../page_structure/setting/page_structure_setting.js');

// require('../prize/exchange/prize_exchange.js');

require('../exhibitor/list/exhibitor_list.js');
require('../exhibitor/create/exhibitor_create.js');
require('../exhibitor/edit/exhibitor_edit.js');
require('../exhibitor/inline_edit/exhibitor_inline_edit.js');
require('../exhibitor/inline_create/exhibitor_inline_create.js');
require('../exhibitor/guide/exhibitor_guide.js');
require('../exhibitor/batch/exhibitor_batch.js');

// require('../treasure_area/list/treasure_area_list.js');
// require('../treasure_area/batch/treasure_area_batch.js');
// require('../treasure_area/inline_create/treasure_area_inline_create.js');
// require('../treasure_area/inline_edit/treasure_area_inline_edit.js');
// require('../treasure_area/virtual/treasure_area_virtual.js');

require('../prize_type/create/prize_type_create.js');
require('../prize_type/list/prize_type_list.js');
require('../prize_type/edit/prize_type_edit.js');

require('../exhibit/create/exhibit_create.js');
require('../exhibit/list/exhibit_list.js');

require('../treasure_type/create/treasure_type_create.js');
require('../treasure_type/list/treasure_type_list.js');
require('../treasure_type/edit/treasure_type_edit.js');

require('../apk/ios/apk_ios.js');
require('../apk/android/apk_android.js');

require('../manager/create/manager_create.js');
require('../manager/list/manager_list.js');
require('../manager/edit/manager_edit.js');

require('../treasure_beacon/list/treasure_beacon_list.js');
require('../treasure_beacon/create/treasure_beacon_create.js');
require('../treasure_beacon/batch/treasure_beacon_batch.js');
require('../treasure_beacon/edit/treasure_beacon_edit.js');

module.exports = angular.module('ememtn', [
    'ui.router',
    'ui.bootstrap',
    'angular-storage',
    'ememtn.login',
    'ememtn.heat-map.show',
    'ememtn.admins',
    'ememtn.admins.register',
    'ememtn.admins.password-change',
    'ememtn.tourist.list',
    'ememtn.tourist.detail',
    // 'ememtn.treasure-area.list',
    // 'ememtn.treasure-area.batch',
    // 'ememtn.treasure-area.inline-create',
    // 'ememtn.treasure-area.inline-edit',
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
    'ememtn.news.edit',
    'ememtn.treasure-point.list',
    'ememtn.treasure-point.inline-create',
    'ememtn.info.list',
    'ememtn.info.create',
    'ememtn.info.edit',
    'ememtn.message.list',
    'ememtn.message.push',
    'ememtn.notification.list',
    'ememtn.notification.push',
    'ememtn.organizer-custom.list',
    'ememtn.organizer-custom.create',
    'ememtn.page-structure.setting',
    'ememtn.exhibitor.list',
    'ememtn.exhibitor.guide',
    'ememtn.exhibitor.inline-create',
    'ememtn.exhibitor.inline-edit',
    'ememtn.exhibitor.create',
    'ememtn.exhibitor.edit',
    'ememtn.exhibitor.batch',
    'ememtn.exhibit.create',
    'ememtn.exhibit.list',
    // 'ememtn.prize.exchange',
    'ememtn.treasury-game.list',
    // 'ememtn.treasure_map.list',
    // 'ememtn.treasure_map.create',
    'ememtn.roulette-game.config',
    'ememtn.treasure-type.list',
    'ememtn.apk.ios',
    'ememtn.apk.android',
    'ememtn.pavilion.map-test',
    'ememtn.manager.create',
    'ememtn.manager.list',
    'ememtn.manager.edit',
    'ememtn.prize-type.create',
    'ememtn.prize-type.list',
    'ememtn.prize-type.edit',
    'ememtn.treasure-beacon.list',
    'ememtn.treasure-beacon.create',
    'ememtn.treasure-beacon.batch',
    'ememtn.treasure-beacon.edit',
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

    $rootScope.logout = logout;

    function logout() {
        delete $rootScope.auth;

        store.remove('auth.profile');
        store.remove('auth.accessToken');

        $state.go('login');
    }
}
