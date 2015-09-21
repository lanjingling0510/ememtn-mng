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
        link: link,
        templateNamespace: 'svg',
    };

    function link(scope) {
        const vm = scope.vm = {};

        scope.$watch(() => {
            return `${lookupAttr(scope, 'jcObjId')}${lookupAttr(scope, 'jcObjMask')}`;
        }, loadLayer);

        function loadLayer() {
            const JCObjId = lookupAttr(scope, 'jcObjId');
            const JCObjMask = lookupAttr(scope, 'jcObjMask');
            const JCLayerName = lookupAttr(scope, 'jcLayerName');

            MapLayer.one(JCLayerName).get({
                profileId: `${JCObjId}:${JCObjMask}`,
            }).then((layer) => {
                vm.layer = layer;

                return MapFeature.getList({
                    JCObjId: JCObjId,
                    JCObjMask: JCObjMask,
                    JCLayerName: JCLayerName,
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

    function lookupAttr(scope, attrName) {
        if (attrName === undefined) { return undefined; }
        let _scope = scope;
        while (_scope[attrName] === undefined && _scope.$parent) {
            _scope = _scope.$parent;
        }

        return _scope[attrName];
    }
}
