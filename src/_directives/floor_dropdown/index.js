const angular = require('angular');

module.exports = angular.module('jc.directive.floor-dropdown', [ ])
    .directive('jcFloorDropdown', JCFloorDropdownDirective);

/* @ngInject */
function JCFloorDropdownDirective() {
    return {
        restrict: 'E',
        scope: {
            floors: '=',
            onFloorChange: '&',
        },
        template: require('./template.html'),
        // replace: true,
        link: link,
    };

    function link(scope) {
        scope.ngModel = scope.floors[0];
        scope._onFloorChange = function _onFloorChange() {
            const func = scope.onFloorChange() || angular.noop;
            func(scope.ngModel);
        };
    }
}
