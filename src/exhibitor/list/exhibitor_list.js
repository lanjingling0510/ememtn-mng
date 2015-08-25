require('../../common/service.js');
require('../../exhibition_area/virtual/exhibition_area_virtual.js');
const angular = require('angular');

module.exports = angular.module('ememtn.exhibitor.list', [
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
function ExhibitorListController($state, AlertService) {
    const vm = this;
    vm.editMode = editMode;

    vm.exhibitors = [
        { name: 'exhibitor 1', _id: 1 },
        { name: 'exhibitor 3', _id: 3 },
        { name: 'exhibitor 4', _id: 4 },
        { name: 'exhibitor 2', _id: 2 },
        { name: 'exhibitor 7', _id: 7 },
    ];

    function editMode(exhibitor) {
        $state.go('exhibition-hall-map.exhibition-area-virtual.exhibitor-list.exhibitor-inline-edit', {
            exhibitorId: exhibitor._id,
        });
    }
}
