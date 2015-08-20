require('./app.less');

const angular = require('angular');
require('../../node_modules/amazeui/js/ui.dropdown.js');
require('../../node_modules/amazeui/js/ui.collapse.js');
require('../common/service.js');
require('../login/login.js');
require('../home/home.js');

require('../admin/list/admins.js');
require('../admin/register/register.js');

require('../tourist/list/tourists.js');
require('../group/list/groups.js');
//=====================================================
require('../a_sponsor/sponsor.js');
require('../a_stadium/intro/stadium_intro.js');
require('../a_stadium/list/stadium_list.js');
require('../a_stadium/detail/stadium_detail.js');
require('../b_exhibitionAct/list/exhibitionAct_list.js');
require('../b_exhibitionAct/create/exhibitionAct_create.js');
require('../b_exhibitionDist/exhibitionDist.js');
require('../d_news/list/news.js');
require('../d_news/create/news_create.js');
require('../d_information/list/information_list.js');

require('../e_posts/list/posts.js');
require('../e_posts/detail/posts_detail.js');
require('../e_suggest/suggest.js');
//=====================================================
require('../feedback/list/feedbacks.js');
require('../feedback/edit/feedback_edit.js');

require('../treasure_game_map/list/treasure_game_map_list.js');
require('../treasure_game_map/create/treasure_game_map_create.js');
require('../treasure_game/config/treasury_game.js');

require('../roulette_game/config/roulette_game.js');

require('../exhibition_hall/exhibition_hall.js');

require('../beacon/list/beacon_list.js');
require('../beacon/create/beacon_create.js');
require('../beacon/edit/beacon_edit.js');

require('../area/list/area_list.js');
require('../area/create/area_create.js');
require('../area/edit/area_edit.js');

require('../infrastructure/list/infrastructure_list.js');
require('../infrastructure/create/infrastructure_create.js');
require('../infrastructure/edit/infrastructure_edit.js');

module.exports = angular.module('ememtn', [
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
    'ememtn.sponsor',
    'ememtn.stadium',
    'ememtn.stadium.list',
    'ememtn.stadium.detail',
    'ememtn.exhibitionAct',
    'ememtn.exhibitionAct.create',
    'ememtn.exhibitionDist',
    'ememtn.posts',
    'ememtn.posts.detail',
    'ememtn.suggest',
    'ememtn.news',
    'ememtn.news.create',
    'ememtn.exhibition-hall',
    'ememtn.beacon.list',
    'ememtn.beacon.create',
    'ememtn.beacon.edit',
    'ememtn.area.list',
    'ememtn.area.create',
    'sanya.treasury_game',
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
