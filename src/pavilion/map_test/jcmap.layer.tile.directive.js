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
        controller: JCMapLayerTileController,
        controllerAs: 'vm',
        transclude: true,
        replace: true,
    };

    /* @ngInject */
    function JCMapLayerTileController($attrs) {
        const vm = this;
        const MapLayer = Restangular.all('map-layers');
        vm.getFill = vm.getFill;
        vm.layer = {};


        MapLayer.one($attrs.jcLayerName).get({
            profileId: `${$attrs.jcObjId}:${$attrs.jcObjMask}`,
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
}
