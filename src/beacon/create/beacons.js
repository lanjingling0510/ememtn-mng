'use strict';
/* global AMap */

require('../../common/service.js');
require('../../poi/poi.js');
require('./beacons.service.js');
let angular = require('angular');

module.exports = angular.module('sanya.beacon.create', [
    'ui.router',
    'sanya.common.services',
    'sanya.beacons.service'
]).config(moduleConfig)
    .controller('NewBeaconController', NewBeaconController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('poi.beacons_new', {
        url: '/beacons/new',
        template: require('./new_beacon.html'),
        controller: 'NewBeaconController as scope'
    });
}


/* @ngInject */
function NewBeaconController($q, $rootScope, MapTool, BeaconsService, AlertService) {
    let vm = this;
    let localEditTool;
    let localMap;
    init();

    vm.createBeacon = createBeacon;

    function createBeacon(beacon) {
        BeaconsService.save(beacon).$promise
        .then(function () {
            AlertService.success('创建成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function init() {
        if (localEditTool) { localEditTool.close(); }
        localMap = MapTool.initMap(109.351295, 18.29292);

        vm.beacon = { };
        MapTool.circle.draw(localMap)
            .then(function(drawTool) {
                return $q(function (resolve) {
                    AMap.event.addListener(drawTool, "draw", function(e) {
                        drawTool.close();
                        resolve(e.obj);
                    });
                });
            }).then(function(shape) {
                vm.beacon.latitude = shape.getCenter().getLat();
                vm.beacon.longitude = shape.getCenter().getLng();
                vm.beacon.radius = shape.getRadius();

                AMap.event.addListener(shape, "change", function() {
                    if ($rootScope.$$phase !== '$apply' && $rootScope.$$phase !== '$digest') {
                        $rootScope.$apply(function () {
                            vm.beacon.latitude = shape.getCenter().getLat();
                            vm.beacon.longitude = shape.getCenter().getLng();
                            vm.beacon.radius = shape.getRadius();
                        });
                    }
                });

                return MapTool.circle.edit(localMap, shape);
            }).then(function (editTool) {
                localEditTool = editTool;
            }).catch(function (err) {
                AlertService.warning(err.data);
            });
    }
}
