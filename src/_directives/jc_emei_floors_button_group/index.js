const angular = require('angular');
const config = require('../../config.json');
module.exports = angular.module('jc.emei.floors.button_group.directive', [])
    .directive('jcEmeiFloorsButtonGroup', JCEmeiFloorsButtonGroupDirective);

/* @ngInject*/
function JCEmeiFloorsButtonGroupDirective() {
    return {
        restrict: 'E',
        scope: {
            onFloorChange: '&',
            ngModel: '=',
        },
        template: require('./template.html'),
        replace: true,
        link: link,
    };

    function link(scope) {
        const vm = scope.vm = {};
        vm.floors = config.floors.slice(1);
        vm.floor = vm.floors[0];
        scope.ngModel = scope.ngModel || {};
        scope.ngModel.floor = vm.floor;
        scope.onFloorChange()(vm.floor);
        vm.changeFloor = changeFloor;

        function changeFloor($event, floor) {
            vm.floor = floor;
            setCurrentFloor($event);
            scope.ngModel.floor = floor;
            scope.onFloorChange()(floor);
        }

        function cleanActivation($event) {
            const nodes = Array.prototype.slice.call($event.target.parentNode.childNodes).filter((d) => {
                return d.type === 'button';
            });
            nodes.forEach((node) => {
                const classList = node.className.split(' ').filter((c) => {
                    return c !== 'active';
                });
                node.className = classList.join(' ');
            });
        }

        function setCurrentFloor($event) {
            cleanActivation($event);

            const classList = $event.target.className.split(' ');
            if (!~classList.indexOf('active')) {
                classList.push('active');
            }
            $event.target.className = classList.join(' ');
        }
    }
}
