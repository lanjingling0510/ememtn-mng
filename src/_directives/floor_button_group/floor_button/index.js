const angular = require('angular');
module.exports = angular.module('jc.directive.floor-button', [])
    .directive('jcFloorButton', JCFloorButtonDirective);

/* @ngInject*/
function JCFloorButtonDirective() {
    return {
        restrict: 'E',
        scope: {
            floor: '=',
            active: '=',
            onFloorChange: '&',
        },
        template: require('./template.html'),
        // replace: true,
        link: link,
    };

    function link(scope) {
        scope.ngClick = function ngClick() {
            const func = scope.onFloorChange() || angular.noop;
            func(scope.floor);
        };
    }
}
