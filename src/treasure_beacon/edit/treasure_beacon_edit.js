require('../../common/service.js');
const angular = require('angular');
const config = require('../../config.json');
const ol = require('openlayers');

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
    vm.onMapCreated = onMapCreated;
    vm.onDrawEnd = onDrawEnd;
    vm.addDrawPointInteraction = addDrawPointInteraction;

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

    function onMapCreated(map) {
        vm._map = map;
    }

    function _drawPoint(map) {
        const features = new ol.Collection();

        const featureOverlay = new ol.layer.Vector({
            source: new ol.source.Vector({ features: features }),
            style: new ol.style.Style({
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)',
                }),
                stroke: new ol.style.Stroke({
                    color: '#ffcc33',
                    width: 2,
                }),
                image: new ol.style.Circle({
                    radius: 7,
                    fill: new ol.style.Fill({
                        // color: '#ffcc33',
                        color: '#00ff00',
                    }),
                }),
            }),
            zIndex: 110,
        });

        const interaction = new ol.interaction.Draw({
            features: features,
            type: 'Point',
        });

        interaction.on('drawend', (event) => {
            const feature = event.feature;
            const geometry = feature.getGeometry();
            const coordinates = ol.proj.transform(geometry.getCoordinates(), 'EPSG:4326', 'JCMap');
            map.removeInteraction(interaction);
            onDrawEnd(coordinates);
        });

        map.addLayer(featureOverlay);
        map.addInteraction(interaction);
    }

    function addDrawPointInteraction() {
        if (!vm._map) {
            return AlertService.warning('地图尚未初始化，请稍后再试');
        }
        _drawPoint(vm._map);
    }
}
