require('./app.less');

const angular = require('angular');

require('../common/service.js');
require('../login/login.js');
require('../home/home.js');

require('../admin/list/admins.js');
require('../admin/register/register.js');

require('../tourist/list/tourists.js');
require('../group/list/groups.js');

require('../feedback_category/list/feedback_categories.js');
require('../feedback_category/create/feedback_category.js');
require('../feedback_category/edit/categories_edit.js');

require('../feedback/list/feedbacks.js');
require('../feedback/edit/feedback_edit.js');

require('../platform/list/platform.js');
require('../platform/detail/platform_detail.js');

require('../poi/poi.js');
require('../beacon/list/beacons.js');
require('../beacon/create/beacons.js');
require('../beacon/edit/beacons.js');

require('../area/list/areas_list.js');
require('../area/create/area_create.js');
require('../area/edit/area_edit.js');

require('../prize_type/list/prize_types.js');
require('../prize_type/create/prize_types_create.js');
require('../prize_type/edit/prize_types_edit.js');
require('../prize/exchange/prize_exchange.js');

require('../treasure_type/list/treasure_types.js');
// require('../treasure_type/create/treasure_types_create.js');
// require('../treasure_type/edit/treasure_type_edit.js');

require('../treasure_game_map/list/treasure_game_map_list.js');
require('../treasure_game_map/create/treasure_game_map_create.js');
require('../treasure_game/config/treasury_game.js');

require('../roulette_game/config/roulette_game.js');

module.exports = angular.module('sanya', [
    'ui.router',
    'ui.bootstrap',
    'angular-storage',
    'sanya.login',
    'sanya.home',
    'sanya.admins',
    'sanya.admins.register',
    'sanya.tourists',
    'sanya.groups',
    'sanya.feedbacks',
    'sanya.feedback_categories',
    'sanya.feedback_category',
    'sanya.feedback_categories_edit',
    'ememtn.platform',
    'ememtn.platform.detail',
    'sanya.poi',
    'sanya.beacons',
    'sanya.beacon.create',
    'sanya.beacon.edit',
    'sanya.areas_list',
    'sanya.area_create',
    'sanya.treasury_game',
    'sanya.prize_types',
    'sanya.prize_types_create',
    'sanya.prize_types_edit',
    'sanya.prize.exchange',
    'sanya.treasure_types',
    'sanya.treasure_game_map_list',
    'sanya.treasure_game_map_create',
    'sanya.feedback_edit',
    'sanya.roulette_game',
]).config(moduleConfig).run(moduleRun);

/* @ngInject */
function moduleConfig($urlRouterProvider, $locationProvider, RestangularProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
    RestangularProvider.setBaseUrl('/apis');
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
