require('./pavilion_map.less');

require('../../common/service.js');
require('./jcmap.profile.directive.js');
require('./jcmap.layer.common.directive.js');
require('./jcmap.layer.tile.directive.js');
require('./jcmap.feature.base.directive.js');
require('./jcmap.feature.point.directive.js');
require('./jcmap.feature.polygon.directive.js');
require('./jcmap.feature.text.directive.js');
const config = require('../../config.json');
const angular = require('angular');

module.exports = angular.module('ememtn.pavilion.map-test', [
    'ui.router',
    'ememtn.common.services',
    'jcmap.profile.directive',
    'jcmap.layer.common.directive',
    'jcmap.layer.tile.directive',
    'jcmap.feature.base.directive',
    'jcmap.feature.point.directive',
    'jcmap.feature.polygon.directive',
    'jcmap.feature.text.directive',
]).config(moduleConfig)
    .controller('PavilionMapTestController', PavilionMapTestController);

/* @ngInject */
function moduleConfig($stateProvider) {
    $stateProvider.state('pavilion-map-test', {
        url: '/pavilion_map_test',
        template: require('./pavilion_map.html'),
        controller: 'PavilionMapTestController as vm',
    });
}

function destructureProfileId(profileId) {
    const [JCObjId, JCObjMask] = profileId.split(':');
    return {
        JCObjId: JCObjId,
        JCObjMask: JCObjMask,
    };
}

function getProfileId(floor) {
    return `${floor.JCObjId}:${floor.JCObjMask}`;
}

/* @ngInject */
function PavilionMapTestController($q, Restangular) {
    const vm = this;
    const MapProfile = Restangular.all('map-profiles'); // :profileId
    const MapLayer = Restangular.all('map-layers'); // :layerName
    const MapFeature = Restangular.all('map-features'); // :featureId


    vm.floors = config.floors.slice(1);
    vm.floor = vm.floors[0];
    vm.profileId = getProfileId(vm.floor);
    vm.fetchProfile = fetchProfile;
    vm.fetchLayers = fetchLayers;
    vm.fetchLayer = fetchLayer;
    vm.fetchFeatures = fetchFeatures;

    fetchProfile(`${vm.floor.JCObjId}:${vm.floor.JCObjMask}`).then((profile) => {
        vm.profile = profile;
    });
    // fetchLayers(vm.profileId);

    function fetchProfile(profileId) {
        return MapProfile.get(profileId);
    }

    function fetchLayers(profileId) {
        return MapLayer.getList({ profileId: profileId });
    }

    function fetchLayer(profileId, JCLayerName) {
        return MapLayer.one(JCLayerName).get({ profileId: profileId });
    }

    function fetchFeatures(profileId, JCLayerName) {
        const JCObjs = destructureProfileId(profileId);
        return MapFeature.getList({
            JCObjId: JCObjs.JCObjId,
            JCObjMask: JCObjs.JCObjMask,
            JCLayerName: JCLayerName,
        });
    }
}
