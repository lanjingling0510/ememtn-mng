require('./exhibition_hall_map.less');
require('../../common/service.js');
require('./exhibition_hall_map.service.js');
const angular = require('angular');

module.exports = angular.module('ememtn.exhibition-hall.map', [
        'ui.router',
        'sanya.common.services',
        'ememtn.exhibition_hall.map.service',
    ]).config(moduleConfig)
    .controller('ExhibitionHallMapController', ExhibitionHallMapController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibition-hall-map', {
        url: '/exhibition-hall/:floor/map',
        template: require('./exhibition_hall_map.html'),
        controller: 'ExhibitionHallMapController as vm',
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
function ExhibitionHallMapController($q, $stateParams, $scope, maps, MapService, MapPreviewService, Restangular, AlertService) {
    const vm = this;
    vm.maps = maps;
    vm.map = maps[0];
    fetchMap(vm.map);

    vm.fetchMap = fetchMap;

    vm.fetchLayers = fetchLayers;
    vm.fetchLayer = fetchLayer;

    vm.fetchFeatures = fetchFeatures;

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
            map.profile = profile;
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
            MapPreviewService.MapCanvas.init(map, $scope.$root.auth.accessToken);
        }).catch(function (err) {
            AlertService.warning(err.data);
        });
    }
}
