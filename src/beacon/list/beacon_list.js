require('../../common/service.js');
require('../../exhibition_area/virtual/exhibition_area_virtual.js');
const angular = require('angular');

module.exports = angular.module('ememtn.beacon.list', [
    'ui.router',
    'ememtn.common.services',
]).config(moduleConfig)
    .controller('BeaconListController', BeaconListController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibition-hall-map.exhibition-area-virtual.beacon-list', {
        url: '/beacons',
        template: require('./beacon_list.html'),
        controller: 'BeaconListController as vm',
    });
}

/*@ngInject*/
function BeaconListController($state, AlertService) {
    const vm = this;
    vm.editMode = editMode
    vm.beacons = [
        {
            name: 'edrftgyh1',
        },
        {
            name: 'edrftgyh2',
        },
        {
            name: 'edrftgyh3',
        },
        {
            name: 'edrftgyh4',
        },
    ];

    function editMode(beacon) {
        $state.go('exhibition-hall-map.exhibition-area-virtual.beacon-list.beacons-inline-edit', {
            beaconId: beacon.name,
        });
    }
}
