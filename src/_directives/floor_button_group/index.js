const angular = require('angular');
require('./floor_button');

module.exports = angular.module('jc.directive.floor-button-group', [
    'jc.directive.floor-button',
]).directive('jcFloorButtonGroup', JCFloorButtonGroupDirective);

/* @ngInject */
function JCFloorButtonGroupDirective() {
    return {
        restrict: 'E',
        scope: {
            floors: '=',
            onFloorChange: '&',
            ngModel: '=',
            current: '=',
        },
        template: require('./template.html'),
        // replace: true,
        link: link,
    };

    function link(scope) {
        scope.ngModel = scope.current = scope.floors[0];
        scope.onFloorChange = scope.onFloorChange() || angular.noop;
    }
}
