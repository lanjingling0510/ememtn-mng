require('../../common/service.js');
require('../../exhibition_hall/map/exhibition_hall_map.js');
const angular = require('angular');

module.exports = angular.module('ememtn.beacon.list', [
    'ui.router',
    'sanya.common.services',
]).config(moduleConfig)
    .controller('BeaconListController', BeaconListController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibition-hall-map.beacon-list', {
        url: '/beacons',
        template: require('./beacon_list.html'),
        controller: 'BeaconListController as vm',
    });
}

/*@ngInject*/
function BeaconListController(AlertService) {
    const vm = this;
    vm.beacons = [{}];
}
