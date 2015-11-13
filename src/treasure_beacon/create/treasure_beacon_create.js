require('../../common/service.js');
const angular = require('angular');
const config = require('../../config.json');
const ol = require('openlayers');

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
function TreasureBeaconCreateController(Restangular, AlertService) {
    const vm = this;
    const TreasureBeacon = Restangular.all('treasure-beacons');

    vm.createTreasureBeacon = createTreasureBeacon;
    vm.onFloorChange = onFloorChange;
    vm.onDrawEnd = onDrawEnd;
    vm.addDrawPointInteraction = addDrawPointInteraction;
    vm.onMapCreated = onMapCreated;

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
                        color: '#ffcc33',
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

    function onMapCreated(map) {
        vm._map = map;
    }
}
