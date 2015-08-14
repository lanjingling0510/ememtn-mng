'use strict';
/* global AMap */

require('../../common/service.js');
require('./area_create.service.js');
let angular = require('angular');

module.exports = angular.module('sanya.area_create', [
    'ui.router',
    'sanya.common.services',
    'sanya.area_create.service'
]).config(moduleConfig)
    .controller('AreaCreateController', AreaCreateController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider
        .state('poi.area_create', {
            url: '/areas/new',
            template: require('./area_create.html'),
            controller: 'AreaCreateController as scope'
        });
}

/* @ngInject */
function AreaCreateController($q, $rootScope, MapTool, AreaCreateService, AlertService) {
    let vm = this;
    let localEditTool;
    let localMap;
    init();

    vm.createArea = createArea;

    function createArea(area) {
        AreaCreateService.save(area).$promise
        .then(function () {
            AlertService.success('创建成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function init() {
        if (localEditTool) { localEditTool.close(); }
        localMap = MapTool.initMap(109.351295, 18.29292);

        vm.area = { };
        MapTool.polygon.draw(localMap)
            .then(function(drawTool) {
                return $q(function (resolve) {
                    AMap.event.addListener(drawTool, "draw", function(e) {
                        drawTool.close();
                        resolve(e.obj);
                    });
                });
            }).then(function(shape) {
                vm.area.geoData = shape.getPath().map(function (item) {
                    return {
                        lat: item.getLat(),
                        lng: item.getLng()
                    };
                });
                vm.area.geoDataString = vm.area.geoData.map(function (item) {
                    return item.lat + ',' + item.lng;
                }).join(' ');

                AMap.event.addListener(shape, "change", function() {
                    if ($rootScope.$$phase !== '$apply' && $rootScope.$$phase !== '$digest') {
                        $rootScope.$apply(function () {
                            vm.area.geoData = shape.getPath().map(function (item) {
                                return {
                                    lat: item.getLat(),
                                    lng: item.getLng()
                                };
                            });
                            vm.area.geoDataString = vm.area.geoData.map(function (item) {
                                return item.lat + ',' + item.lng;
                            }).join(' ');
                        });
                    }
                });

                return MapTool.polygon.edit(localMap, shape);
            }).then(function (editTool) {
                localEditTool = editTool;
            }).catch(function (err) {
                AlertService.warning(err.data);
            });
    }
}
