const angular = require('angular');

module.exports = angular.module('ememtn.organizer-custom.create', [
    'ui.router',
    'restangular',
    'common.dropDown.directive',
])
    .config(moduleConfig)
    .controller('OrganizerCustomCreateController', OrganizerCustomCreateController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('organizer-custom-create', {
        url: '/organizer-customs/_create',
        template: require('./exhibitor_edit.html'),
        controller: 'OrganizerCustomCreateController as vm',
    });
}

/* @ngInject*/
function OrganizerCustomCreateController() {
    const vm = this;
}
