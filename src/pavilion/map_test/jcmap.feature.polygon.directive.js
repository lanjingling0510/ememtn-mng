const angular = require('angular');
module.exports = angular.module('jcmap.feature.polygon.directive', [])
    .directive('jcmapFeaturePolygon', JCMapFeaturePolygonDirective);

/* @ngInject*/
function JCMapFeaturePolygonDirective(Restangular) {
    const MapLayer = Restangular.all('map-layers'); // :layerName
    const MapFeature = Restangular.all('map-features'); // :featureId

    return {
        restrict: 'AE',
        scope: {
            jcLayerName: '@',
            jcObjId: '@',
            jcObjMask: '@',
        },
        template: `<polygon ng-repeat="feature in vm.features track by feature.JCGUID"
                ng-attr-points="{{ feature.JCGeoData }}">
            </polygon>`,
        replace: true,
        controller: JCMapFeaturePolygonController,
        controllerAs: 'vm',
        templateNamespace: 'svg',
    };

    /* @ngInject */
    function JCMapFeaturePolygonController($attrs) {
        const vm = this;

        MapLayer.one($attrs.jcLayerName).get({
            profileId: `${$attrs.jcObjId}:${$attrs.jcObjMask}`,
        }).then((layer) => {
            vm.layer = layer;

            return MapFeature.getList({
                JCObjId: $attrs.jcObjId,
                JCObjMask: $attrs.jcObjMask,
                JCLayerName: $attrs.jcLayerName,
            });
        }).then((features) => {
            vm.features = features;
        });
    }
}
