const angular = require('angular');
module.exports = angular.module('jcmap.layer.draw.directive', [])
    .directive('jcmapLayerDraw', JCMapLayerDrawDirective);


/* @ngInject*/
function JCMapLayerDrawDirective() {
    return {
        restrict: 'AE',
        scope: {
            jcObjId: '@',
            jcObjMask: '@',
            jcLayerName: '@',
            onPathChange: '&',
        },
        template: `<g ng-attr-fill_opacity="{{ 0 }}" ng-transclude> </g>`,
        controller: JCMapLayerDrawController,
        controllerAs: 'vm',
        transclude: true,
        replace: true,
    };

    /* @ngInject */
    function JCMapLayerDrawController($attrs) {
        const vm = this;
        vm.onPathChange = $attrs.onPathChange;
    }
}
