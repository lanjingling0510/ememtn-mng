const angular = require('angular');
module.exports = angular.module('jcmap.profile.directive', [])
    .directive('jcmapProfile', JCMapProfileDirective);


/* @ngInject*/
function JCMapProfileDirective(Restangular) {
    return {
        restrict: 'AE',
        scope: {
            jcObjId: '@',
            jcObjMask: '@',
        },
        template: `<svg ng-style="vm.style"
            ng-attr-width="{{ vm.profile.JCRight }}"
            ng-attr-height="{{ vm.profile.JCBottom }}"
            ng-attr-view_box="0 0 {{ vm.profile.JCRight }} {{ vm.profile.JCBottom }}"
            ng-mousedown="vm.onMouseDown($event)"
            ng-mousemove="vm.onMouseMove($event)"
            ng-mouseup="vm.onMouseUp($event)"
            ng-transclude></svg>`,
        transclude: true,
        replace: true,
        link: link,
    };

    function link(scope, elem, attrs) {
        const vm = {};
        scope.vm = vm;
        const MapProfile = Restangular.all('map-profiles');

        const LEFT_BUTTON = 0;
        vm.onMouseDown = onMouseDown;
        vm.onMouseMove = onMouseMove;
        vm.onMouseUp = onMouseUp;
        vm.style = {};
        let isMouseHold = false;

        vm.profile = MapProfile.get(`${attrs.jcObjId}:${attrs.jcObjMask}`).$object;

        function onMouseDown($event) {
            if ($event.button === LEFT_BUTTON) {
                isMouseHold = true;
                vm.style.cursor = 'move';
            }
        }

        function onMouseMove($event) {
            if (isMouseHold) {
                const root = $event.target.ownerSVGElement;
                const parts = root.style.transform.slice(10).split(',');

                const translateX = parseInt(parts[0], 10) || 0;
                const translateY = parseInt(parts[1], 10) || 0;

                const movementX = $event.movementX;
                const movementY = $event.movementY;
                // const movementX = $event.pageX - mouseDownLastAt.pageX;
                // const movementY = $event.pageY - mouseDownLastAt.pageY;

                const newX = translateX + movementX;
                const newY = translateY + movementY;

                root.style.transform = `translate(${newX}px, ${newY}px)`;
            }
        }

        function onMouseUp($event) {
            if ($event.button === LEFT_BUTTON) {
                isMouseHold = false;
                delete vm.style.cursor;
            }
        }
    }
}
