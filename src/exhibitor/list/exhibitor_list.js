require('../../common/service.js');
require('../../exhibition_area/virtual/exhibition_area_virtual.js');
const angular = require('angular');

module.exports = angular.module('ememtn.exhibitor.listtests', [
    'ui.router',
    'sanya.common.services',
    'ememtn.exhibition-area.virtual',
]).config(moduleConfig)
    .controller('ExhibitorListController', ExhibitorListController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibition-hall-map.exhibition-area-virtual.exhibitor-list', {
        url: '/exhibitors',
        template: require('./exhibitor_list.html'),
        controller: 'ExhibitorListController as vm',
    });
}

/*@ngInject*/
function ExhibitorListController(AlertService) {
    const vm = this;
    vm.exhibitors = [{}];
}
