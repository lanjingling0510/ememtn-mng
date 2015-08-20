require('./exhibition_hall.less');
require('../common/service.js');
require('./exhibition_hall.service.js');
const angular = require('angular');

module.exports = angular.module('ememtn.exhibition-hall', [
        'ui.router',
        'sanya.common.services',
    ]).config(moduleConfig)
    .controller('POIController', POIController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('exhibition-hall', {
        url: '/exhibition-hall/:floor',
        template: require('./exhibition_hall.html'),
        controller: 'POIController as vm',
    });
}

/*@ngInject*/
function POIController(Restangular, AlertService) {
    const vm = this;
    vm.fetchMapProfiles = fetchMapProfiles;
    vm.fetchMap = fetchMap;
    vm.saveProfile = saveProfile;
    vm.deleteProfile = deleteProfile;

    vm.fetchLayers = fetchLayers;
    vm.fetchLayer = fetchLayer;
    vm.createLayer = createLayer;

    vm.fetchFeatures = fetchFeatures;
    vm.saveFeature = saveFeature;
    vm.deleteFeature = deleteFeature;

    initController();

    function fetchMapProfiles() {
        MapService.MapProfile.query().$promise
        .then((maps) => {
            $scope.maps = maps;
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function saveProfile(profile) {
        profile.profileId = profile.JCObjId + ':' + profile.JCObjMask;

        if (profile.JC_Id) {
            MapService.MapProfile.update(profile).$promise
            .then(() => {
                AlertService.success('操作成功');
            }).catch((err) => {
                AlertService.warning(err.data);
            });
        } else {
            MapService.MapProfile.$save(profile).$promise
            .then(() => {
                $scope.fetchBase($routeParams.profileId);
                AlertService.success('操作成功');
            }).catch((err) => {
                AlertService.warning(err.data || err.statusText);
            });
        }
    }

    function deleteProfile() { // profile
        const condition = {
            profileId: $routeParams.profileId,
        };

        MapService.MapProfile.remove(condition).$promise
        .then(() => {
            AlertService.success('操作成功');
            $location.path('/maps');
        }).catch((err) => {
            AlertService.warning(err.data || err.statusText);
        });
    }

    function fetchLayers(profileId) {
        MapService.MapLayer.query({
            profileId: profileId,
        }).$promise
        .then((layers) => {
            $scope.map.layers = layers;
        }).catch((err) => {
            AlertService.warning(err.data || err.statusText);
        });
    }

    function fetchLayer(JCLayerName) {
        MapService.MapLayer.get({
            profileId: $scope.params.profileId,
            JCLayerName: JCLayerName,
        }).$promise
        .then((layer) => {
            $scope.map.layers[layer.JCLayerName] = layer;
        }).catch((err) => {
            AlertService.warning(err.data || err.statusText);
        });
    }

    function createLayer(layer) {
        layer.JCObjId = $scope.map.JCObjId;
        layer.JCObjMask = $scope.map.JCObjMask;

        if (layer.JC_Id) {
            MapService.Base.update(layer).$promise
            .then(() => {
                AlertService.success('操作成功');
            }).catch((err) => {
                AlertService.warning(err.data || err.statusText);
            });
        } else {
            MapService.Base.$save(layer).$promise
            .then(() => {
                $scope.fetchBase($routeParams.profileId);
                AlertService.success('操作成功');
            }).catch((err) => {
                AlertService.warning(err.data || err.statusText);
            });
        }
    }

    function fetchFeatures(profileId, JCLayerName) {
        MapService.Beacon.query({
            profileId: profileId,
            JCLayerName: JCLayerName,
        }).$promise
        .then((features) => {
            $scope.map.layers[JCLayerName].features = features;
        }).catch( (err) => {
            AlertService.warning(err.data || err.statusText);
        });
    }

    function saveFeature(layer, feature) {
        const updates = {
            profileId: $routeParams.profileId,
            featureId: feature.JCGUID,
            layer: layer,
            feature: feature,
        };

        if (feature.JC_Id) {
            MapService.MapFeature.update(updates).$promise
            .then(() => {
                // var index = _.findIndex($scope.map.layers[layer.JCName].features, function (bc) {
                //     return bc.JC_Id === feature.JC_Id;
                // });
                // $scope.map.layers[layer.JCName].features[index] = feature;
                AlertService.success('操作成功');
            }).catch((err) => {
                AlertService.warning(err.data || err.statusText);
            });
        } else {
            MapService.MapFeature.$save(updates).$promise
            .then(() => {
                $scope.fetchFeatures($routeParams.profileId);
                AlertService.success('操作成功');
            }).catch((err) => {
                AlertService.warning(err.data || err.statusText);
            });
        }
    }

    function deleteFeature(layer, feature) {
        const deletion = {
            profileId: $routeParams.profileId,
            featureId: feature.JCGUID,
            JCLayerName: layer.JCName,
        };

        MapService.MapFeature.remove(deletion).$promise
        .then(() => {
            const index = _.findIndex($scope.map.layers[layer.JCName].features, (item) => {
                return item.JCGUID === feature.JCGUID;
            });
            $scope.map.layers[layer.JCName].features.splice(index, 1);
            delete $scope.map.layers[layer.JCName].features[feature.jcguid];
            $scope.currentFeature = undefined;
            AlertService.success('删除成功');
        }).catch((err) => {
            AlertService.warning(err.data);
        });
    }

    function fetchMap(profileId) {
        const map = {};
        const parts = profileId.split(':');
        const JCObjId = parts[0];
        const JCObjMask = parts[1];

        MapService.MapProfile.get({ profileId: profileId }).$promise
        .then((profile) => {
            map.profile = profile;
            return MapService.MapLayer.query({
                profileId: profileId,
                JCObjId: JCObjId,
                JCObjMask: JCObjMask,
            }).$promise;
        }).then((layers) => {
            layers.forEach((layer) => {
                const JCLayerName = layer.JCName;

                layer.BKFields = layer.JCFields.split(' ').map((field) => {
                    const pats = field.split(',');
                    return {
                        name: pats[0],
                        type: pats[1],
                    };
                });

                layers[JCLayerName] = layer;

                MapService.MapFeature.query({
                    profileId: profileId,
                    JCObjId: JCObjId,
                    JCObjMask: JCObjMask,
                    JCLayerName: JCLayerName,
                }).$promise
                .then((features) => {
                    features.forEach((feature) => {
                        features[feature.JCGUID] = feature;
                    });

                    layer.features = features;
                }).catch((err) => {
                    AlertService.warning(err.data || err.statusText);
                });
            });

            map.layers = layers;
            $scope.map = map;
        }).catch((err) => {
            AlertService.warning(err.data || err.statusText);
        });
    }

    function initController() {
        if ($routeParams.profileId) {
            if ($routeParams.profileId !== 'new') {
                const MapCanvas = MapPreviewService.MapCanvas;

                $scope.$watch('map', (newValue) => {
                    if (newValue) { MapCanvas.init('.map-preview', newValue, $scope.$root.wormhole_token); }
                }, true);

                $scope.fetchMap($routeParams.profileId);
            } else {
                $scope.map = {};
            }
        } else {
            $scope.fetchMapProfiles();
        }
    }
}
