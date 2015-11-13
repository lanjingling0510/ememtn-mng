require('./treasure_beacon_list.less');
require('../../common/service.js');
require('../../_directives/emei_map');
require('../../_directives/floor_button_group');
const config = require('../../config.json');
const angular = require('angular');
const ol = require('openlayers');

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
    vm.onMapCreated = onMapCreated;
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
                renderTreasureBeacons(vm._map, vm.treasureBeacons);
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

    function formatFeature(treasureBeacon) {
        return {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [treasureBeacon.x, treasureBeacon.y],
            },
        };
    }

    function formatData(treasureBeacons) {
        return {
            type: 'FeatureCollection',
            features: treasureBeacons.map(formatFeature),
        };
    }

    function renderTreasureBeacons(map, treasureBeacons) {
        if (!map || !treasureBeacons) { return; }
        const source = new ol.source.Vector({
            features: (new ol.format.GeoJSON()).readFeatures(formatData(treasureBeacons)),
        });
        const rgba = '#00ff00';
        const style = new ol.style.Style({
            fill: new ol.style.Fill({
                color: rgba,
            }),
            stroke: new ol.style.Stroke({
                color: rgba,
                width: 2,
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: rgba,
                }),
            }),
        });
        const layer = new ol.layer.Vector({
            source: source,
            zIndex: 50,
            style: style,
        });
        map.addLayer(layer);
    }

    function onMapCreated(map) {
        vm._map = map;
        renderTreasureBeacons(vm._map, vm.treasureBeacons);
    }
}
