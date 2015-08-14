'use strict';
/* global AMap */

require('../../common/service.js');
require('./areas_list.service.js');
let angular = require('angular');

module.exports = angular.module('sanya.areas_list', [
    'ui.router',
    'sanya.common.services',
    'sanya.areas_list.service'
]).config(moduleConfig)
    .controller('AreasController', AreasController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('poi.areas', {
        url: '/areas',
        template: require('./areas_list.html'),
        resolve: {
            areas: fetchAllAreas
        },
        controller: 'AreasController as scope'
    });
}

/* @ngInject */
function fetchAllAreas(AreasListService) {
    return AreasListService.query().$promise;
}

/*@ngInject*/
function AreasController($q, MapTool, AreasListService, AlertService, areas) {
    let vm = this;
    vm.areas = areas;
    vm.showAllAreas = showAllAreas;
    vm.hideAllAreas = hideAllAreas;
    vm.removeArea = removeArea;
    vm.disableArea = disableArea;
    vm.enableArea = enableArea;
    let localmap = MapTool.initMap(109.351295, 18.29292);

    function showAllAreas() {
        vm.areas.forEach(function (area) {
            if (area._preview) { return area._preview.show(); }

            let polygonArr = area.geoData.map(function (item) {
                return new AMap.LngLat(item.lng, item.lat);
            });

            let instance = new AMap.Polygon({
                path: polygonArr
            });

            instance.setMap(localmap);
            area._preview = instance;
        });
        vm.areas._shown = true;
    }

    function hideArea(area) {
        if (area._preview) {
            area._preview.hide();
        }
    }

    function hideAllAreas() {
        vm.areas.forEach(hideArea);
        vm.areas._shown = false;
    }

    function removePreview(area) {
        if (area._preview) {
            area._preview.setMap(null);
        }
    }

    function removeArea(area, index) {
        area.$remove()
        .then(function () {
            removePreview(area);
            vm.areas.splice(index, 1);
            AlertService.success('删除成功');
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function disableArea(area) {
        AreasListService.disable({ _id: area._id }).$promise.then(function () {
            hideArea(area);
            area.status = 'disabled';
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function enableArea(area) {
        AreasListService.enable({ _id: area._id }).$promise.then(function () {
            // hideArea(area);
            area.status = 'enabled';
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }
}
