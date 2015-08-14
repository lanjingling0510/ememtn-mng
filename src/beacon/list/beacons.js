'use strict';
/* global AMap */

require('../../common/service.js');
require('../../poi/poi.js');
require('./beacons.service.js');
let angular = require('angular');

module.exports = angular.module('sanya.beacons', [
    'ui.router',
    'sanya.common.services',
    'sanya.beacons.service'
]).config(moduleConfig)
    .controller('BeaconsController', BeaconsController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('poi.beacons', {
        url: '/beacons',
        template: require('./beacons.html'),
        controller: 'BeaconsController as scope'
    });
}

/*@ngInject*/
function BeaconsController($q, $rootScope, MapTool, BeaconsService, AlertService) {
    let vm = this;
    vm.showAllBeacons = showAllBeacons;
    vm.hideAllBeacons = hideAllBeacons;
    vm.removeBeacon = removeBeacon;
    let localMap;

    initController();

    function showAllBeacons() {
        vm.beacons.forEach(function (beacon) {
            if (beacon._preview) { return beacon._preview.show(); }
            let instance = new AMap.Circle({
                center: new AMap.LngLat(beacon.longitude, beacon.latitude),// 圆心位置
                radius: beacon.radius, //半径
                strokeColor: "#F33", //线颜色
                // strokeOpacity: 1, //线透明度
                // strokeWeight: 3, //线粗细度
                fillColor: "#ee2200", //填充颜色
                // fillOpacity: 0.35//填充透明度
            });
            instance.setMap(localMap);
            beacon._preview = instance;
        });
        vm.beacons._shown = true;
    }

    function hideAllBeacons() {
        vm.beacons.forEach(function (beacon) {
            beacon._preview.hide();
        });
        vm.beacons._shown = false;
    }

    function removeBeacon(beacon, index) {
        BeaconsService.remove({ beaconId: beacon._id }).$promise
        .then(function () {
            if (vm.beacons[index]._preview) {
                vm.beacons[index]._preview.setMap(null);
            }
            vm.beacons.splice(index, 1);
            AlertService.success('删除成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function initController() {
        localMap = MapTool.initMap(109.351295, 18.29292);

        BeaconsService.query().$promise
        .then(function (beacons) {
            vm.beacons = beacons;
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }
}
