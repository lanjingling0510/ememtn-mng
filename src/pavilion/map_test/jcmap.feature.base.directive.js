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
        link: link,
        templateNamespace: 'svg',
    };

    function link(scope) {
        const vm = scope.vm = {};
        const MapProfile = Restangular.all('map-profiles'); // :featureId
        const MapLayer = Restangular.all('map-layers'); // :layerName
        const MapFeature = Restangular.all('map-features'); // :featureId

        scope.$watch(() => {
            return `${lookupAttr(scope, 'jcObjId')}${lookupAttr(scope, 'jcObjMask')}`;
        }, loadLayer);

        function loadLayer() {
            const JCObjId = lookupAttr(scope, 'jcObjId');
            const JCObjMask = lookupAttr(scope, 'jcObjMask');
            const JCLayerName = lookupAttr(scope, 'jcLayerName');

            MapProfile.get(`${JCObjId}:${JCObjMask}`).then((profile) => {
                vm.profile = profile;

                return MapLayer.one(JCLayerName).get({
                    profileId: `${JCObjId}:${JCObjMask}`,
                });
            }).then((layer) => {
                vm.layer = layer;

                return MapFeature.getList({
                    JCObjId: JCObjId,
                    JCObjMask: JCObjMask,
                    JCLayerName: JCLayerName,
                });
            }).then((features) => {
                features.forEach((feature) => {
                    feature.xhref = `http://map-warehouse.jcbel.com/v1/maps/${feature.JCImage}`;
                });

                vm.features = features;
            });
        }
    }

    function lookupAttr(scope, attrName) {
        if (attrName === undefined) { return undefined; }
        let _scope = scope;
        while (_scope[attrName] === undefined && _scope.$parent) {
            _scope = _scope.$parent;
        }

        return _scope[attrName];
    }
}
