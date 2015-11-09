require('../../common/service.js');
const angular = require('angular');
const config = require('../../config.json');

module.exports = angular.module('ememtn.treasure-beacon.create', [
    'ui.router',
    'ememtn.common.services',
]).config(moduleConfig)
    .controller('TreasureBeaconCreateController', TreasureBeaconCreateController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('treasure-beacon-create', {
        url: '/treasure-beacons/_create',
        template: require('./treasure_beacon_create.html'),
        controller: 'TreasureBeaconCreateController as vm',
    });
}


/* @ngInject */
function TreasureBeaconCreateController($scope, Restangular, AlertService) {
    const vm = this;
    const TreasureBeacon = Restangular.all('treasure-beacons');

    vm.createTreasureBeacon = createTreasureBeacon;
    vm.onFloorChange = onFloorChange;
    vm.onDrawEnd = onDrawEnd;

    vm.floors = config.floors.slice(1);
    vm.floor = vm.floors[0];
    vm.treasureBeacon = {
        JCObjId: vm.floor.JCObjId,
        JCObjMask: vm.floor.JCObjMask,
    };

    function createTreasureBeacon(treasureBeacon) {
        if (vm.treasureBeacon.x === undefined || vm.treasureBeacon.y === undefined) {
            return AlertService.warning('尚未指定位置，请使用有方“绘制点”功能指定位置');
        }
        TreasureBeacon.post(treasureBeacon).then(() => {
            AlertService.success('创建成功');
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
