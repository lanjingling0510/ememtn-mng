const angular = require('angular');
module.exports = angular.module('jcmap.feature.text.directive', [])
    .directive('jcmapFeatureText', JCMapFeatureTextDirective);

/* @ngInject*/
function JCMapFeatureTextDirective(Restangular) {
    const MapLayer = Restangular.all('map-layers'); // :layerName
    const MapFeature = Restangular.all('map-features'); // :featureId

    return {
        restrict: 'AE',
        scope: {
            jcLayerName: '@',
            jcObjId: '@',
            jcObjMask: '@',
        },
        template: `<text ng-repeat="feature in vm.features track by feature.JCGUID"
            ng-attr-x="{{ (feature.JCLeft + feature.JCRight) / 2 }}"
            ng-attr-y="{{ (feature.JCTop + feature.JCBottom) / 2 }}"
            text-anchor="middle"
            fill="#143B2A">{{ feature._text }}</text>`,
        replace: true,
        controller: JCMapFeatureTextController,
        controllerAs: 'vm',
        templateNamespace: 'svg',
    };

    /* @ngInject */
    function JCMapFeatureTextController($attrs) {
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
            const fields = vm.layer.JCFormat.trim().split(' ').map((key) => {
                return key.slice(1);
            });
            features.forEach((feature) => {
                feature._text = fields.map((field) => {
                    return feature[field];
                }).join('');
            });
            vm.features = features;
        });
    }
}
