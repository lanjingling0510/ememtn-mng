require('./treasure_beacon_list.less');
require('../../common/service.js');
require('../../_directives/emei_map');
require('../../_directives/floor_button_group');
const config = require('../../config.json');
const angular = require('angular');

module.exports = angular.module('ememtn.treasure-beacon.list', [
    'ui.router',
    'ememtn.common.services',
    'jc.emei.map.directive',
    'jc.directive.floor-button-group',
]).config(moduleConfig)
    .controller('TreasureBeaconListController', TreasureBeaconListController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('treasure-beacon-list', {
        url: '/treasure-beacons',
        template: require('./treasure_beacon_list.html'),
        controller: 'TreasureBeaconListController as vm',
    });
}

/* @ngInject */
function TreasureBeaconListController($timeout, $scope, Restangular, AlertService) {
    const vm = this;
    const TreasureBeacon = Restangular.all('treasure-beacons');
    vm.searchTreasureBeacons = searchTreasureBeacons;
    vm.onFloorChange = onFloorChange;
    vm.floors = config.floors.slice(1);
    vm.floor = vm.floors[0];
    vm.query = {
        page: 1,
        pageSize: 16,
        total: 0,
    };

    searchTreasureBeacons(vm.query, 0);

    let searchTimer;
    function searchTreasureBeacons(query = {}, delay = 200) {
        $timeout.cancel(searchTimer);
        searchTimer = $timeout(() => {
            TreasureBeacon.getList(query).then((treasureBeacons) => {
                vm.query.total = treasureBeacons[0];
                vm.treasureBeacons = treasureBeacons.slice(1);
            }).catch((err) => {
                AlertService.warning(err.data);
            });
        }, delay);
    }

    function onFloorChange(floor) {
        vm.floor = floor;
        vm.query.JCObjId = floor.JCObjId;
        vm.query.JCObjMask = floor.JCObjMask;
        searchTreasureBeacons(vm.query, 0);
    }
}
