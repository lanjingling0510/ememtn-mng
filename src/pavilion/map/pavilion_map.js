require('./pavilion_map.less');
require('../../common/service.js');
require('./pavilion_map.service.js');
require('./pavilion_map.directive.js');
require('../../_directives/floor_dropdown');
const $ = require('jquery');
const config = require('../../config.json');
const canvas = require('./pavilion_canvas.js');
const angular = require('angular');

module.exports = angular.module('ememtn.pavilion.map', [
    'ui.router',
    'ememtn.common.services',
    'ememtn.pavilion.map.service',
    'ememtn.pavilion.map.directive',
    'jc.directive.floor-dropdown',
]).config(moduleConfig)
    .controller('PavilionMapController', PavilionMapController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('pavilion-map', {
        url: '/pavilion_map',
        template: require('./pavilion_map.html'),
        controller: 'PavilionMapController as vm',
        resolve: {
            maps: fetchMapProfiles,
        },
    });
}

/* @ngInject */
function fetchMapProfiles(MapService) {
    return MapService.MapProfile.query().$promise;
}

function getProfileId(map) {
    return map.JCObjId + ':' + map.JCObjMask;
}

// function destructureProfileId(profileId) {
//     const [JCObjId, JCObjMask] = profileId.split(':');
//     return {
//         JCObjId: JCObjId,
//         JCObjMask: JCObjMask,
//     };
// }

/* @ngInject */
function PavilionMapController($timeout, $q, $stateParams, $scope, maps, MapService, MapPreviewService, Restangular, AlertService) {
    const vm = this;
    // vm.maps = maps;
    vm.floors = config.floors.slice(1);
    vm.floor = vm.floors[0];
    vm.maps = config.floors.slice(1);
    vm.map = vm.maps[0];
    vm.isSelect = false;
    fetchMap(vm.map);
    vm.fetchMap = fetchMap;
    vm.fetchLayers = fetchLayers;
    vm.fetchLayer = fetchLayer;
    vm.fetchFeatures = fetchFeatures;

    $scope.$watch('vm.positionStr', function (newValue) {
        $scope.$broadcast('draw-position-change', {
            position: newValue,
        });
    });

    $scope.$on('get-current-map', () => {
        $scope.$broadcast('current-map', {
            map: vm._map,
        });
    });

    function fetchLayers(profileId) {
        MapService.MapLayer.query({
            profileId: profileId,
        }).$promise.then(function (layers) {
            $scope.map.layers = layers;
        }).catch(function (err) {
            AlertService.warning(err.data || err.statusText);
        });
    }

    function fetchLayer(JCLayerName) {
        MapService.MapLayer.get({
            profileId: vm.params.profileId,
            JCLayerName: JCLayerName,
        }).$promise.then(function (layer) {
            $scope.map.layers[layer.JCLayerName] = layer;
        }).catch(function (err) {
            AlertService.warning(err.data || err.statusText);
        });
    }

    function fetchFeatures(profileId, JCLayerName) {
        MapService.Beacon.query({
            profileId: profileId,
            JCLayerName: JCLayerName,
        }).$promise.then(function (features) {
            $scope.map.layers[JCLayerName].features = features;
        }).catch(function (err) {
            AlertService.warning(err.data || err.statusText);
        });
    }

    function fetchMap(mapProfile) {
        const profileId = getProfileId(mapProfile);
        const map = {};
        const parts = profileId.split(':');
        const JCObjId = parts[0];
        const JCObjMask = parts[1];

        MapService.MapProfile.get({
            profileId: profileId,
        }).$promise.then(function (profile) {
            $timeout(() => {
                map.profile = profile;
            }, 0);
            return MapService.MapLayer.query({
                profileId: profileId,
                JCObjId: JCObjId,
                JCObjMask: JCObjMask,
            }).$promise;
        }).then(function (layers) {
            layers.forEach(function (layer) {
                const JCLayerName = layer.JCName;

                layer.BKFields = layer.JCFields.split(' ').map(function (field) {
                    const pats = field.split(',');
                    return {
                        name: pats[0],
                        type: pats[1],
                    };
                });

                layers[JCLayerName] = layer;
            });
            map.layers = layers;

            const fetchFeaturesArray = layers.map(function (layer) {
                return MapService.MapFeature.query({
                    profileId: profileId,
                    JCObjId: JCObjId,
                    JCObjMask: JCObjMask,
                    JCLayerName: layer.JCName,
                }).$promise;
            });

            return $q.all(fetchFeaturesArray);
        }).then(function (featuresArray) {
            map.layers = map.layers.map(function (layer, index) {
                const features = featuresArray[index];
                features.forEach(function (feature) {
                    features[feature.JCGUID] = feature;
                });

                layer.features = features;
                return layer;
            });
            MapPreviewService.MapCanvas.init(map);
            floorChange(map);
            vm._map = map;
            canvas.init({
                map: $('#mapCanvas'),
                width: $('#mapContainer svg').width(),
                height: $('#mapContainer svg').height(),
                getPositionList: function (list) {
                    vm.positionStr = list.join(',');
                    $scope.$apply();
                },
            });
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }

    function floorChange(map) {
        $scope.$broadcast('map-change', {
            map: map,
        });
    }
}
