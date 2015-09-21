const angular = require('angular');
module.exports = angular.module('jcmap.layer.tile.directive', [])
    .directive('jcmapLayerTile', JCMapLayerTileDirective);


/* @ngInject*/
function JCMapLayerTileDirective(Restangular) {
    return {
        restrict: 'AE',
        scope: {
            jcObjId: '@',
            jcObjMask: '@',
            jcLayerName: '@',
        },
        template: `<g ng-transclude> </g>`,
        link: link,
        transclude: true,
        replace: true,
    };

    /* @ngInject */
    function link(scope) {
        const vm = scope.vm = {};
        const MapLayer = Restangular.all('map-layers');
        vm.getFill = vm.getFill;
        vm.layer = {};


        MapLayer.one(scope.jcLayerName).get({
            profileId: `${lookupAttr(scope, 'jcObjId')}:${lookupAttr(scope, 'jcObjMask')}`,
        }).then((layer) => {
            vm.layer = layer;
            vm.JCSize = layer.JCSize;
            vm.fill = getFill(layer);
            vm.fillOpaciity = getFillOpacity(layer);
        });

        function getFill(layer) {
            let color = Number(layer.JCARGB % 0x1000000).toString(16);
            while (color.length < 6) {
                color = '0' + color;
            }
            return '#' + color;
        }

        function getFillOpacity(layer) {
            return parseInt(layer.JCARGB / 0x1000000, 10) / 0xFF;
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
