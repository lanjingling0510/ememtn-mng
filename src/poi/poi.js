'use strict';
/*global AMap*/

require('./poi.less');
require('../common/service.js');
let angular = require('angular');

module.exports = angular.module('sanya.poi', [
    'ui.router',
    'sanya.common.services'
]).config(moduleConfig)
    .controller('POIController', POIController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('poi', {
        url: '/poi',
        template: require('./poi.html'),
        controller: 'POIController as scope'
    });
}

/*@ngInject*/
function POIController($q, MapTool, AlertService) {
    let vm = this;
    let localMap;
    let localDrawTool;
    let localEditTool;

    vm.newPOI = function newPOI(poiCategory) {
        if (localDrawTool) { localDrawTool.close(); }
        if (localEditTool) { localEditTool.close(); }
        vm.currentPOI = {
            categoryId: poiCategory._id
        };
        MapTool[poiCategory.type].draw(localMap)
            .then(function(drawTool) {
                localDrawTool = drawTool;
                return $q(function (resolve) {
                    AMap.event.addListener(drawTool, "draw", function(e) {
                        //obj属性就是绘制完成的覆盖物对象
                        // vm.localShape = e.obj;
                        localDrawTool.close();
                        resolve(e.obj);
                    });
                });
            }).then(function(shape) {
                if (poiCategory.type === 'circle') {
                    vm.currentPOI.geoData = [[shape.getCenter().A, shape.getCenter().t]];
                    vm.currentPOI.radius = shape.getRadius();
                } else {
                    vm.currentPOI.geoData = shape.getPath().map(function (p) {
                        return [p.A, p.t];
                    });
                }

                vm.currentPOI.geoDataString = vm.currentPOI.geoData.map(function (d) {
                    return d.join(',');
                }).join(' ');

                AMap.event.addListener(shape, "change", function(e) {
                    if (vm.$root.$$phase !== '$apply' && vm.$root.$$phase !== '$digest') {
                        vm.$apply(function () {
                            if (poiCategory.type === 'circle') {
                                let center = e.target.getCenter();
                                vm.currentPOI.geoData = [[center.A, center.t]];
                                vm.currentPOI.radius = e.target.getRadius();
                            } else {
                                vm.currentPOI.geoData = e.target.getPath().map(function (p) {
                                    return [p.A, p.t];
                                });
                            }
                            vm.currentPOI.geoDataString = vm.currentPOI.geoData.map(function (d) {
                                return d.join(',');
                            }).join(' ');
                        });
                    }
                });

                return MapTool[poiCategory.type].edit(localMap, shape);
            }).then(function (editTool) {
                localEditTool = editTool;
            }).catch(function (err) {
                AlertService.warning(err.data);
            });
    };

    vm.closeCircleTool = function closeCircleTool() {
        localDrawTool.close();
    };

    (function init() {
        vm.poiCategories = [];
        vm.poi = [];

        localMap = MapTool.initMap(109.351295, 18.29292);
    }());
}
