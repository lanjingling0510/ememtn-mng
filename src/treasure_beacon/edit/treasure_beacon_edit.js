require('../../common/service.js');
const angular = require('angular');
const config = require('../../config.json');

module.exports = angular.module('ememtn.treasure-beacon.edit', [
    'ui.router',
    'ememtn.common.services',
]).config(moduleConfig)
    .controller('TreasureBeaconEditController', TreasureBeaconEditController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('treasure-beacon-edit', {
        url: '/treasure-beacons/:treasureBeaconId',
        template: require('./treasure_beacon_edit.html'),
        controller: 'TreasureBeaconEditController as vm',
    });
}


/* @ngInject */
function TreasureBeaconEditController($stateParams, Restangular, AlertService) {
    const vm = this;
    const TreasureBeacon = Restangular.all('treasure-beacons');

    vm.updateTreasureBeacon = updateTreasureBeacon;
    vm.onFloorChange = onFloorChange;
    vm.onDrawEnd = onDrawEnd;

    vm.floors = config.floors.slice(1);

    (function init() {
        TreasureBeacon.get($stateParams.treasureBeaconId).then((treasureBeacon) => {
            vm.treasureBeacon = treasureBeacon;
            vm.floor = vm.floors.find((floor) => {
                return treasureBeacon.JCObjId === floor.JCObjId && treasureBeacon.JCObjMask === floor.JCObjMask;
            });
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    })();

    function updateTreasureBeacon(treasureBeacon) {
        if (vm.treasureBeacon.x === undefined || vm.treasureBeacon.y === undefined) {
            return AlertService.warning('尚未指定位置，请使用有方“绘制点”功能指定位置');
        }
        treasureBeacon.put().then(() => {
            AlertService.success('修改成功');
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function onFloorChange(floor) {
        vm.floor = floor;
        vm.treasureBeacon.JCObjId = floor.JCObjId;
        vm.treasureBeacon.JCObjMask = floor.JCObjMask;
    }

    function onDrawEnd(coordinates) {
        vm.treasureBeacon.x = coordinates[0];
        vm.treasureBeacon.y = coordinates[1];
    }
}
