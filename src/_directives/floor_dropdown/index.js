const angular = require('angular');

module.exports = angular.module('jc.directive.floor-dropdown', [ ])
    .directive('jcFloorDropdown', JCFloorDropdownDirective);

/* @ngInject */
function JCFloorDropdownDirective() {
    return {
        restrict: 'E',
        scope: {
            floors: '=',
            floor: '=',
            onFloorChange: '&',
        },
        template: require('./template.html'),
        // replace: true,
        link: link,
    };

    function link(scope) {
        scope.floor = scope.floor || scope.floors[0];
        scope._onFloorChange = function _onFloorChange() {
            const func = scope.onFloorChange() || angular.noop;
            func(scope.floor);
        };
    }
}
