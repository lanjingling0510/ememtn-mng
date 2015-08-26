const angular = require('angular');

module.exports = angular.module('ememtn.exhibitor.edit', [
    'ui.router',
    'restangular',
]).config(moduleConfig)
    .controller('ExhibitorEditController', ExhibitorEditController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibitor-edit', {
        url: '/exhibitors/:exhibitorId',
        template: require('./exhibitor_edit.html'),
        controller: 'ExhibitorEditController as vm',
    });
}

/* @ngInject*/
function ExhibitorEditController() {
    const vm = this;
    vm.exhibitor = {
        _id: 'tfvyghn',
    };
}
