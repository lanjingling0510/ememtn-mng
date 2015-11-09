require('../../common/service.js');
require('../../_directives/emei_map');
require('../../_directives/floor_button_group');
const config = require('../../config.json');
const angular = require('angular');

module.exports = angular.module('ememtn.treasure-beacon.batch', [
    'ui.router',
    'ememtn.common.services',
    'jc.emei.map.directive',
    'jc.directive.floor-button-group',
]).config(moduleConfig)
    .controller('TreasureBeaconBatchController', TreasureBeaconBatchController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('treasure-beacon-batch', {
        url: '/treasure-beacons/_batch',
        template: require('./treasure_beacon_batch.html'),
        controller: 'TreasureBeaconBatchController as vm',
    });
}

/* @ngInject */
function TreasureBeaconBatchController($timeout, $q, $scope, Restangular, AlertService) {
    const vm = this;
    const TreasureBeacon = Restangular.all('treasure-beacons');
    vm.searchTreasureBeacons = searchTreasureBeacons;
    vm.selectedTreasureBeacons = selectedTreasureBeacons;
    vm.selecteAllTreasureBeacons = selecteAllTreasureBeacons;
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

    function removeTreasureBeacon(treasureBeacon) {
        return treasureBeacon.remove().then(() => {
            const index = vm.treasureBeacons.indexOf(treasureBeacon);
            vm.treasureBeacons.splice(index, 1);
        });
    }

    function selectedTreasureBeacons() {
        const selected = vm.treasureBeacons.filter(treasureBeacon => treasureBeacon._checked);
        $q.all(selected.map(removeTreasureBeacon)).then(() => {
            AlertService.success('删除完成');
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function selecteAllTreasureBeacons() {
        vm.treasureBeacons.forEach((treasureBeacon) => {
            treasureBeacon._checked = true;
        });
    }
}
