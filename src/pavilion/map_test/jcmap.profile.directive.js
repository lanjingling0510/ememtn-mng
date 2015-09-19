const angular = require('angular');
module.exports = angular.module('jcmap.profile.directive', [])
    .directive('jcmapProfile', JCMap);


/* @ngInject*/
function JCMap(Restangular) {
    const MapProfile = Restangular.all('map-profiles');

    return {
        restrict: 'AE',
        scope: {
            jcObjId: '@',
            jcObjMask: '@',
        },
        template: `<svg ng-attr-width="{{ vm.profile.JCRight }}"
            ng-attr-height="{{ vm.profile.JCBottom }}"
            ng-attr-view_box="0 0 {{ vm.profile.JCRight }} {{ vm.profile.JCBottom }}" ng-transclude></svg>`,
        controller: JCMapController,
        controllerAs: 'vm',
        transclude: true,
        replace: true,
    };

    /* @ngInject */
    function JCMapController($attrs) {
        const vm = this;
        vm.profile = MapProfile.get(`${$attrs.jcObjId}:${$attrs.jcObjMask}`).$object;
    }
}
