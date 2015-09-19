const angular = require('angular');
module.exports = angular.module('jcmap.feature.base.directive', [])
    .directive('jcmapFeatureBase', JCMapFeatureBaseDirective);


/* @ngInject*/
function JCMapFeatureBaseDirective(Restangular) {
    return {
        restrict: 'AE',
        scope: {
            jcLayerName: '@',
            jcObjId: '@',
            jcObjMask: '@',
        },
        template: `<image ng-repeat="feature in vm.features track by feature.JCGUID"
                ng-attr-x="{{ 0 }}"
                ng-attr-y="{{ 0 }}"
                ng-attr-width="{{ feature.JCRight }}"
                ng-attr-height="{{ feature.JCBottom }}"
                xlink:href=""
                ng-href="{{ feature.xhref }}" />`,
        replace: true,
        controller: JCMapFeatureBaseController,
        controllerAs: 'vm',
        templateNamespace: 'svg',
    };

    /* @ngInject */
    function JCMapFeatureBaseController($attrs) {
        const vm = this;
        const MapProfile = Restangular.all('map-profiles'); // :featureId
        const MapLayer = Restangular.all('map-layers'); // :layerName
        const MapFeature = Restangular.all('map-features'); // :featureId

        MapProfile.get(`${$attrs.jcObjId}:${$attrs.jcObjMask}`).then((profile) => {
            vm.profile = profile;

            return MapLayer.one($attrs.jcLayerName).get({
                profileId: `${$attrs.jcObjId}:${$attrs.jcObjMask}`,
            });
        }).then((layer) => {
            vm.layer = layer;

            return MapFeature.getList({
                JCObjId: $attrs.jcObjId,
                JCObjMask: $attrs.jcObjMask,
                JCLayerName: $attrs.jcLayerName,
            });
        }).then((features) => {
            features.forEach((feature) => {
                feature.xhref = `http://map-warehouse.jcbel.com/v1/maps/${feature.JCImage}`;
            });

            vm.features = features;
        });
    }
}
