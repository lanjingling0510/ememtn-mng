const angular = require('angular');

module.exports = angular.module('ememtn.stadium.list', [
    'ui.router',
    'restangular',
    'common.dropDown.directive',
])
    .config(moduleConfig)
    .controller('StadiumListController', StadiumListController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('stadium_list', {
        url: '/stadium_list',
        template: require('./stadium_list.html'),
        controller: 'StadiumListController as scope',
    });
}

/* @ngInject*/
function StadiumListController() {
    const vm = this;
}
