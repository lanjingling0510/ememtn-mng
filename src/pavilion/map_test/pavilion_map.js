require('./pavilion_map.less');

require('../../common/service.js');
require('./jcmap.profile.directive.js');
require('./jcmap.layer.common.directive.js');
require('./jcmap.layer.tile.directive.js');
require('./jcmap.feature.base.directive.js');
require('./jcmap.feature.point.directive.js');
require('./jcmap.feature.polygon.directive.js');
require('./jcmap.feature.text.directive.js');
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

/* @ngInject */
function PavilionMapTestController($q, Restangular) {
    const vm = this;
    const MapLayer = Restangular.all('map-layers'); // :layerName

    vm.onFloorChange = onFloorChange;

    function onFloorChange(floor) {
        vm.floor = floor;
        fetchLayers(floor);
    }

    function fetchLayers(floor) {
        return MapLayer.getList({ profileId: `${floor.JCObjId}:${floor.JCObjMask}` });
    }
}
