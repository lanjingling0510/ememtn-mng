const angular = require('angular');

module.exports = angular.module('ememtn.organizer-custom.list', [
    'ui.router',
    'restangular',
    'common.dropDown.directive',
])
    .config(moduleConfig)
    .controller('OrganizerCustomListController', OrganizerCustomListController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('organizer-custom-list', {
        url: '/organizer-customs',
        template: require('./organizer_custom_list.html'),
        controller: 'OrganizerCustomListController as vm',
    });
}

/* @ngInject*/
function OrganizerCustomListController() {
    const vm = this;
}
