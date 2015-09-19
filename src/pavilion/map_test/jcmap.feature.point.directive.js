const angular = require('angular');
module.exports = angular.module('jcmap.feature.point.directive', [])
    .directive('jcmapFeaturePoint', JCMapFeaturePointDirective);


/* @ngInject*/
function JCMapFeaturePointDirective(Restangular) {
    return {
        restrict: 'AE',
        scope: {
            jcLayerName: '@',
            jcObjId: '@',
            jcObjMask: '@',
        },
        template: `<circle ng-repeat="feature in vm.features track by feature.JCGUID"
                ng-attr-cy="{{ feature.JCTop }}"
                ng-attr-cx="{{ feature.JCLeft }}"
                ng-attr-r="{{ vm.JCSize || 5 }}">
            </circle>`,
        replace: true,
        controller: JCMapFeaturePointController,
        controllerAs: 'vm',
        templateNamespace: 'svg',
    };

    /* @ngInject */
    function JCMapFeaturePointController($attrs) {
        const vm = this;
        const MapLayer = Restangular.all('map-layers'); // :layerName
        const MapFeature = Restangular.all('map-features'); // :featureId

        MapLayer.one($attrs.jcLayerName).get({
            profileId: `${$attrs.jcObjId}:${$attrs.jcObjMask}`,
        }).then((layer) => {
            if (!layer) {
                console.log($attrs.JCLayerName);
            }
            vm.layer = layer;
            vm.JCSize = layer.JCSize;

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
